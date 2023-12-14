import type {NextAuthOptions} from 'next-auth'
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import {api} from "@/services/api";

interface GoogleAccountProps {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
}

let apiAccessToken: any;

async function refreshAccessToken(account: any, user: GoogleAccountProps) {
  try {
    const refreshedTokens = await api.post(
      `/auth/google?accessToken=${account.access_token}`, user
    );
    apiAccessToken = refreshedTokens.data.accessToken;
    return refreshedTokens.data;
  } catch (error) {
    throw error;
  }
}

export const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    })
  ],
  callbacks: {
    // @ts-ignore
    async jwt({user, token, account}) {
      let googleAccount: GoogleAccountProps;
      if (account?.provider === 'google') {
        const nameParts = user.name?.split(' ');
        googleAccount = {
          id: user.id,
          // @ts-ignore
          firstName: nameParts[0],
          // @ts-ignore
          lastName: nameParts.slice(1).join(' '),
          // @ts-ignore
          email: user.email,
          // @ts-ignore
          image: user.image
        }
        const accessToken = await refreshAccessToken(account, googleAccount);
        return token;
      }
    },
    /*
    async redirect({url, baseUrl}) {
      return `${baseUrl}/dashboard`
    },
    */
    async session({ session, token, user }: any) {
      console.log("API TOKEN: " + apiAccessToken)
      session.accessToken = apiAccessToken;
      return session
    }
  }
};