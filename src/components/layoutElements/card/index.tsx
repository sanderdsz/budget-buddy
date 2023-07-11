import React, { ReactNode } from "react";

import styles from "./styles.module.css";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

export const Card = ({ children, ...props }: CardProps) => {
	return (
		<div className={styles[`card`]} {...props}>
			{children}
		</div>
	);
};
