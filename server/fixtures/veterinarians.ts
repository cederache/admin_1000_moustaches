import { DataSource } from "typeorm";

// @ts-ignore
import { Veterinarian } from "../dist/app/models/Veterinarian";
// Used for dev (to get the typed entity)
// import { Veterinarian } from "../app/models/Veterinarian";

const createVeterinarian = (name: string, mail: string, phone: string, address: string, latitude: number, longitude: number, priceLevel: number) => {
  const veterinarian = new Veterinarian();
  veterinarian.name = name;
  veterinarian.mail = mail;
  veterinarian.phone = phone;
  veterinarian.address = address;
  veterinarian.latitude = latitude;
  veterinarian.longitude = longitude;
  veterinarian.priceLevel = priceLevel;
  return veterinarian;
};

export const createVeterinarians = async (dataSource: DataSource) => {
  // Create mocked veterinarians in the database (all in Loire Atlantique department)
  const veterinarians = [
    {
      name: "Dr. John Doe",
      mail: "john.doe@example.com",
      phone: "06 06 06 06 06",
      address: "12 rue de Strasbourg, 44001 Nantes",
      latitude: 47.21608201944448,
      longitude: -1.550908502387338,
      priceLevel: 0,
    }, {
      name: "Dr. Jane Doe",
      mail: "jane.doe@example.com",
      phone: "06 06 06 06 07",
      address: "1 rue de la Paix, 44000 Nantes",
      latitude: 47.21442604511793,
      longitude: - 1.5543125786141285,
      priceLevel: 2,
    }
  ];

  const veterinariansToSave = veterinarians.map(veterinarian => createVeterinarian(veterinarian.name, veterinarian.mail, veterinarian.phone, veterinarian.address, veterinarian.latitude, veterinarian.longitude, veterinarian.priceLevel));

  const veterinarianRepository = dataSource.getRepository(Veterinarian);
  for (const veterinarian of veterinariansToSave) {
    await veterinarianRepository.save(veterinarian);
  }
  console.log("Veterinarians created successfully");
};