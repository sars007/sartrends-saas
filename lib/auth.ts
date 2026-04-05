import { Lucia } from "lucia";
// import { PrismaAdapter } from "@lucia-auth/adapter-prisma"; // missing dep, use dev adapter or mock
import { prisma } from "./db";

export const auth = new Lucia(new PrismaAdapter(prisma.user, prisma.session), {
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

