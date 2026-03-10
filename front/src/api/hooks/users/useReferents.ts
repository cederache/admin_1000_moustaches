import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../queryKeys";
import UsersManager from "../../managers/users.manager";

export function useReferents() {
  return useQuery({
    queryKey: queryKeys.users.referents,
    queryFn: () => UsersManager.getAllReferents(),
  });
}
