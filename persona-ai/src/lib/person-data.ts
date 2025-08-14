import React from "react";
import Icons, { IconProps } from "@/components/icons";

export type IconType = keyof typeof Icons;
export type SocialMedia = {
  name: string;
  url: string;
  icon: IconType;
  mediaName: string;
};

export type Person = {
  id: string;
  name: string;
  role: string;
  profileImage: string;
  socialMedia: SocialMedia[];
};
export const Persons: Person[] = [
  {
    id: "hitesh",
    name: "Hitesh Choudhary",
    role: "Coding Teacher & Youtuber",
    profileImage: "https://avatars.githubusercontent.com/u/11613311?v=4",
    socialMedia: [
      {
        name: "hiteshchoudhary",
        url: "https://www.linkedin.com/in/hiteshchoudhary/",
        icon: "linkedIn",
        mediaName: "Linkedin",
      },
      {
        name: "hiteshchoudhary",
        url: "https://github.com/hiteshchoudhary",
        icon: "github",
        mediaName: "Github",
      },
      {
        name: "hiteshdotcom",
        url: "https://x.com/hiteshdotcom",
        icon: "x",
        mediaName: "X",
      },
      {
        name: "hiteshchoudharyofficial",
        url: "https://www.instagram.com/hiteshchoudharyofficial",
        icon: "instagram",
        mediaName: "Instagram",
      },
      {
        name: "HiteshCodeLab",
        url: "https://www.youtube.com/@HiteshCodeLab",
        icon: "youtube",
        mediaName: "Youtube",
      },
      {
        name: "chaiaurcode",
        url: "https://www.youtube.com/@chaiaurcode",
        icon: "youtube",
        mediaName: "Youtube",
      },
    ],
  },
  {
    id: "piyush",
    name: "Piyush Garg",
    role: "Educator & Content Creator",
    profileImage:
      "https://www.piyushgarg.dev/_next/image?url=%2Fimages%2Favatar.png&w=640&q=75",
    socialMedia: [
      {
        name: "piyushgarg195",
        url: "https://www.linkedin.com/in/piyushgarg195/",
        icon: "linkedIn",
        mediaName: "Linkedin",
      },
      {
        name: "piyushgarg-dev",
        url: "https://github.com/piyushgarg-dev",
        icon: "github",
        mediaName: "Github",
      },
      {
        name: "piyushgarg_dev",
        url: "https://x.com/piyushgarg_dev",
        icon: "x",
        mediaName: "X",
      },
      {
        name: "piyushgarg_dev",
        url: "https://www.instagram.com/piyushgarg_dev",
        icon: "instagram",
        mediaName: "Instagram",
      },
      {
        name: "@piyushgargdev",
        url: "https://www.youtube.com/@piyushgargdev",
        icon: "youtube",
        mediaName: "Youtube",
      },
    ],
  },
];

