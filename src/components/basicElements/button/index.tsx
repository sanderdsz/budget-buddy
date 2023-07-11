import React from "react";
import { Rubik } from "next/font/google";

import styles from "./styles.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	colour?:
		| "primary"
		| "secondary"
		| "outline"
		| "success"
		| "warning"
		| "danger";
	size?: "small" | "medium" | "large";
	label: string;
	height?: number;
}

const rubik = Rubik({ subsets: ["latin"] });

export const Button = ({
	colour = "primary",
	size = "medium",
	label,
	height = 1.5,
	...props
}: ButtonProps) => {
	return (
		<button
			className={`
				${styles.button}
				${styles[`${colour}`]}
				${styles[`${size}`]}
				${rubik.className}
			`}
			style={{ height: `${height}rem` }}
			{...props}
		>
			{label}
		</button>
	);
};
