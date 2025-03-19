import { getCampgroundById } from "@/utils/actions/campgroundsCrud";

export async function generateMetadata({ params }) {
  const { campground: id } = await params;
  const campground = await getCampgroundById(id);

  if (Object.keys(campground).includes("error")) {
    return {
      title: "Page Not Found",
    };
  }

  return {
    title: `${campground.name} | YelpCamp`,
  };
}

export default function ShowLayout({ children }) {
  return <>{children}</>;
}
