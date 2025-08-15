"use client";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Person } from "@/lib/person-data";
import { useState } from "react";
import Icons from "./icons";
import { cn } from "@/lib/utils";

const PersonCard = ({
  person,
  isSelected,
  onClick,
}: {
  person: Person;
  isSelected: boolean;
  onClick: () => void;
}) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  return (
    <Card
      className={cn(
        "overflow-hidden cursor-pointer border-2 border-orange-600 hover:ring-2 hover:ring-orange-400 hover:ring-offset-2 w-full max-w-lg",
        {
          "border border-orange-600 hover:ring-0 scale-[1.01] bg-orange-200 transition-scale duration-300 ease-in-out hover:ring-offset-0":
            isSelected,
          " scale-[0.95] transition-scale duration-300 ease-in-out":
            !isSelected,
        }
      )}
      onClick={onClick}
    >
      <CardHeader className="whitespace-nowrap">
        <CardTitle className="flex justify-start items-center gap-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src={person.profileImage} alt={person.name} />
            <AvatarFallback>
              {person.name.split(" ")[0].charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="text-xl font-semibold text-shadow-sm">
            {person.name}
          </span>
        </CardTitle>
        <CardDescription
          className={cn(" text-base mt-1 text-neutral-600 font-medium")}
        >
          {person.role}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col  items-start gap-1">
        <h6 className="text-sm font-semibold">Social Links</h6>
        <div className="flex flex-wrap">
          <AnimatePresence mode="popLayout">
            {person.socialMedia.map((media, index) => {
              const isHovered = hoveredItem === `${media.name}${index}`;
              const Icon = Icons[media.icon];
              return (
                <motion.a
                  href={media.url}
                  target="_blank"
                  rel="noreferrer"
                  key={`${media.name}-${index}`}
                  className="p-2 rounded-full bg-neutral-50 border flex justify-center items-center gap-2 -mr-2 whitespace-nowrap overflow-hidden"
                  onMouseEnter={() => setHoveredItem(`${media.name}${index}`)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {isHovered && (
                    <motion.span
                      initial={{ width: 50 }}
                      animate={{
                        width: isHovered ? "auto" : 50,
                      }}
                      exit={{ width: 50 }}
                      transition={{
                        duration: 0.4,
                        ease: [0.86, 0, 0.07, 1],
                      }}
                      className="text-xs font-bold overflow-hidden"
                    >
                      @{media.name}
                    </motion.span>
                  )}
                </motion.a>
              );
            })}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonCard;
