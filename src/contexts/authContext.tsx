"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { api } from "../services/api";

type User = {
	id: number;
	email: string;
	firstName?: string;
	lastName?: string;
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
};

const AuthContext = createContext({} as AuthContextData);

/*
 * TODO: useEffect function to auto get user data based on
 *  token stored into cookies from previous sessions if it exists.
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [user, setUser] = useState<User>();
	const router = useRouter();

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
			const userResponse = await api.get(`/users`, config);
			setUser({
				id: userResponse.data.id,
				email,
				firstName: userResponse.data.firstName,
				lastName: userResponse.data.lastName,
			});
			await router.push("home");
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
			if (e.response.status === 403) {
				router.push("/");
			}
		}
	};

	return (
		<AuthContext.Provider value={{ user, signIn, verifyToken, fetchUser }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(AuthContext);
};
