"use client";

import Skeleton from "react-loading-skeleton";
import { useTheme } from "@/contexts/themeContext";
import { useEffect, useState } from "react";
import { api } from "@/services/api";
import Cookies from "js-cookie";

import styles from "./styles.module.css";

export const YearExpenses = () => {
	const theme = useTheme();
	const [yearExpense, setYearExpense] = useState("");

	const currencyFormatter = new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	});

	const fetchBalance = async () => {
		const accessToken = Cookies.get("budgetbuddy.accessToken");
		const config = {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		};
		try {
			const response = await api.get(`/expenses/total/year`, config);
			setYearExpense(currencyFormatter.format(response.data.value));
			const teste = currencyFormatter.format(response.data.value);
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		fetchBalance();
	}, []);

	return (
		<div className={styles[`month-expenses__container`]}>
			<div className={styles[`month-expenses__title`]}>
				<span className={styles[`month-expenses__title--first`]}>Year</span>{" "}
				<span className={styles[`month-expenses__title--second`]}>
					Expenses
				</span>
			</div>
			<span className={yearExpense.length < 12 ?
					styles[`month-expenses__balance`] :
					styles[`month-expenses__balance--small`]
			}>
				{yearExpense ? (
					<>{yearExpense}</>
				) : (
					<Skeleton
						width={"60%"}
						baseColor={
							theme.activeTheme === "dark"
								? "var(--gray-02)"
								: "var(--white-05)"
						}
						highlightColor={
							theme.activeTheme === "dark"
								? "var(--gray-03)"
								: "var(--white-03)"
						}
					/>
				)}
			</span>
		</div>
	);
};
