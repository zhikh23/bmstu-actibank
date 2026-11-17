export const getLoginUrl = () => {
  const returnTo = `${window.location.origin}/`;

  return `${import.meta.env.VITE_API_URL}/api/v1/auth/login?returnTo=${encodeURIComponent(returnTo)}`;
};
