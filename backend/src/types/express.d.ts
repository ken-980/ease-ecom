// src/types/express.d.ts
export interface AuthenticatedAdminPayload {
  id: number;
  userName: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedAdminPayload;
    }
  }
}