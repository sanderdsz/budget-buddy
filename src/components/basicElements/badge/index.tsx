import styles from "./styles.module.css";
import { ReactNode } from "react";

type LabelProps = {
	children: ReactNode;
	color?: "primary" | "secondary" | "success" | "warning";
	customColor?: string;
	justifyStart?: boolean;
	paddingX?: number;
	paddingY?: number;
};

export const Badge = ({
	children,
	color = "primary",
	customColor,
	justifyStart = false,
	paddingX = 0.15,
	paddingY = 0.35,
}: LabelProps) => {
	return (
		<div
			className={`${styles[`label`]} ${styles[`${color}`]}`}
			style={{
				backgroundColor: customColor ? customColor : "",
				justifyContent: justifyStart ? "start" : "center",
				padding: `${paddingX}rem ${paddingY}rem`
			}}
		>
			{children}
		</div>
	);
};
