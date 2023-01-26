import React from 'react'

export type Props = {
  title: string;
  url: string;
  classes: string;
  icon: React.ReactNode;
}

const SocialLink = ({ title, url, classes, icon }: Props) => {
  return (
    <a
      className={`col-span-1 flex flex-row justify-center py-2 rounded-2xl hover:scale-125 transition-all duration-1500 ${classes}`}
      href={url}
      target={"_blank"}
      rel={"noreferrer"}
    >
      {icon}
      <span className="ml-4 md:inline text-md">{title}</span>
    </a>
  )
}

export default SocialLink;
