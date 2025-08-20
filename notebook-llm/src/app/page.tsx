import ChatBox from "@/components/chatbox";
import Source from "@/components/source";
import Image from "next/image";

export default function Home() {
  return (
    <div className="container flex items-start justify-center min-h-screen w-full mx-auto py-10">
      <div className="grid grid-cols-[40%_60%]  gap-10 w-full h-full">
        <Source />
        <ChatBox />
      </div>
    </div>
  );
}
