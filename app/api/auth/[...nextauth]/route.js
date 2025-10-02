import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          const res = await fetch(`${API_BASE_URL}/auths/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          });

          if (!res.ok) {
            console.error("Failed to login with credentials");
            return null;
          }

          const user = await res.json();
          
          if (user) {
            return user;
          } else {
            return null;
          }
        } catch (error) {
          console.error("Credentials authorize error:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.provider === "google") {
        const googleUser = {
          email: user.email,
          firstName: user.name.split(" ")[0],
          lastName: user.name.split(" ").slice(1).join(" "),
          picture: user.image,
        };
        const res = await fetch(`${API_BASE_URL}/auths/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(googleUser),
        });
        if (res.ok) {
          const data = await res.json();
          const backendUser = data.payload;
          token.userId = backendUser.userId;
          token.role = backendUser.role;
          token.name = `${backendUser.firstName} ${backendUser.lastName}`;
          token.firstName = backendUser.firstName;
          token.lastName = backendUser.lastName;
          token.token = backendUser.token;
          token.profileImage = backendUser.profileImage;
        }
      } else if (user) {
        token.userId = user.userId;
        token.role = user.role;
        token.name = user.userName;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.token = user.token;
        token.profileImage = user.profileImage;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.userId;
        session.user.role = token.role;
        session.user.name = token.name;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.token = token.token;
        session.user.profileImage = token.profileImage;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 5 * 60 * 60, // 5 hours
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };