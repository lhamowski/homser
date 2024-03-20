import CredentialsProvider from "next-auth/providers/credentials";

const predefinedUsers = [
  { id: "1", username: "admin", password: "password123" },
  { id: "2", username: "admin2", password: "password123" },
];

export const authOptions = {
  pages: {
    signIn: "/login",
    error: "/error",
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials || !credentials.username || !credentials.password) {
          return null;
        }

        const user = predefinedUsers.find(
          (u) =>
            u.username === credentials.username &&
            u.password === credentials.password
        );

        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],

  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 Days
  },
  secret: process.env.AUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
