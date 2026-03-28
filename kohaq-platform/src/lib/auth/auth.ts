import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db/mongoose";
import User from "@/lib/db/models/User";

const credentialSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
});

const roleValues = ["student", "intern", "instructor", "partner", "admin"] as const;

function toKnownRole(value: string | undefined) {
	return roleValues.includes((value ?? "") as (typeof roleValues)[number])
		? (value as (typeof roleValues)[number])
		: "student";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
	session: { strategy: "jwt" },
	pages: {
		signIn: "/login",
	},
	providers: [
		Credentials({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				try {
					const parsed = credentialSchema.safeParse(credentials);

					if (!parsed.success) {
						return null;
					}

					await connectToDatabase();
					const existingUser = await User.findOne({ email: parsed.data.email }).lean();

					if (!existingUser || !existingUser.password) {
						return null;
					}

					const isValid = await bcrypt.compare(parsed.data.password, existingUser.password);

					if (!isValid) {
						return null;
					}

					return {
						id: existingUser._id.toString(),
						name: existingUser.name,
						email: existingUser.email,
						image: existingUser.image,
						role: existingUser.role,
					};
				} catch {
					return null;
				}
			},
		}),
		Google({
			clientId: process.env.GOOGLE_CLIENT_ID ?? "",
			clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
			allowDangerousEmailAccountLinking: true,
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.role = (user as { role?: string }).role ?? "student";
			}

			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.id as string;
				session.user.role = toKnownRole(token.role as string | undefined);
			}

			return session;
		},
	},
});
