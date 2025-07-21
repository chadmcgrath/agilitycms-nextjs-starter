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
    const buttonClasses = "inline-block px-8 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-secondary-500 hover:bg-secondary-700 focus:outline-none focus:border-primary-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150"

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
    <div className="relative" data-agility-component={contentID}>
      {/* Hero Banner */}
      <div className="flex flex-col md:flex-row justify-between max-w-screen-xl mx-auto py-20 md:py-24 items-center">
        {/* Background Image */}
        <div data-agility-field="image">
          {/* missing a primary call to action should be pretty rare and perhaps ought to be required, for now just navigate home */}
          <Link href={fields.primaryCallToAction?.href || "/"} className="relative">
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
          </Link>
        </div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

        {/* Content Overlay */}
        <div className={"absolute inset-x-0 bottom-0 flex flex-col items-center justify-end text-center pb-2 md:pb-12"}>
          <div className="max-w-4xl mx-auto px-8">
            {/* Tagline - hidden on mobile, shown below banner instead */}
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
                className="font-display text-4xl md:text-5xl lg:text-6xl font-black tracking-wide mt-4 lg:leading-tight text-white"
              >
                {fields.title}
              </h1>
            )}

            {(fields.primaryCallToAction || fields.secondaryCallToAction) && (
              <div className="mt-8 flex flex-row gap-4 justify-center">
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
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroBanner
