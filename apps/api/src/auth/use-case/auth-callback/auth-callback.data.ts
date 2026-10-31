export type AuthCallbackCommand = {
  code: string;
  state: string;
};

export type AuthCallbackResult = {
  sessionId: string;
  maxAge: number;
};
