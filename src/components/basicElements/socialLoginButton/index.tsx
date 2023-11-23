import React from "react";
import { Rubik } from "next/font/google";
import {GoogleLogo, Pencil, Trash, CheckFat, X, GithubLogo} from "@phosphor-icons/react";

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
	provider?: "Google" | "Github"
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

export const SocialLoginButton = ({
	colour = "primary",
	size = "medium",
	label,
	height = 2,
	width,
	icon,
	isLoading,
	provider,
	...props
}: ButtonProps) => {
	return (
		<button
			className={`
			${styles.button}
			${styles.background}
			${styles[`${size}`]}
			${rubik.className}
		`}
			style={{
				height: `${height}rem`,
				width: `${isLoading ? 4.5 : null}rem`,
				padding: 0
			}}
			{...props}
		>
			<div style={{
				display: "flex",
				alignItems: "center",
				paddingRight: ".5rem",
				paddingLeft: ".5rem"
			}}>
				{ provider === "Google" ? (
					<GoogleLogo
						width={20}
						height={20}
						className={styles[`logo-color`]}
					/>
				) : (
					<GithubLogo
						width={20}
						height={20}
						className={styles[`logo-color`]}
					/>
				)}
			</div>
			{isLoading ? (
				<LoadingSpinner
					width={20}
					height={20}
					borderWidth={4}
				/>
			) : (
				<div className={`
					${styles[`${colour}`]}
					${styles.label}
				`}>
					{icon ? iconsMapper(icon) : null}
					sign in with {provider}
				</div>
			)}
		</button>
	);
};
