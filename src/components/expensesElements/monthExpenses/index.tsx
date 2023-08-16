"use client";

import Skeleton from "react-loading-skeleton";
import { useTheme } from "@/contexts/themeContext";
import { useEffect, useState } from "react";
import { api } from "@/services/api";
import Cookies from "js-cookie";

import styles from "./styles.module.css";

export const MonthExpenses = () => {
	const theme = useTheme();
	const [monthExpense, setMonthExpense] = useState("");

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
			const response = await api.get(`/expenses/total/month`, config);
			setMonthExpense(currencyFormatter.format(response.data.value));
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
				<span className={styles[`month-expenses__title--first`]}>Month</span>{" "}
				<span className={styles[`month-expenses__title--second`]}>
					Expenses
				</span>
			</div>
			<span className={styles[`month-expenses__balance`]}>
				{monthExpense ? (
					<>{monthExpense}</>
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
