import React from "react"
import {
  AgilityPic,
  ImageField,
  URLField,
  UnloadedModuleProps,
} from "@agility/nextjs"
import Link from "next/link"
import { getContentItem } from "lib/cms/getContentItem"

interface IHeroBanner {
  title?: string
  tagline?: string
  buttonPosition: "center" | "bottom" | "below" | "top"
  image: ImageField
  primaryButton?: URLField
  highPriority?: string
}

const HeroBanner = async ({
  module,
  languageCode,
}: UnloadedModuleProps) => {
  const { fields, contentID } = await getContentItem<IHeroBanner>({
    contentID: module.contentid,
    languageCode,
  })

  // function to check whether or not the url is absolute
  const isUrlAbsolute = (url: string) =>
    url.indexOf("://") > 0 || url.indexOf("//") === 0

  // function to generate proper link
  const generateLink = (url: string, target: string, text: string) => {
    const buttonClasses = "inline-block px-8 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-primary-500 hover:bg-primary-700 focus:outline-none focus:border-primary-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150"
    
    // if relative link, use next/link
    if (isUrlAbsolute(url) === false) {
      return (
        <Link
          data-agility-field="primaryButton"
          href={url}
          title={text}
          target={target}
          className={buttonClasses}
        >
          {text}
        </Link>
      )
    } else {
      // else use anchor tag
      return (
        <a
          data-agility-field="primaryButton"
          href={url}
          title={text}
          target={target}
          className={buttonClasses}
        >
          {text}
        </a>
      )
    }
  }

  // determine if the image should be high priority
  const priority = fields.highPriority === "true"

  // get position classes based on buttonPosition
  const getPositionClasses = () => {
    switch(fields.buttonPosition) {
      case "center":
        return "absolute inset-0 flex flex-col items-center justify-center text-center"
      case "top":
        return "absolute inset-x-0 top-0 flex flex-col items-center justify-start text-center pt-12"
      case "bottom":
        return "absolute inset-x-0 bottom-0 flex flex-col items-center justify-end text-center pb-12"
      case "below":
        return "absolute inset-0 flex flex-col items-center justify-center text-center"
      default:
        return "absolute inset-0 flex flex-col items-center justify-center text-center"
    }
  }

  return (
    <div className="relative" data-agility-component={contentID}>
      {/* Hero Banner */}
      <div className="relative">
        {/* Background Image */}
        <div className="w-full" data-agility-field="image">
          <AgilityPic
            image={fields.image}
            className="object-cover object-center w-full"
            priority={priority}
            fallbackWidth={1200}
            sources={[
              { media: "(min-width: 1280px)", width: 1280 },
              { media: "(min-width: 768px)", width: 1024 },
              { media: "(max-width: 767px)", width: 768 },
            ]}
          />
        </div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

        {/* Content Overlay */}
        <div className={getPositionClasses()}>
          <div className="max-w-4xl mx-auto px-8">
            {/* Tagline - hidden on mobile, shown below banner instead */}
            {fields.tagline && (
              <div
                data-agility-field="tagline"
                className="font-bold text-sm uppercase py-1 text-white hidden md:block"
              >
                {fields.tagline}
              </div>
            )}
            
            {fields.title && (
              <h1
                data-agility-field="title"
                className="font-display text-4xl md:text-5xl lg:text-6xl font-black tracking-wide mt-4 lg:leading-tight text-white"
              >
                {fields.title}
              </h1>
            )}

            {/* Button - responsive positioning */}
            {fields.primaryButton && (
              <div className={`mt-8 ${
                // On mobile, position based on buttonPosition
                fields.buttonPosition === "top" ? "md:mt-8" : "md:mt-8"
              }`}>
                {generateLink(
                  fields.primaryButton.href,
                  fields.primaryButton.target,
                  fields.primaryButton.text
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tagline below banner on mobile */}
      {fields.tagline && (
        <div className="block md:hidden px-8 py-4 text-center">
          <div
            data-agility-field="tagline"
            className="font-bold text-primary-500 text-sm uppercase"
          >
            {fields.tagline}
          </div>
        </div>
      )}
    </div>
  )
}

export default HeroBanner
