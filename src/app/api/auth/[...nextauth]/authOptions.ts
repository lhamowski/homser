import fs from "fs";
import CredentialsProvider from "next-auth/providers/credentials";

interface User {
  id: string;
  username: string;
  password: string;
}

let rawData = fs.readFileSync("users.json").toString();
let predefinedUsers = JSON.parse(rawData) as User[];

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
  debug: process.env.NODE_ENV === "development",
};
