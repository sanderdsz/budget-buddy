import { createContext, ReactNode, useContext, useState } from "react";
import Router from "next/router";

type User = {
	email: string;
	name?: string;
};

type AuthProviderProps = {
	children: ReactNode;
};

type AuthContextData = {
	signIn: (credentials: SignInProps) => Promise<void>;
	user?: User;
};

type SignInProps = {
	email: string;
	password: string;
};

const AuthContext = createContext({} as AuthContextData);

/*
 * TODO: useEffect function to auto get user data based on
 *  token stored into cookies from previous sessions if it exists.
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [user, setUser] = useState<User>();

	const signIn = async ({ email, password }: SignInProps) => {
		try {
			console.log(email);
			console.log(password);
			setUser({ email });
			await Router.push("home");
		} catch (err) {
			console.log(err);
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
