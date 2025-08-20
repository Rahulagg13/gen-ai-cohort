"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

export type Message = {
  role: "user" | "assistant" | "system" | "developer";
  content: string;
  summary?: string;
  originalContent?: string;
};

type ChatContextType = {
  messages: Message[];
  addMessage: (message: Message) => void;
  clearMessages: () => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const messages = localStorage.getItem("messages");
    if (messages) {
      setMessages(JSON.parse(messages));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);

  const setMsgInLocalStorage = () => {
    localStorage.setItem("messages", JSON.stringify(messages));
  };
  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
    setMsgInLocalStorage();
  };

  const clearMessages = () => {
    setMessages([]);
    localStorage.removeItem("messages");
  };

  return (
    <ChatContext.Provider value={{ messages, addMessage, clearMessages }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return context;
}
