import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import Icons from "./icons";
import { SocialMedia } from "@/lib/person-data";

export const mySocialLink: SocialMedia[] = [
  {
    name: "rahul-aggarwal-227531198",
    url: "https://www.linkedin.com/in/rahul-aggarwal-227531198/",
    icon: "linkedIn",
    mediaName: "Linkedin",
  },
  {
    name: "Rahulagg13",
    url: "https://github.com/Rahulagg13",
    icon: "github",
    mediaName: "Github",
  },
  {
    name: "Rahulagg1306",
    url: "https://x.com/Rahulagg1306",
    icon: "x",
    mediaName: "X",
  },
];

const MyCard = () => {
  return (
    <Card className="w-full hidden xl:block">
      {/* <CardHeader>
        <h6 className="text-xl font-bold">Rahul Aggarwal</h6>
      </CardHeader> */}
      <CardContent className="flex flex-col  items-start gap-3">
        <h6 className="text-sm font-semibold">Social Links</h6>
        <div className="flex flex-wrap w-full gap-2">
          {mySocialLink.map((media, index) => {
            const Icon = Icons[media.icon];
            return (
              <Link
                href={media.url}
                target="_blank"
                rel="noreferrer"
                key={`${media.name}-${index}`}
                className="p-2 rounded-full bg-neutral-50 border flex justify-center items-center  overflow-hidden"
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default MyCard;
