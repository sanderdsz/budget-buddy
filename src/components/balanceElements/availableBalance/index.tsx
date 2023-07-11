"use client";

import Skeleton from "react-loading-skeleton";
import { useTheme } from "@/contexts/themeContext";
import { useEffect, useState } from "react";
import { api } from "@/services/api";
import Cookies from "js-cookie";

import styles from "./styles.module.css";

export const AvailableBalance = () => {
	const theme = useTheme();
	const currentDate = new Date();
	const [balance, setBalance] = useState("");

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
			const response = await api.get(
				`/balances?year=${currentDate.getFullYear()}&month=${
					currentDate.getMonth() + 1
				}`,
				config
			);
			setBalance(currencyFormatter.format(response.data.balance));
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		fetchBalance();
	}, []);

	return (
		<div className={styles[`available-balance__container`]}>
			<div className={styles[`available-balance__title`]}>
				<span className={styles[`available-balance__title--first`]}>
					Available
				</span>{" "}
				<span className={styles[`available-balance__title--second`]}>
					Balance
				</span>
			</div>
			<span className={styles[`available-balance__balance`]}>
				{balance ? (
					<>{balance}</>
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
