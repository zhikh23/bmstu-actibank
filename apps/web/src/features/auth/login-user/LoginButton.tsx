import { Button } from "primereact/button";

export const LoginButton = () => {
  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/v1/auth/login?returnTo=http://localhost:5173/`;
  }

  return <Button onClick={handleLogin}>Войти</Button>
}
