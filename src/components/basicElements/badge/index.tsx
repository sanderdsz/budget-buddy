import styles from "./styles.module.css";
import { ReactNode } from "react";

type LabelProps = {
	children: ReactNode;
	color?: "primary" | "secondary" | "success" | "warning";
	customColor?: string;
	justifyStart?: boolean;
};

export const Badge = ({
	children,
	color,
	customColor,
	justifyStart = false,
}: LabelProps) => {
	return (
		<div
			className={`${styles[`label`]} ${styles[`${color}`]}`}
			style={{
				backgroundColor: customColor ? customColor : "",
				justifyContent: justifyStart ? "start" : "center",
			}}
		>
			{children}
		</div>
	);
};
