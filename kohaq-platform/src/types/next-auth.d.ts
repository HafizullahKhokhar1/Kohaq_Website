import { DefaultSession } from "next-auth";

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			role: "student" | "intern" | "instructor" | "partner" | "admin";
		} & DefaultSession["user"];
	}

	interface User {
		role?: "student" | "intern" | "instructor" | "partner" | "admin";
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		id?: string;
		role?: string;
	}
}

export {};
