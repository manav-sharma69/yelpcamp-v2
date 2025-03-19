// import { getUserRole } from "@/utils/auth/helpers";

export async function generateMetadata({ params }) {
  // const role = await getUserRole();
  const role = "host";

  if (!role) {
    return {
      title: "Unauthenticated Request | YelpCamp",
    };
  }

  return {
    title:
      role !== "host"
        ? "Become a Host | YelpCamp"
        : "List New Campground | YelpCamp",
  };
}

export default function HostLayout({ children }) {
  return <>{children}</>;
}
