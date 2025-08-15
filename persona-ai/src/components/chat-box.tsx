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
import { useEffect, useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { cn } from "@/lib/utils";
import MDXMessage from "./mdx-message";
import { Send } from "lucide-react";

const ChatBox = ({ currentPerson }: { currentPerson: Person | null }) => {
  const [messages, setMessages] = useState<
    {
      role: string;
      content: string;
    }[]
  >([]);
  const [message, setMessage] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setMessages([]);
  }, [currentPerson]);

  const { mutate, isPending } = useMutation({
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

  useEffect(() => {
    scrollToBottom();
  }, [messages, isPending]);

  const handleSendMessage = () => {
    if (!currentPerson || !message) return;
    const msg = { content: message, role: "user" };
    setMessages([...messages, msg]);
    mutate({ currentPerson, messages: [...messages, msg] });
    setMessage("");
  };

  const TypingIndicator = () => (
    <div className="flex items-start gap-3 px-4 py-2">
      <Avatar className="w-8 h-8 flex-shrink-0 -mt-4">
        <AvatarImage
          src={currentPerson?.profileImage}
          alt={currentPerson?.name}
        />
        <AvatarFallback className="bg-gradient-to-br from-orange-200 to-orange-300 text-orange-800 font-semibold">
          {currentPerson?.name.split(" ")[0].charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-lg shadow-orange-500/10">
        <div className="flex space-x-1">
          <div
            className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>
    </div>
  );

  if (!currentPerson) {
    return (
      <Card className="w-full max-w-4xl flex justify-center items-center h-full min-h-[600px] bg-gradient-to-br from-orange-50 to-orange-100/50 border-2 border-orange-200">
        <p className="font-semibold text-base text-orange-800">
          Please select a person from the left to start a conversation with
          them.
        </p>
      </Card>
    );
  }

  console.log(messages);

  return (
    <Card className="w-full flex flex-col p-0 gap-0 max-w-4xl h-full min-h-[600px] max-h-[calc(100vh-2rem)] border-2 border-orange-300 shadow-2xl shadow-orange-500/20 bg-white overflow-hidden">
      <CardHeader className="whitespace-nowrap px-6 py-4 bg-gradient-to-r from-orange-300 via-orange-400 to-orange-500/80 text-white shadow-lg flex justify-between items-center flex-shrink-0">
        <CardTitle className="relative flex justify-start items-start gap-4">
          <div className="relative">
            <Avatar className="w-12 h-12 ring-4 ring-orange-300/30 shadow-lg">
              <AvatarImage
                src={currentPerson.profileImage}
                alt={currentPerson.name}
              />
              <AvatarFallback className="bg-gradient-to-br from-orange-200 to-orange-300 text-orange-800 font-bold text-lg">
                {currentPerson.name.split(" ")[0].charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="bg-green-400 border-3 border-white rounded-full w-4 h-4 absolute bottom-0 -right-1 shadow-sm" />
          </div>

          <div className="flex flex-col">
            <p className="text-xl font-bold">{currentPerson.name}</p>
            <p className="text-orange-100 text-sm font-medium">
              {currentPerson.role} • Online
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto overflow-x-hidden pt-8 px-6 bg-gradient-to-br from-orange-50/30 via-white to-orange-50/50 space-y-6 h-0 scrollbar-hide">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={cn(
              "flex flex-col gap-10",
              msg.role === "user" ? "items-end" : "items-start"
            )}
          >
            <div
              className={cn(
                "max-w-[80%] flex gap-3 justify-center items-start",
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              <Avatar className="w-8 h-8 -mt-4 ring-2 ring-orange-200/30">
                <AvatarImage
                  src={
                    msg.role === "user" ? undefined : currentPerson.profileImage
                  }
                  alt={msg.role === "user" ? "user" : currentPerson.name}
                />
                <AvatarFallback
                  className={cn(
                    "font-semibold text-sm",
                    msg.role === "user"
                      ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white"
                      : "bg-gradient-to-br from-orange-200 to-orange-300 text-orange-800"
                  )}
                >
                  {msg.role === "user"
                    ? "U"
                    : currentPerson.name.split(" ")[0].charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  "px-4 py-3 text-sm rounded-2xl shadow-lg max-w-full",
                  msg.role === "user"
                    ? "bg-orange-500 text-white rounded-tr-sm shadow-orange-500/20"
                    : "bg-white border border-orange-100 text-gray-800 rounded-tl-sm shadow-orange-500/10"
                )}
              >
                {msg.role === "assistant" ? (
                  <MDXMessage mdx={msg.content} />
                ) : (
                  <p className="leading-relaxed break-words">{msg.content}</p>
                )}
              </div>
            </div>
          </div>
        ))}

        {isPending && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </CardContent>
      <CardFooter className="whitespace-nowrap px-4 py-2 rounded-br-md rounded-bl-md flex justify-between gap-3 flex-shrink-0">
        <Input
          placeholder="Type a message"
          className="w-full !text-lg !focus-within:outline-none focus-visible:ring-0 bg-white border-2 border-orange-200 focus:border-orange-400 text-neutral-950 py-6 rounded-md shadow-sm placeholder:text-orange-400"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
        />
        <Button
          className="h-full max-w-24 w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/25"
          onClick={handleSendMessage}
        >
          <Send className="size-5" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ChatBox;
