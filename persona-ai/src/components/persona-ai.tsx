"use client";

import { useState } from "react";
import ChatBox from "./chat-box";
import PersonComponent from "./person-component";
import { Person } from "@/lib/person-data";

const PersonaAI = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  return (
    <div className="flex flex-col gap-4 w-full">
      <PersonComponent
        setSelectedPerson={setSelectedPerson}
        selectedPerson={selectedPerson}
      />
      <ChatBox currentPerson={selectedPerson} />
    </div>
  );
};

export default PersonaAI;
