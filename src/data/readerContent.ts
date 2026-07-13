export interface ReaderSection {
  id: string
  title: string
  pages: string[]
}

export function getReaderSections(_documentId: string): ReaderSection[] {
  const base = [
    {
      id: 'preamble',
      title: 'Preamble',
      pages: [
        `This Act may be cited as the principal legislation governing the subject matter set out in the title, and shall come into operation on such date as the Minister may, by legislative instrument, appoint.

Whereas it is expedient to consolidate and amend the law relating to the administration, interpretation, and application of statutory provisions within the Republic of Ghana;

And whereas Parliament considers it necessary to provide a clear framework for compliance, enforcement, and the rights and obligations of persons affected thereby;

Be it enacted by the President and Parliament as follows:`,
      ],
    },
    {
      id: 'part-1',
      title: 'Part I — Preliminary',
      pages: [
        `1. Interpretation

In this Act, unless the context otherwise requires—

"Minister" means the Minister responsible for Justice;
"person" includes a body corporate and an unincorporated body of persons;
"regulations" means regulations made under this Act;
"Republic" means the Republic of Ghana.

2. Application

This Act applies throughout Ghana and binds the State, every public officer, and every person within the jurisdiction of the courts of Ghana.`,
        `3. Objects of the Act

The objects of this Act are to—

(a) promote clarity and accessibility of the law;
(b) ensure consistent application of statutory provisions;
(c) protect the rights of persons subject to obligations created by law; and
(d) provide effective mechanisms for enforcement and review.`,
      ],
    },
    {
      id: 'part-2',
      title: 'Part II — Administration',
      pages: [
        `4. Establishment of office

There is established by this Act an office charged with responsibility for the administration of matters arising under this Act.

5. Functions of the office

The office shall—

(a) receive and process applications made under this Act;
(b) maintain a register of persons and matters falling within its jurisdiction;
(c) issue certificates, notices, and directions as may be required;
(d) cooperate with other public authorities in the discharge of its functions.`,
        `6. Powers of the office

For the purposes of performing its functions, the office may—

(a) require the production of documents and information;
(b) enter premises at reasonable times upon giving notice;
(c) delegate any function to an officer authorised in writing;
(d) charge fees as prescribed by regulations.`,
      ],
    },
    {
      id: 'part-3',
      title: 'Part III — Offences and penalties',
      pages: [
        `7. Offences

A person commits an offence who—

(a) knowingly makes a false statement in an application or return;
(b) obstructs an officer in the exercise of powers under this Act;
(c) fails to comply with a lawful direction issued under section 6.

8. Penalties

A person convicted of an offence under this Act is liable on summary conviction to a fine not exceeding five hundred penalty units or to imprisonment for a term not exceeding twelve months, or to both.`,
      ],
    },
  ]

  return base
}

export function flattenReaderPages(sections: ReaderSection[]): {
  sectionId: string
  sectionTitle: string
  content: string
  pageLabel: number
}[] {
  const pages: { sectionId: string; sectionTitle: string; content: string; pageLabel: number }[] = []
  let pageNum = 1
  for (const section of sections) {
    for (const content of section.pages) {
      pages.push({ sectionId: section.id, sectionTitle: section.title, content, pageLabel: pageNum })
      pageNum += 1
    }
  }
  return pages
}
