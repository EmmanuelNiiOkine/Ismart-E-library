# Downloaded Books

Local storage for legal documents acquired for the ISMART E-Library.

## Structure

```
downloaded-books/
├── statutes-and-legislation/
│   └── acts-of-ghana/          # Acts of Parliament (Ghana)
│       ├── manifest.json       # Download log and metadata
│       └── by-year/
│           ├── 1962/
│           ├── 2019/
│           └── ...
├── law-reports/
├── court-cases/
└── ...
```

## Source

Ghana Acts are downloaded from [GhaLII](https://ghalii.org/) (Ghana Legal Information Institute), the official free public legal database for Ghana.

## Download scripts

From the project root:

```bash
cd scripts
pip install -r requirements.txt
playwright install chromium

# List acts found (no download)
python download_ghana_acts.py --dry-run

# Download all Acts of Ghana
python download_ghana_acts.py

# Download first 20 (testing)
python download_ghana_acts.py --limit 20
```
