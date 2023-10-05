import React from "react";
import CurrencyInput, { CurrencyInputProps } from "react-currency-input-field";
import { Karla } from "next/font/google";

import styles from "./styles.module.css";

const karla = Karla({
	subsets: ["latin"],
	weight: ["200", "400", "600"],
});

export const InputValue = ({ onValueChange, ...props }: CurrencyInputProps) => {
	return (
		<CurrencyInput
			className={`${karla.className} ${styles[`input-value`]}`}
			placeholder={"R$ 10.000,00"}
			prefix="R$"
			onValueChange={onValueChange}
			intlConfig={{ locale: "pt-BR", currency: "BRL" }}
			{...props}
		/>
	);
};
