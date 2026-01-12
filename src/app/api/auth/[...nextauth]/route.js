import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        //  Input Validation
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please provide both email and password");
        }

        //  Connect to Database
        const client = await clientPromise;
        const db = client.db("bookworm");
        const usersCollection = db.collection("users");

        //  Find User
        const user = await usersCollection.findOne({
          email: credentials.email,
        });

        if (!user) {
          throw new Error("No user found with this email");
        }

        //  Verify Password
        //  For Google Auth users, user.password might be null
        if (!user.password) {
          throw new Error("This account uses a social login provider");
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValidPassword) {
          throw new Error("Invalid password");
        }

        // Return User Object (This gets passed to the JWT callback)
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    // Create JWT Token
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.picture = user.image;
      }

      // Allow client-side updates (e.g., if user changes their name/photo)
      if (trigger === "update" && session) {
        token.name = session.name;
        token.picture = session.image;
      }

      return token;
    },
    //  Create Session (Runs whenever useSession() is called)
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.image = token.picture;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
