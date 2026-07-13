#!/usr/bin/env python3
"""
Download Acts of Parliament of Ghana from GhaLII into downloaded-books/.

Only standard Acts are included (Act NNN of YYYY), excluding decrees,
constitutional instruments, legislative instruments, etc.

Usage:
  python download_ghana_acts.py [--dry-run] [--limit N] [--page-start N]
"""

from __future__ import annotations

import argparse
import json
import re
import time
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright

BASE_URL = "https://ghalii.org"
LISTING_URL = f"{BASE_URL}/legislation/all"
PROJECT_ROOT = Path(__file__).resolve().parent.parent
OUTPUT_DIR = PROJECT_ROOT / "downloaded-books" / "statutes-and-legislation" / "acts-of-ghana"
MANIFEST_PATH = OUTPUT_DIR / "manifest.json"

# Standard Acts: /akn/gh/act/{year}/{number}/eng@{date}
ACT_PATH_RE = re.compile(
    r"^/akn/gh/act/(?P<year>\d{4})/(?P<number>\d+)/eng@(?P<date>\d{4}-\d{2}-\d{2})$"
)

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    )
}


@dataclass
class ActEntry:
    title: str
    year: str
    act_number: str
    date: str
    path: str
    url: str
    pdf_url: str
    filename: str
    file_path: str
    status: str = "pending"
    file_size_bytes: int | None = None
    downloaded_at: str | None = None
    error: str | None = None


def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text).strip("-")
    return text[:80] or "untitled"


def make_filename(entry: ActEntry) -> str:
    slug = slugify(entry.title)
    return f"Act-{entry.act_number}-of-{entry.year}-{slug}.pdf"


def fetch_listing_page(page: int) -> list[tuple[str, str]]:
    """Return list of (path, title) from a listing page."""
    url = LISTING_URL if page == 1 else f"{LISTING_URL}?page={page}"
    resp = requests.get(url, headers=HEADERS, timeout=60)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")
    results: list[tuple[str, str]] = []
    for a in soup.select('a[data-key-link="document"]'):
        href = a.get("href", "")
        title = a.get_text(strip=True)
        if href and title and ACT_PATH_RE.match(href):
            results.append((href, title))
    return results


def discover_acts(max_pages: int = 100) -> list[ActEntry]:
    """Scrape GhaLII listing pages for all standard Acts."""
    seen: set[str] = set()
    acts: list[ActEntry] = []

    for page in range(1, max_pages + 1):
        try:
            items = fetch_listing_page(page)
        except requests.RequestException as exc:
            print(f"  Page {page}: failed ({exc})")
            break
        if not items:
            print(f"  Page {page}: empty — done.")
            break
        new_count = 0
        for path, title in items:
            if path in seen:
                continue
            seen.add(path)
            m = ACT_PATH_RE.match(path)
            if not m:
                continue
            entry = ActEntry(
                title=title,
                year=m.group("year"),
                act_number=m.group("number"),
                date=m.group("date"),
                path=path,
                url=f"{BASE_URL}{path}",
                pdf_url=f"{BASE_URL}{path}/source",
                filename="",
                file_path="",
            )
            entry.filename = make_filename(entry)
            entry.file_path = str(
                OUTPUT_DIR / "by-year" / entry.year / entry.filename
            )
            acts.append(entry)
            new_count += 1
        print(f"  Page {page}: {new_count} acts ({len(acts)} total)")
        if new_count == 0:
            break
        time.sleep(0.5)

    return acts


def load_manifest() -> dict:
    if MANIFEST_PATH.exists():
        return json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    return {
        "collection": "Acts of Ghana",
        "source": "https://ghalii.org",
        "category": "statutes-and-legislation",
        "started_at": None,
        "updated_at": None,
        "acts": [],
    }


def save_manifest(manifest: dict, acts: list[ActEntry]) -> None:
    manifest["updated_at"] = datetime.now(timezone.utc).isoformat()
    manifest["total"] = len(acts)
    manifest["downloaded"] = sum(1 for a in acts if a.status == "downloaded")
    manifest["failed"] = sum(1 for a in acts if a.status == "failed")
    manifest["skipped"] = sum(1 for a in acts if a.status == "skipped")
    manifest["acts"] = [asdict(a) for a in acts]
    MANIFEST_PATH.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2), encoding="utf-8")


def wait_for_ghalii(page) -> None:
    """Wait until Cloudflare challenge completes."""
    for _ in range(30):
        title = page.title().lower()
        if "just a moment" not in title and "security" not in title:
            return
        time.sleep(2)
    raise TimeoutError("Cloudflare challenge did not complete")


def download_pdfs(acts: list[ActEntry], delay: float = 1.5) -> None:
    """Download PDFs using Playwright (bypasses Cloudflare)."""
    with sync_playwright() as p:
        try:
            browser = p.chromium.launch(headless=True, channel="chrome")
        except Exception:
            browser = p.chromium.launch(headless=True)

        context = browser.new_context(
            user_agent=HEADERS["User-Agent"],
            accept_downloads=True,
        )
        page = context.new_page()

        print("  Warming up GhaLII session...")
        page.goto(BASE_URL, wait_until="domcontentloaded", timeout=120_000)
        wait_for_ghalii(page)
        time.sleep(2)

        for i, act in enumerate(acts, 1):
            dest = Path(act.file_path)
            if dest.exists() and dest.stat().st_size > 10_000:
                act.status = "skipped"
                act.file_size_bytes = dest.stat().st_size
                print(f"  [{i}/{len(acts)}] skip  {act.filename}")
                continue

            dest.parent.mkdir(parents=True, exist_ok=True)
            print(f"  [{i}/{len(acts)}] fetch {act.title[:60]}...")

            try:
                page.goto(act.url, wait_until="domcontentloaded", timeout=120_000)
                wait_for_ghalii(page)
                page.wait_for_selector('a[href$="/source"]', timeout=60_000)
                time.sleep(1)

                with page.expect_download(timeout=120_000) as download_info:
                    page.locator('a[href$="/source"]').first.click()
                download = download_info.value
                download.save_as(dest)

                header = dest.read_bytes()[:4]
                if header != b"%PDF":
                    dest.unlink(missing_ok=True)
                    raise ValueError("Downloaded file is not a valid PDF")

                act.status = "downloaded"
                act.file_size_bytes = dest.stat().st_size
                act.downloaded_at = datetime.now(timezone.utc).isoformat()
                print(f"           saved {act.file_size_bytes // 1024} KB")

            except Exception as exc:  # noqa: BLE001
                act.status = "failed"
                act.error = str(exc)[:200]
                print(f"           FAILED: {act.error}")
                dest.unlink(missing_ok=True)

            time.sleep(delay)

        browser.close()


def main() -> None:
    parser = argparse.ArgumentParser(description="Download Ghana Acts from GhaLII")
    parser.add_argument("--dry-run", action="store_true", help="Discover only, no download")
    parser.add_argument("--limit", type=int, default=0, help="Max acts to download (0 = all)")
    parser.add_argument("--delay", type=float, default=1.5, help="Seconds between downloads")
    parser.add_argument("--max-pages", type=int, default=100, help="Max listing pages to scan")
    args = parser.parse_args()

    print("ISMART E-Library — Ghana Acts downloader")
    print(f"Output: {OUTPUT_DIR}\n")

    print("Discovering Acts on GhaLII...")
    acts = discover_acts(max_pages=args.max_pages)
    print(f"\nFound {len(acts)} Acts of Parliament.\n")

    if args.limit > 0:
        acts = acts[: args.limit]
        print(f"Limited to {args.limit} acts.\n")

    if args.dry_run:
        for act in acts[:10]:
            print(f"  {act.year} | Act {act.act_number} | {act.title}")
        if len(acts) > 10:
            print(f"  ... and {len(acts) - 10} more")
        return

    manifest = load_manifest()
    if not manifest.get("started_at"):
        manifest["started_at"] = datetime.now(timezone.utc).isoformat()

    print("Downloading PDFs (this may take a while)...")
    download_pdfs(acts, delay=args.delay)

    save_manifest(manifest, acts)
    print(f"\nDone. Manifest: {MANIFEST_PATH}")
    print(
        f"Downloaded: {sum(1 for a in acts if a.status == 'downloaded')} | "
        f"Skipped: {sum(1 for a in acts if a.status == 'skipped')} | "
        f"Failed: {sum(1 for a in acts if a.status == 'failed')}"
    )


if __name__ == "__main__":
    main()
