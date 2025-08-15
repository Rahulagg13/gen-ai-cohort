import Icons from "@/components/icons";
import { mySocialLink } from "@/components/my-card";
import PersonaAI from "@/components/persona-ai";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen p-4 w-full flex justify-center xl:container xl:mx-auto bg-gradient-to-br from-orange-50 to-orange-100/30">
      <div className="w-full max-w-7xl flex flex-col">
        <header className="mb-6 flex xl:justify-center justify-between items-center w-full">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-800 text-center py-4">
            Persona AI
          </h1>
          <div className="xl:hidden flex flex-wrap  gap-2 ">
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
        </header>

        <main className="flex-1 min-h-0">
          <PersonaAI />
        </main>
      </div>
    </div>
  );
}
