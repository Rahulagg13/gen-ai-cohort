"use client";

import PersonCard from "@/components/person-card";
import { Person, Persons } from "@/lib/person-data";
import { useState } from "react";

const PersonComponent = ({
  setSelectedPerson,
  selectedPerson,
}: {
  setSelectedPerson: (person: Person) => void;
  selectedPerson: Person | null;
}) => {
  const handleSelectPerson = (person: Person) => {
    setSelectedPerson(person);
  };
  return (
    <div className="flex justify-center items-center w-full">
      {Persons.map((person) => (
        <PersonCard
          person={person}
          key={person.id}
          isSelected={selectedPerson?.id === person.id}
          onClick={() => handleSelectPerson(person)}
        />
      ))}
    </div>
  );
};

export default PersonComponent;
