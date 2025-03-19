"use client";
import React from "react";

import Image from "next/image";
import { DotButton, useDotButton } from "./EmblaCarouselDotButton";
import {
  PrevButton,
  NextButton,
  usePrevNextButtons,
} from "./EmblaCarouselArrowButtons";
import useEmblaCarousel from "embla-carousel-react";
import "./styles.css";
import { Skeleton } from "@radix-ui/themes";

export default function ImageCarousel({ options, data }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  const ImgStyle = {
    objectFit: "cover",
    width: "100%",
    height: "100%",
  };

  return (
    <section className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {data.map(({ id, credit, alt_text: alt, thumbnail_url: url }) => (
            <div className="embla__slide" key={id}>
              <div className="embla__slide__number">
                <Skeleton>
                  <Image
                    src={url}
                    alt={!!alt ? `${alt} - ${credit}` : ""}
                    width={600}
                    height={400}
                    style={ImgStyle}
                  />
                </Skeleton>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="embla__controls">
        <div className="embla__buttons">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>

        <div className="embla__dots">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={"embla__dot".concat(
                index === selectedIndex ? " embla__dot--selected" : ""
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * const ContStyle = {
    width: "100%",
    borderRadius: "6px",
    overflow: "hidden",
    boxShadow: "0 2px 10px var(--black-a7)"
  };

 * <div style={ContStyle}>
    <AspectRatio ratio={1/1}>
      <img
        style={ImgStyle}
        src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
        alt="Landscape photograph by Tobias Tullius"
      />
    </AspectRatio>
  </div>
*/
