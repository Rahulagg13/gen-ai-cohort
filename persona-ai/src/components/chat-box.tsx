"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Person } from "@/lib/person-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { cn } from "@/lib/utils";
import MDXMessage from "./mdx-message";

const ChatBox = ({ currentPerson }: { currentPerson: Person | null }) => {
  const [messages, setMessages] = useState<
    {
      role: string;
      content: string;
    }[]
  >([]);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    setMessages([]);
  }, [currentPerson]);

  const { mutate } = useMutation({
    mutationFn: async ({
      currentPerson,
      messages,
    }: {
      currentPerson: Person;
      messages: { role: string; content: string }[];
    }) => {
      const { data } = await axios.post("/api/response", {
        currentPerson,
        messages,
      });
      return data;
    },
    onError: (err) => {
      console.log(err);
    },
    onSuccess: (data) => {
      console.log(data);
      setMessages([...messages, data]);
    },
  });

  const handleSendMessage = () => {
    if (!currentPerson) return;
    const msg = { content: message, role: "user" };
    setMessages([...messages, msg]);
    mutate({ currentPerson, messages: [...messages, msg] });
    setMessage("");
  };

  if (!currentPerson) {
    return (
      <Card className="w-full flex-1 flex justify-center items-center">
        No Persona selected
      </Card>
    );
  }

  console.log(messages);

  return (
    <Card className="w-full flex-1 flex p-0">
      <CardHeader className="whitespace-nowrap px-4 py-2 border-b-1 bg-orange-500 rounded-tr-md rounded-tl-md">
        <CardTitle className="flex justify-start items-start gap-4 ">
          <Avatar className="w-10 h-10">
            <AvatarImage
              src={currentPerson.profileImage}
              alt={currentPerson.name}
            />
            <AvatarFallback>
              {currentPerson.name.split(" ")[0].charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <p className="text-xl font-semibold">{currentPerson.name}</p>
            <p className="text-xs font-medium"> {currentPerson.role}</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto max-h-[calc(100vh-365px)]">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={cn(
              "flex flex-col gap-4",
              msg.role === "user" ? "items-end" : "items-start"
            )}
          >
            <div className="max-w-[65%] border rounded-md p-4 flex gap-6 justify-center items-center">
              <Avatar className="w-10 h-10">
                <AvatarImage
                  src={
                    msg.role === "user"
                      ? "https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=76&q=80"
                      : currentPerson.profileImage
                  }
                  alt={msg.role === "user" ? "user" : currentPerson.name}
                />
                <AvatarFallback>
                  {msg.role === "user"
                    ? "U"
                    : currentPerson.name.split(" ")[0].charAt(0)}
                </AvatarFallback>
              </Avatar>
              {/* <p>{msg.content}</p> */}
              {msg.role === "assistant" ? (
                <MDXMessage mdx={msg.content} />
              ) : (
                <p>{msg.content}</p>
              )}
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="whitespace-nowrap px-4 py-2 border-t-1 rounded-br-md rounded-bl-md flex justify-between gap-1">
        <Input
          placeholder="Type a message"
          className="w-full !text-lg  !focus-within:outline-none focus-visible:ring-0 bg-transparent text-neutral-950 py-6"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
        />
        <Button className="h-full max-w-md" onClick={handleSendMessage}>
          Send
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ChatBox;
