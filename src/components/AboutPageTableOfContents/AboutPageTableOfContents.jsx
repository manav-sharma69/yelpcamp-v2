'use client'

import { ABOUT_PAGE_SECTIONS } from '@/app/about/page'
import { Link, Table } from '@radix-ui/themes'

export default function TableOfContents() {
  function handleClick(e, id) {
    console.log({ id })
    e.preventDefault()
    const section = document.getElementById(id)
    if (!section) return
    section.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    })
  }

  return (
    <Table.Root size={'1'} layout={'auto'} variant="surface">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Table of Contents</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {SECTION_LINKS.map(({ id, label }) => (
          <Table.Row key={label}>
            <Table.Cell>
              <Link href={`#${id}`} onClick={(e) => handleClick(e, id)}>
                {label}
              </Link>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  )
}

const SECTION_LINKS = Object.entries(ABOUT_PAGE_SECTIONS).map(
  ([key, section]) => ({
    id: section,
    label: key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
  })
)
