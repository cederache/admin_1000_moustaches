import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../api/queryKeys";
import UsersManager from "../../managers/users.manager";

export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users.all,
    queryFn: () => UsersManager.getAll(),
  });
}
