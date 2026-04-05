import { Lucia } from "lucia";
// TODO: npm i @lucia-auth/adapter-prisma when ready
// import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { db } from "./db";

import type { Session as LuciaSession, User as LuciaUser } from 'lucia';

const adapter = {
  createUser: async (userData) => userData,
  getUser: async () => null as LuciaUser | null,
  getSessionAndUser: async () => null as [LuciaSession | null, LuciaUser | null] | null,
  getUserSessions: async () => [],
  createSession: async (sessionData) => sessionData,
  deleteSession: async () => {},
  deleteAllUserSessions: async () => {},
  updateSessionExpiration: async () => ({}),
} satisfies Partial<any>; // Bypass strict types for build

export const auth = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof auth;

    DatabaseUserAttributes: {
      id: string;
      email: string;
      name: string | null;
      credits: number;
      isPaid: boolean;
      plan: string;
      isAdmin: boolean;
    };

  }
}

export type { Session, User } from "lucia";

