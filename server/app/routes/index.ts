import { Router } from "express";
import animalRoutes from "./AnimalRoutes";
import animalHostFamilyRoutes from "./AnimalHostFamilyRoutes";
import hostFamilyRoutes from "./HostFamilyRoutes";
import hostFamilyKindRoutes from "./HostFamilyKindRoutes";
import veterinarianRoutes from "./VeterinarianRoutes";
import veterinarianInterventionRoutes from "./VeterinarianInterventionRoutes";
import speciesRoutes from "./SpeciesRoutes";
import userRoutes from "./UserRoutes";
import permissionRoutes from "./PermissionRoutes";
import countAnimalsAdoptedRoutes from "./CountAnimalsAdopted";
import countAnimalsNonAdoptedRoutes from "./CountAnimalsNonAdopted";
import countHostFamiliesAvailable from "./CountHostFamiliesAvailable";

const router = Router();

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "admin_1000_moustaches_server",
  });
});

router.use("/animals", animalRoutes);
router.use("/animal-host-families", animalHostFamilyRoutes);
router.use("/host-families", hostFamilyRoutes);
router.use("/host-family-kinds", hostFamilyKindRoutes);
router.use("/veterinarians", veterinarianRoutes);
router.use("/veterinarian-interventions", veterinarianInterventionRoutes);
router.use("/species", speciesRoutes);
router.use("/users", userRoutes);
router.use("/permissions", permissionRoutes);
router.use("/count-animals-adopted", countAnimalsAdoptedRoutes);
router.use("/count-animals-non-adopted", countAnimalsNonAdoptedRoutes);
router.use("/count-hostfamilies-available", countHostFamiliesAvailable);

export default router;
