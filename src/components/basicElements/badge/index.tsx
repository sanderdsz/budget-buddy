import styles from "./styles.module.css";
import { ReactNode } from "react";

type LabelProps = {
	children: ReactNode;
	color?:
		| "primary"
		| "secondary"
		| "success"
		| "warning";
};

export const Badge = ({ children, color }: LabelProps) => {
	return (
		<div className={`${styles[`label`]} ${styles[`${color}`]}`}>
			{children}
		</div>
	);
};
