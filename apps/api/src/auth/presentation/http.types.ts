export interface AuthRequest {
  headers: { cookie?: string };
}

export interface AuthResponse {
  redirect(url: string): void;
  cookie(name: string, value: string, options: Record<string, unknown>): void;
  clearCookie(name: string, options: Record<string, unknown>): void;
  status(code: number): { send(): void };
}
