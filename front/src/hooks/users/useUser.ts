import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../api/queryKeys";
import UsersManager from "../../managers/users.manager";

export function useUser(id: number | null) {
  return useQuery({
    queryKey: queryKeys.users.detail(id!),
    queryFn: () => UsersManager.getById(id!),
    enabled: id != null && !Number.isNaN(id),
  });
}
