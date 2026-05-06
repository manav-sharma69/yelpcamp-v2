'use client'
import CGIndex from '@/components/CGIndex'
import useToggle from '@/utils/hooks/use-toggle'
import style from './styles.module.css'

import { Button, Flex, Skeleton } from '@radix-ui/themes'
import { List, Map } from 'lucide-react'
import dynamic from 'next/dynamic'
import React from 'react'

const HomePageMap = dynamic(() => import('@/components/HomePageMap'), {
  ssr: false,
  loading: () => <MapSkeleton />
})

const HomePageClient = ({ campgrounds }) => {
  const [isMapHidden, toggle] = useToggle(true)
  const [isShown, setIsShown] = React.useState(true)

  return (
    <>
      <Button
        style={{ display: !isShown && 'none' }}
        highContrast
        color="gray"
        radius="full"
        size={'4'}
        onClick={toggle}
        className={style['toggle-button']}
      >
        {isMapHidden ? 'Show Map' : 'Show List'}
        {isMapHidden ? <Map /> : <List />}
      </Button>

      <CGIndex
        initialCampgrounds={campgrounds}
        setIsShown={setIsShown}
        style={{
          display: isMapHidden ? 'block' : 'none'
        }}
      />

      <HomePageMap
        style={{
          display: isMapHidden ? 'none' : 'block'
        }}
      />
    </>
  )
}

export default React.memo(HomePageClient)

function MapSkeleton() {
  return (
    <Skeleton loading>
      <Flex flexGrow={'1'} />
    </Skeleton>
  )
}
