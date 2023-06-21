"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { api } from "../services/api";

type User = {
	id: number;
	email: string;
	name?: string;
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

type AuthProviderProps = {
	children: ReactNode;
};

type AuthContextData = {
	signIn: (credentials: SignInProps) => Promise<SignInParams>;
	user?: User;
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
				name: userResponse.data.name,
			});
			await router.push("home");
			return userResponse;
		} catch (err) {
			console.log(err);
			// @ts-ignore
			return err.response.data;
		}
	};

	return (
		<AuthContext.Provider value={{ user, signIn }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(AuthContext);
};
