import React from "react";
import { getCampgrounds } from "@/utils/actions/campgroundsCrud";

import HomePageMap from "@/components/HomePageMap";
import ViewToggle from "@/components/ViewToggle";
import CGIndex from "@/components/CGIndex";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const campgrounds = await getCampgrounds(12);

  return (
    <ViewToggle>
      <CGIndex initialCampgrounds={campgrounds} />
      <HomePageMap />
    </ViewToggle>
  );
}