// USER PROFILE PAGE
import { getCampgroundsCountByUserId } from "@/utils/actions/campgroundsCrud";
import { auth } from "@/utils/auth/auth";
import { getUserByID } from "@/utils/actions/usersCrud";
import { notFound } from "next/navigation";

import Unauthenticated from "@/components/Unauthenticated";
import UserDetails from "@/components/UserDetails";

export default async function UserProfile() {
  const session = await auth();
  if (!session) return <Unauthenticated />;

  const { id } = session?.user;
  if (!id) notFound();

  const user = await getUserByID(id);
  const campgroundsOwned = await getCampgroundsCountByUserId(id);
  delete user.password;
  delete user.id;

  return <UserDetails userDetails={{ user, campgroundsOwned }} />;
}
