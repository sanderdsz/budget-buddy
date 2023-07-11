import React from "react";
import {
	Basket,
	Buildings,
	Car,
	Hamburger,
	House,
	Pill,
	ShoppingBag,
} from "@phosphor-icons/react";
import { Karla } from "next/font/google";
import { colorMapper } from "@/utils/colorsUtil";

import styles from "./styles.module.css";

interface ExpenseTypeButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	label: string;
	height: number;
	width: number;
	selected: boolean;
}

const karla = Karla({
	subsets: ["latin"],
	weight: ["200", "400", "600"],
});

export const ExpenseTypeButton = ({
	height,
	label,
	width,
	selected = false,
	...props
}: ExpenseTypeButtonProps) => {
	const expenseTypeMapper = (label: string, height: number) => {
		switch (label.toUpperCase()) {
			case "GROCERY":
				return <Basket height={height} width={height} />;
			case "MEALS":
				return <Hamburger height={height} width={height} />;
			case "SHOPPING":
				return <ShoppingBag height={height} width={height} />;
			case "HOUSING":
				return <Buildings height={height} width={height} />;
			case "CAR":
				return <Car height={height} width={height} />;
			case "PHARMACY":
				return <Pill height={height} width={height} />;
		}
	};
	const buttonColor = selected ? colorMapper(label) : undefined;

	return (
		<button
			className={`${styles[`expense-button`]} ${karla.className}`}
			style={{ width: width, backgroundColor: buttonColor }}
			{...props}
		>
			<div>{expenseTypeMapper(label, height)}</div>
			<span>{label}</span>
		</button>
	);
};
