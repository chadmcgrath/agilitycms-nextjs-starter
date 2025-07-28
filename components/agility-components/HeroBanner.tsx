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
  image: ImageField
  primaryCallToAction?: URLField
  secondaryCallToAction?: URLField
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
  const generateLink = (fieldName: string, url: string, target: string, text: string) => {
    const buttonClasses = "inline-block px-8 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-secondary-500 hover:bg-secondary-700 focus:outline-none focus:border-primary-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150 pointer-events-auto relative z-10"

    // if relative link, use next/link
    if (isUrlAbsolute(url) === false) {
      return (
        <Link
          data-agility-field={fieldName}
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
          data-agility-field={fieldName}
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

  return (
    <div className="relative cursor-pointer group" data-agility-component={contentID}>
      {/* Title/tagline - Mobile: above image, Desktop: overlay */}
      <div className="text-center px-8 py-8 bg-black bg-opacity-40 md:absolute md:inset-0 md:flex md:flex-col md:items-center md:justify-center md:bg-transparent md:z-10">
        <div className="md:max-w-4xl md:mx-auto md:px-8">
          {fields.tagline && (
            <div
              data-agility-field="tagline"
              className="font-bold text-sm uppercase py-1 text-white"
            >
              {fields.tagline}
            </div>
          )}
          {fields.title && (
            <h1
              data-agility-field="title"
              className="font-display text-4xl md:text-5xl lg:text-6xl font-black tracking-wide mt-4 leading-tight lg:leading-tight text-white"
            >
              {fields.title}
            </h1>
          )}
        </div>
      </div>

      {/* Image container */}
      <div className="relative md:py-20 md:py-24" data-agility-field="image">
        <Link href={fields.primaryCallToAction?.href || "/"} className="relative">
          <AgilityPic
            image={fields.image}
            className="object-cover object-center w-full"
            priority={priority}
            fallbackWidth={1200}
            sources={[
              { media: "(max-width: 767px)", width: 768 },
              { media: "(min-width: 1280px)", width: 1280 },
              { media: "(min-width: 768px)", width: 1024 },
            ]}
          />
        </Link>
        <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-opacity duration-300"></div>
      </div>

      {/* Buttons - Mobile: below image, Desktop: overlay using absolute positioning */}
      {(fields.primaryCallToAction || fields.secondaryCallToAction) && (
        <div className="text-center px-8 py-8 bg-black bg-opacity-40 md:absolute md:inset-0 md:flex md:items-center md:justify-center md:bg-transparent md:z-10 md:top-auto md:bottom-16">
          <div className="flex flex-col md:flex-row gap-4 items-center md:max-w-4xl md:mx-auto">
            {fields.primaryCallToAction &&
              generateLink(
                "primaryCallToAction",
                fields.primaryCallToAction.href,
                fields.primaryCallToAction.target,
                fields.primaryCallToAction.text
              )}
            {fields.secondaryCallToAction &&
              generateLink(
                "secondaryCallToAction",
                fields.secondaryCallToAction.href,
                fields.secondaryCallToAction.target,
                fields.secondaryCallToAction.text
              )}
          </div>
        </div>
      )}
    </div>
  )
}

export default HeroBanner