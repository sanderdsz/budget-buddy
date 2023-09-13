import React from "react";
import { Rubik } from "next/font/google";
import { Pencil, Trash, CheckFat, X } from "@phosphor-icons/react";

import styles from "./styles.module.css";
import LoadingSpinner from "@/components/basicElements/loadingSpinner";

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
	width?: number;
	icon?: "pencil" | "trash" | "check" | "cancel";
	isLoading?: boolean;
}

const iconsMapper = (icon: string) => {
	switch (icon) {
		case "pencil":
			return <Pencil height={20} width={20} />;
		case "trash":
			return <Trash height={20} width={20} />;
		case "check":
			return <CheckFat height={20} width={20} />;
		case "cancel":
			return <X height={20} width={20} />;
	}
};

const rubik = Rubik({ subsets: ["latin"] });

export const Button = ({
	colour = "primary",
	size = "medium",
	label,
	height = 1.5,
	width,
	icon,
	isLoading,
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
			style={{
				height: `${height}rem`,
				width: `${isLoading ? 4.5 : null}rem`
		}}
			{...props}
		>
			{isLoading ? (
				<LoadingSpinner width={20} height={20} borderWidth={4} />
			) : (
				<>
					{icon ? iconsMapper(icon) : null}
					{label}
				</>
			)}
		</button>
	);
};
