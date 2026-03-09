import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../api/queryKeys";
import UsersManager from "../../managers/users.manager";
import User from "../../logic/entities/User";

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (user: User) => UsersManager.update(user),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.referents });
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.detail(updatedUser.id),
      });
    },
  });
}
