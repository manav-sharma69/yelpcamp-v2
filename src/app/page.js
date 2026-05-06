import { getCampgrounds } from '@/utils/actions/campgroundsCrud'

import HomePageClient from '@/components/HomePageClient'

export default async function HomePage() {
  const campgrounds = await getCampgrounds(12)

  return <HomePageClient campgrounds={campgrounds} />
}
