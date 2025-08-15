import PersonCard from "@/components/person-card";
import { Person, Persons } from "@/lib/person-data";
import MyCard from "./my-card";

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
    <div className="flex justify-center flex-row xl:flex-col gap-4 flex-1 items-center w-full xl:w-auto h-full">
      {Persons.map((person) => (
        <PersonCard
          person={person}
          key={person.id}
          isSelected={selectedPerson?.id === person.id}
          onClick={() => handleSelectPerson(person)}
        />
      ))}
      <div className="flex-1" />
      <MyCard />
    </div>
  );
};

export default PersonComponent;
