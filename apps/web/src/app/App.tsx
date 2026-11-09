import { useCurrentUser } from "../entities/user";
import { LoginButton } from "../features/auth/login-user/LoginButton";
import { LogoutButton } from "../features/auth/logout-user/LogoutButton";

const App = () => {
  const { data: user, isLoading, isError } = useCurrentUser();

  if (isLoading) return <div>Загрузка...</div>;

  if (isError || !user) {
    return (
      <div>
        Вы не авторизованы
        <LoginButton />
      </div>
    )
  }

  return (
    <div>
      <p>ID: {user.id}</p>
      <p>Roles: {user.roles.join(', ')}</p>
      <LogoutButton />
    </div>
  );
}

export default App;
