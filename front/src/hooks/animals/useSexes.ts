import { useQuery } from "@tanstack/react-query";
import AnimalsManager, { Sexe } from "../../managers/animals.manager";

const SEXES_QUERY_KEY = ["sexes"] as const;

export function useSexes() {
  return useQuery({
    queryKey: SEXES_QUERY_KEY,
    queryFn: (): Promise<Sexe[]> => AnimalsManager.getSexes(),
  });
}
