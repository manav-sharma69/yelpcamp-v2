import TableOfContents from '@/components/AboutPageTableOfContents'
import TechStackTable from '@/components/AboutPageTechStackTable'
import ResponsiveContainer from '@/components/RespContainer'

import {
  Flex,
  Heading,
  Link,
  Section as RTSection,
  Text as RTText
} from '@radix-ui/themes'

export default function AboutPage() {
  return (
    <>
      <ResponsiveContainer>
        <RTSection asChild>
          <Heading
            align={'center'}
            size={{ md: '9', xs: '8' }}
            weight={'regular'}
          >
            About Yelpcamp
          </Heading>
        </RTSection>

        <Section align={'unset'}>
          <TableOfContents />
        </Section>

        <Section id={ABOUT_PAGE_SECTIONS.projectOverview}>
          <Heading2>Overview</Heading2>

          <Text>
            Yelpcamp v2 is a modern reimagining of the original YelpCamp project
            taught by Colt Steele in his full-stack web development bootcamp.
          </Text>

          <div>
            <Text>
              This version focuses on improving both the user experience and the
              overall visual design. The UI and feature set are loosely inspired
              by platforms like{' '}
              <Link href={LINKS.airbnb} target="_blank">
                Airbnb
              </Link>{' '}
              and{' '}
              <Link href={LINKS.hipcamp} target="_blank">
                Hipcamp
              </Link>
              , introducing concepts such as:
            </Text>
            <ul>
              <li>Interactive carousel-based campground cards</li>
              <li>A dedicated “host” experience for campground creators</li>
              <li>A cleaner and more modern browsing experience</li>
              <li>Improved media handling and performance</li>
            </ul>
          </div>

          <Text>
            The goal of the project was not only to rebuild YelpCamp using a
            newer stack, but also to explore how a familiar application can
            evolve with better architecture, UI patterns, and modern tooling.
          </Text>
        </Section>

        <Section align="unset" id={ABOUT_PAGE_SECTIONS.techStackComparison}>
          <Heading2 align="center">Tech Stack</Heading2>

          <TechStackTable />
        </Section>

        <Section id={ABOUT_PAGE_SECTIONS.dataSourceAttribution}>
          <Heading2>Data Source & Attribution</Heading2>

          <Text>
            The campground seed data used in this project was sourced from the{' '}
            <Link href={LINKS.npsApi} target="_blank">
              National Park Service API
            </Link>
            .
          </Text>

          <Text>
            To improve performance and reduce repeated API calls, the data was
            downloaded and stored directly in the database. Images were also
            downloaded and re-uploaded to UploadThing so that both the
            application data and assets could be managed from a single source of
            truth.
          </Text>

          <div>
            <Text>
              The National Park Service allows public use of their API data
              under the terms outlined in their disclaimer page:
            </Text>
            <ul>
              <li>
                <Link href={LINKS.npsApi} target="_blank">
                  NPS API Documentation
                </Link>
              </li>
              <li>
                <Link href={LINKS.npsDisclaimer} target="_blank">
                  NPS Disclaimer Page
                </Link>
              </li>
            </ul>
          </div>
        </Section>

        <Section id={ABOUT_PAGE_SECTIONS.guestFeatures}>
          <Heading2>What Can Visitors Do?</Heading2>

          <div style={{ width: '100%' }}>
            <Heading3 style={{ marginBottom: 12 }}>As a Guest</Heading3>
            <div>
              <Text>Without signing in, visitors can:</Text>
              <ul>
                <li>Browse campgrounds</li>
                <li>View campground details</li>
                <li>Read reviews left by other users</li>
              </ul>
            </div>
          </div>

          <div style={{ width: '100%' }}>
            <Heading3 style={{ marginBottom: 12 }}>
              After Authentication
            </Heading3>

            <div>
              <Text>Once authenticated, users can:</Text>
              <ul>
                <li>Create campgrounds</li>
                <li>Create reviews</li>
                <li>Update and delete their own campgrounds</li>
                <li>Update and delete their own reviews</li>
                <li>Access host-related functionality</li>
              </ul>
            </div>
          </div>
        </Section>

        <Section id={ABOUT_PAGE_SECTIONS.temporaryUserDataCleanup}>
          <Heading2>Temporary User Data & Cleanup</Heading2>

          <Text>
            To keep the project sustainable within free-tier limits,
            user-generated data is automatically cleared after a fixed amount of
            time through scheduled cleanup jobs.
          </Text>

          <Text>
            This includes uploaded images and associated database records.
          </Text>

          <div style={{ width: '100%' }}>
            <Text>
              The cleanup process exists primarily to avoid exceeding free-tier
              limits for:
            </Text>
            <ul>
              <li>Image storage</li>
              <li>Database storage</li>
              <li>Bandwidth and asset usage</li>
            </ul>
          </div>
        </Section>

        <Section id={ABOUT_PAGE_SECTIONS.currentShortcomings}>
          <Heading2>Current Shortcomings</Heading2>

          <Text>
            One of the weaker parts of the project is the authentication
            implementation.
          </Text>

          <Text>
            While migrating to Auth.js (NextAuth), the authentication setup
            could not be implemented exactly according to the official
            documentation due to project-specific constraints. A workaround was
            used instead, which introduced a known issue where the
            application&apos;s UI can become unresponsive after logging out
            because the redirect mechanism occasionally fails.
          </Text>

          <Text>
            A more detailed technical breakdown of the project&apos;s
            limitations and tradeoffs can be found in the project&apos;s README
            shortcomings section.
          </Text>
        </Section>

        <Section id={ABOUT_PAGE_SECTIONS.futurePlans}>
          <Heading2>Future Plans</Heading2>

          <Text>
            There are currently no major plans to continue developing this
            version of the project.
          </Text>

          <Text>
            However, a future iteration may explore a more frontend-focused
            approach using newer technologies and modern UI experimentation.
          </Text>
        </Section>

        <Section id={ABOUT_PAGE_SECTIONS.contact}>
          <Heading2>Contact</Heading2>

          <Text style={{ width: 'fit-content' }}>
            If you’d like to get in touch, feel free to send an email to:{' '}
            <Link href={LINKS.contact} target="_blank">
              hey@manav.sh
            </Link>
          </Text>
        </Section>
      </ResponsiveContainer>
    </>
  )
}

function Section({ ...delegated }) {
  return (
    <Flex
      direction={'column'}
      width={{
        initial: '100%',
        md: '75%',
        lg: '50%'
      }}
      gap={'4'}
      align={'center'}
      mx={'auto'}
      py={'8'}
      // pb={'4'}
      {...delegated}
    />
  )
}

function Heading2({ ...delegated }) {
  return <Heading {...delegated} as="h2" size={'8'} weight={'regular'} />
}

function Heading3({ ...delegated }) {
  return <Heading {...delegated} as="h3" size={'7'} weight={'regular'} />
}

function Text({ ...delegated }) {
  return <RTText as="p" style={{ width: '100%' }} {...delegated} />
}

const LINKS = {
  airbnb: 'https://www.airbnb.com',
  hipcamp: 'https://www.hipcamp.com/en-GB',
  npsApi: 'https://www.nps.gov/subjects/developer/api-documentation.htm',
  npsDisclaimer: 'https://www.nps.gov/aboutus/disclaimer.htm',
  contact: 'mailto:hey@manav.sh'
}

export const ABOUT_PAGE_SECTIONS = {
  projectOverview: 'project-overview',
  techStackComparison: 'tech-stack-comparison',
  dataSourceAttribution: 'data-source-attribution',
  guestFeatures: 'guest-features',
  authenticatedUserFeatures: 'authenticated-user-features',
  temporaryUserDataCleanup: 'temporary-user-data-cleanup',
  currentShortcomings: 'current-shortcomings',
  futurePlans: 'future-plans',
  contact: 'contact'
}
