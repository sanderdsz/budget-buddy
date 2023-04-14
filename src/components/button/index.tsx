import React from "react";
import { Rubik } from "next/font/google";

import styles from "./styles.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
	color?: "primary" | "secondary" | "outline" | "success" | "warning" | "danger";
	size?: "small" | "medium" | "large";
	label: string;
}

const rubik = Rubik({ subsets: ["latin"] });

export const Button = ({
	color = "primary",
	size = "medium",
	label,
	...props
}: ButtonProps) => {
	return (
		<button
			className={`
				${styles.button}
				${styles[`${color}`]}
				${styles[`${size}`]}
				${rubik.className}
			`}
			{...props}
		>
			{label}
		</button>
	);
};
