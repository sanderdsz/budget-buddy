"use client";

import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { api } from "@/services/api";
import { useSession } from "next-auth/react";

export type User = {
	id: number;
	email: string;
	firstName?: string;
	lastName?: string;
	userChildren: User[];
	userParent: User;
	externalAvatar?: string;
};

type SignInProps = {
	email: string;
	password: string;
};

type SignInParams = {
	data: object;
	message: string;
	status: number;
};

type VerifyTokenParams = {
	email: string;
	accessToken: string;
};

type UserParams = {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	userChildren: User[];
	userParent: User;
};

type AuthProviderProps = {
	children: ReactNode;
};

type AuthContextData = {
	signIn: (credentials: SignInProps) => Promise<SignInParams>;
	user?: User;
	verifyToken: () => Promise<VerifyTokenParams | undefined>;
	fetchUser: () => Promise<void>;
	sessionCookies: (session: any) => Promise<void>;
};

const AuthContext = createContext({} as AuthContextData);

/*
 * TODO: useEffect function to auto get user data based on
 *  token stored into cookies from previous sessions if it exists.
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [user, setUser] = useState<User>();
	const router = useRouter();
	const { data: session }: any = useSession();

	const signIn = async ({ email, password }: SignInProps) => {
		try {
			const response = await api.post("/auth/login", { email, password });
			const { accessToken } = response.data;
			Cookies.set("budgetbuddy.accessToken", accessToken);
			Cookies.set("budgetbuddy.email", email);
			const config = {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			};
			const userResponse = await api.get(`/users/me`, config);
			setUser({
				id: userResponse.data.id,
				email,
				firstName: userResponse.data.firstName,
				lastName: userResponse.data.lastName,
				userChildren: userResponse.data.userChildren,
				userParent: userResponse.data.userParent,
			});
			await router.push("dashboard");
			return userResponse;
		} catch (err) {
			console.log(err);
			// @ts-ignore
			return err.response.data;
		}
	};

	const fetchUser = async () => {
		const accessToken = Cookies.get("budgetbuddy.accessToken");
		const config = {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		};
		const userResponse = await api.get<UserParams>(`/users/me`, config);
		setUser({
			id: userResponse.data.id,
			email: userResponse.data.email,
			firstName: userResponse.data.firstName,
			lastName: userResponse.data.lastName,
			userChildren: userResponse.data.userChildren,
			userParent: userResponse.data.userParent,
		});
	};

	const verifyToken = async (): Promise<VerifyTokenParams | undefined> => {
		const accessToken = Cookies.get("budgetbuddy.accessToken");
		const email = Cookies.get("budgetbuddy.email");
		if (!accessToken || !email) {
			router.push("/");
		}
		const data = {
			accessToken: accessToken,
			email: email,
		};
		try {
			const verifyTokenResponse = await api.post<VerifyTokenParams>(
				`/auth/verify`,
				data
			);
			return {
				accessToken: verifyTokenResponse.data.accessToken,
				email: verifyTokenResponse.data.email,
			};
		} catch (e: any) {
			if (e.response.status === 403 || e.response.status === 401) {
				router.push("/");
			}
			console.log(e);
		}
	};

	const sessionCookies = async (session : any)  => {
		Cookies.set("budgetbuddy.accessToken", session.accessToken);
		Cookies.set("budgetbuddy.email", session.user.email);
		Cookies.set("budgetbuddy.provider", "google");
		router.push("/dashboard");
	}

	return (
		<AuthContext.Provider value={{ user, signIn, verifyToken, fetchUser, sessionCookies }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(AuthContext);
};
