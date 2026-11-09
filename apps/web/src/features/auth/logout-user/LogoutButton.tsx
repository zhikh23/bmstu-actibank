import { Button } from "primereact/button";
import { useLogout } from "../../../entities/user"

export const LogoutButton = () => {
  const { mutate, isPending } = useLogout();

  return (
    <Button onClick={() => mutate()} disabled={isPending}>
      Выйти
    </Button>
  )
}
