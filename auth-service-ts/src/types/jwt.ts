// Types for JWT payloads
export interface JwtPayload {
  userId: number;
  email: string;
  discordId?: string;
}
