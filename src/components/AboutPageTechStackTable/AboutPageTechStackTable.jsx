import { Table } from '@radix-ui/themes'

export default function TechStackTable() {
  return (
    <Table.Root variant="surface" layout={'auto'}>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Category</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>V1</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>V2</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {TECH_STACK.map(({ part, v1, v2 }) => (
          <Table.Row key={part}>
            <Table.RowHeaderCell style={{ fontWeight: 'bold' }}>
              {part}
            </Table.RowHeaderCell>
            <Table.Cell>{v1.join(', ')}</Table.Cell>
            <Table.Cell>{v2.join(', ')}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  )
}

const TECH_STACK = [
  {
    part: 'Frontend',
    v1: ['HTML5', 'Bootstrap', 'CSS', 'EJS'],
    v2: [
      'React (Next.js)',
      'Radix UI',
      'Embla Carousel',
      'React Star Rating',
      'CSS Modules'
    ]
  },
  {
    part: 'API Layer',
    v1: ['Express.js'],
    v2: ['React Server Actions']
  },
  {
    part: 'Database',
    v1: ['MongoDB'],
    v2: ['PostgreSQL']
  },
  {
    part: 'Maps',
    v1: ['Mapbox'],
    v2: ['MapTiler']
  },
  {
    part: 'Image Storage',
    v1: ['Cloudinary'],
    v2: ['UploadThing']
  },
  {
    part: 'Authentication',
    v1: ['Session-based Authentication (Passport.js)'],
    v2: ['Auth.js (NextAuth)']
  },
  {
    part: 'Deployment',
    v1: ['Render'],
    v2: ['Vercel']
  }
]
