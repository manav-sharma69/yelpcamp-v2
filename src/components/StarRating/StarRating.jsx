import { Rating } from "react-simple-star-rating";

export default function StarRating({ rating, setRating }) {
  return (
    <>
      <Rating
        initialValue={rating}
        size={25}
        onClick={(val) => setRating(val)}
      />
    </>
  );
}
