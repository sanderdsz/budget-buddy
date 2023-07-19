import React from "react";

import styles from "./styles.module.css";
import { Karla } from "next/font/google";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const karla = Karla({
	subsets: ["latin"],
	weight: ["400"],
});

export const Input = ({ ...props }: InputProps) => {
	return <input className={`${karla.className} ${styles.input}`} {...props} />;
};
