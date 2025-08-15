"use client";

import { useState } from "react";
import ChatBox from "./chat-box";
import PersonComponent from "./person-component";
import { Person } from "@/lib/person-data";

const PersonaAI = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  return (
    <div className="flex justify-center flex-col xl:flex-row gap-4 items-center w-full h-full">
      <PersonComponent
        setSelectedPerson={setSelectedPerson}
        selectedPerson={selectedPerson}
      />
      <ChatBox currentPerson={selectedPerson} />
    </div>
  );
};

export default PersonaAI;
