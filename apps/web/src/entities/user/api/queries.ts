import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authControllerLogout, useAuthControllerMe } from "../../../shared/api/openapi/client"
import type { AuthenticatedUserDto } from "../../../shared/api/openapi/model";

export const useCurrentUser = () => {
  return useAuthControllerMe({
    query: {
      queryKey: ['currentUser'],
      retry: false,
      staleTime: 5 * 60 * 1000,
    },
  })
}

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authControllerLogout(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
};

export type { AuthenticatedUserDto as User };
