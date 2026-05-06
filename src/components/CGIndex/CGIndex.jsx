'use client'
import {
  getCampgrounds,
  getCampgroundsBySearchTerm
} from '@/utils/actions/campgroundsCrud'
import React from 'react'

import CampCard from '@/components/CampCard'
import ResponsiveContainer from '@/components/RespContainer'
import { Box, Button, Flex, Grid, Heading } from '@radix-ui/themes'
import Search from '../Search'

function CGIndex({ initialCampgrounds, style, setIsShown }) {
  const [campgrounds, setCampgrounds] = React.useState(initialCampgrounds)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [wasFilled, setWasFilled] = React.useState(false)
  const [isPending, startTransition] = React.useTransition()
  const wrapperRef = React.useRef()

  React.useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries
      entry.isIntersecting ? setIsShown(false) : setIsShown(true)
    })

    observer.observe(wrapperRef.current)

    return () => {
      observer.disconnect()
    }
  }, [])

  function loadCampgrounds() {
    startTransition(async () => {
      const prefetchedFetchedIDs = campgrounds.map(({ id }) => id)
      const newCampgrounds = await getCampgrounds(8, prefetchedFetchedIDs)
      const nextCampgrounds = [...campgrounds, ...newCampgrounds]
      setCampgrounds(nextCampgrounds)
    })
  }

  React.useEffect(() => {
    // Handle when search term is cleared
    if (wasFilled && searchTerm.length === 0) {
      setCampgrounds(initialCampgrounds)
      return
    }

    // If search term has 3 or more characters, initiate search
    if (searchTerm.length >= 3) {
      let timer

      // Using timer logic to delay the API call to reduce rapid-fire requests
      if (timer) {
        clearTimeout(timer)
      }

      timer = setTimeout(() => {
        // This will be triggered after the specified delay
        React.startTransition(async () => {
          const nextCampgrounds = await getCampgroundsBySearchTerm(searchTerm)
          setCampgrounds(nextCampgrounds)
        })
        setWasFilled(true)
      }, 1000)

      return () => clearTimeout(timer) // Clean up the timer if the effect is re-triggered
    }
  }, [searchTerm, wasFilled])

  return (
    <div style={style}>
      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Box
        mx={'auto'}
        width={'fit-content'}
        pb={'9'}
        pt={'5'}
        data-name="wrapper-cg-indx"
      >
        <ResponsiveContainer pt={'7'} pb={'9'}>
          {campgrounds.length === 0 && (
            <Heading size={'9'} color="gray">
              Campground not found 🥲
            </Heading>
          )}
          <Grid
            columns={{ initial: '1', sm: '2', md: '3', lg: '4' }}
            gapY={'6'}
            gapX={{ xs: '1', sm: '7', md: '6' }}
          >
            {campgrounds.length !== 0 &&
              campgrounds.map((campground) => {
                return (
                  <CampCard
                    key={campground.id}
                    avgOfReviews={campground['average_rating']}
                    campdata={campground}
                    imgData={campground.images}
                  />
                )
              })}
            <div ref={wrapperRef} />
          </Grid>
          {!wasFilled && (
            <Flex
              align={'center'}
              justify={'center'}
              direction={'column'}
              py={'5'}
              gapY={'5'}
            >
              <Heading>Continue exploring campgrounds</Heading>
              <Button
                size={'4'}
                highContrast
                onClick={() => loadCampgrounds()}
                loading={isPending}
              >
                Show More
              </Button>
            </Flex>
          )}
        </ResponsiveContainer>
      </Box>
    </div>
  )
}

export default CGIndex
