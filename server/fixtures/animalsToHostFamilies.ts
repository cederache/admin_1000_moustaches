// @ts-ignore
import { Animal } from "../dist/app/models/Animal";
// @ts-ignore
import { AnimalHostFamily } from "../dist/app/models/AnimalHostFamily";
// @ts-ignore
import { HostFamily } from "../dist/app/models/HostFamily";

// Used for dev (to get the typed entity)
//import { Animal } from "../app/models/Animal";
//import { HostFamily } from "../app/models/HostFamily";
// import { AnimalHostFamily } from "../app/models/AnimalHostFamily";

import { DataSource } from "typeorm";

const createAnimalToHostFamily = (
  animal: Animal,
  hostFamily: HostFamily,
  entryDate: Date
) => {
  const animalHostFamily = new AnimalHostFamily();
  animalHostFamily.animal = animal;
  animalHostFamily.hostFamily = hostFamily;
  animalHostFamily.entryDate = entryDate;
  return animalHostFamily;
};

export const createAnimalHostFamilies = async (dataSource: DataSource) => {
  // First, get the host families from the database
  const hostFamilyRepository = dataSource.getRepository(HostFamily);
  const allHostFamilies = await hostFamilyRepository.find();

  // Then, get the animals from the database
  const animalRepository = dataSource.getRepository(Animal);
  const allAnimals = await animalRepository.find();

  // Create a map for easy host families lookup
  const hostFamilyMap = new Map();
  allHostFamilies.forEach(hostFamily => {
    hostFamilyMap.set(hostFamily.id, hostFamily);
  });

  let remainingAnimals = allAnimals;

  const animalHostFamilies = allHostFamilies.map((hostFamily) => {
    const animal = remainingAnimals.shift();
    if (!animal) {
      console.warn("No more animals to assign to host family");
      return null;
    }
    return createAnimalToHostFamily(animal, hostFamily, new Date());
  });

  const animalHostFamiliesToSave = animalHostFamilies.filter(
    (animalHostFamily) => animalHostFamily !== null
  );

  const animalHostFamilyRepository = dataSource.getRepository(AnimalHostFamily);
  for (const animalHostFamily of animalHostFamiliesToSave) {
    await animalHostFamilyRepository.save(animalHostFamily);
  }
};
