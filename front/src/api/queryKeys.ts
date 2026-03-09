/**
 * Central query key factory for TanStack Query.
 * Use these in hooks and invalidateQueries to avoid typos and keep consistency.
 */
export const queryKeys = {
  animals: {
    all: ["animals"] as const,
    detail: (id: number) => ["animals", id] as const,
    byHostFamily: (hostFamilyId: number) =>
      ["animals", "hostFamily", hostFamilyId] as const,
  },
  species: {
    all: ["species"] as const,
    detail: (id: number) => ["species", id] as const,
  },
  users: {
    all: ["users"] as const,
    referents: ["users", "referents"] as const,
    detail: (id: number) => ["users", id] as const,
  },
  hostFamilies: {
    all: (params?: { kinds?: number[]; isAvailable?: boolean }) =>
      ["hostFamilies", params] as const,
    detail: (id: number) => ["hostFamilies", id] as const,
    byAnimal: (animalId: number) =>
      ["hostFamilies", "animal", animalId] as const,
  },
  veterinarians: {
    all: ["veterinarians"] as const,
    detail: (id: number) => ["veterinarians", id] as const,
  },
  veterinarianInterventions: {
    all: ["veterinarianInterventions"] as const,
    detail: (id: number) => ["veterinarianInterventions", id] as const,
    byAnimal: (animalId: number) =>
      ["veterinarianInterventions", "animal", animalId] as const,
  },
  animalHostFamilies: {
    all: ["animalHostFamilies"] as const,
    byAnimal: (animalId: number) =>
      ["animalHostFamilies", "animal", animalId] as const,
    byHostFamily: (hostFamilyId: number) =>
      ["animalHostFamilies", "hostFamily", hostFamilyId] as const,
  },
  hostFamilyKinds: {
    all: ["hostFamilyKinds"] as const,
  },
  dashboard: {
    animalsAdopted: ["dashboard", "animalsAdopted"] as const,
    animalsNonAdopted: ["dashboard", "animalsNonAdopted"] as const,
    hostFamiliesAvailable: ["dashboard", "hostFamiliesAvailable"] as const,
  },
};
