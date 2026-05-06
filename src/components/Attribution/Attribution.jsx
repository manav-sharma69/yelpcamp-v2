import { Box, Flex, Link, Text } from '@radix-ui/themes'
import { default as NextLink } from 'next/link'
import ResponsiveContainer from '../RespContainer'

export default function Attribution() {
  const YEAR = new Date().getFullYear()
  return (
    <Box asChild style={{ background: 'hsl(44, 62%, 70%)' }} mt={'auto'}>
      <footer>
        <ResponsiveContainer>
          <Flex
            justify={'between'}
            py={'3'}
            gapX={'5'}
            gapY={'3'}
            direction={{ initial: 'column', sm: 'row' }}
          >
            <Text
              as="p"
              align={{ initial: 'center' }}
              size={{ initial: '2', xs: '3' }}
            >
              YelpCamp is created with ❤️ by{' '}
              <Link asChild color="gray" highContrast>
                <NextLink target="_blank" href={'https://manav.sh'}>
                  Manav
                </NextLink>
              </Link>
              .
            </Text>
            <Text
              as="p"
              align={{ initial: 'center' }}
              size={{ initial: '2', xs: '3' }}
            >
              Copyright &copy; YelpCamp {YEAR}
            </Text>
          </Flex>
        </ResponsiveContainer>
      </footer>
    </Box>
  )
}
