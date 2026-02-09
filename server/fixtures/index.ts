// This file is used to load fixtures into the database
// It is used to populate the database with data for development purposes
// It is not used in production
import * as dotenv from "dotenv";
import path from "path";

if (process.env.NODE_ENV !== "production") {
  // Load environment variables from .env file in the server directory
  // Usefull for windows local development
  dotenv.config({ path: path.resolve(__dirname, "../.env") });
}

import { AppDataSource } from "../app/config/database";
import { createUsers } from "./users";
import { createAnimals } from "./animals";
import { createHostFamilies } from "./hostFamilies";
import { createVeterinarians } from "./veterinarians";
import { createDemoAccounts } from "./demoAccounts";
import { createAnimalHostFamilies } from "./animalsToHostFamilies";

const loadFixtures = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Loading fixtures...");

    await createUsers(AppDataSource);
    await createAnimals(AppDataSource);
    await createHostFamilies(AppDataSource);
    await createVeterinarians(AppDataSource);
    await createDemoAccounts(AppDataSource);
    await createAnimalHostFamilies(AppDataSource);
    // TODO: Add other fixtures here

    console.log("Fixtures loaded successfully!");

    // Close the connection and exit
    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error("Error loading fixtures:", error);
    process.exit(1);
  }
};

loadFixtures();
