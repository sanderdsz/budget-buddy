import React from "react";
import { Rubik } from "next/font/google";
import {
	Pencil,
	Trash,
} from "@phosphor-icons/react";

import styles from "./styles.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	colour?:
		| "primary"
		| "secondary"
		| "outline"
		| "success"
		| "warning"
		| "danger"
		| "disabled";
	size?: "small" | "medium" | "large";
	label?: string;
	height?: number;
	icon?:
		| "pencil"
		| "trash";
}

const iconsMapper = (icon: string) => {
	switch (icon) {
		case "pencil":
			return <Pencil height={20} width={20} />;
		case "trash":
			return <Trash height={20} width={20} />;
	}
};


const rubik = Rubik({ subsets: ["latin"] });

export const Button = ({
	colour = "primary",
	size = "medium",
	label,
	height = 1.5,
	icon,
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
			{ icon ? iconsMapper(icon) : null }
			{label}
		</button>
	);
};
