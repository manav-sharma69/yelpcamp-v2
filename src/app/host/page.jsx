// middleware rewrites to '/host/new' if role is 'guest' (read about rewrite() in next.js docs)
import { getCampgroundsByUserId } from "@/utils/actions/campgroundsCrud";
import { auth } from "@/utils/auth/auth";

import UserCGIndex from "@/components/UserCGIndex";

export default async function CreateCampgroundPage() {
  const { user } = await auth();
  const id = user?.id;
  const campgrounds = await getCampgroundsByUserId(id);

  return <UserCGIndex initialCampgrounds={campgrounds} name={user?.name} />;
}
