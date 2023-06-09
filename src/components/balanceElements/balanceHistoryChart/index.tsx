"use client";

import { Button } from "@/components/basicElements/button";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { useTheme } from "@/contexts/themeContext";
import { useEffect, useState } from "react";
import { api } from "@/services/api";
import Cookies from "js-cookie";
import { isMobile } from "react-device-detect";

import styles from "./styles.module.css";

type BalanceProps = {
	balance: number;
	expenses: number;
	incomes: number;
};

type WeeklyBalanceProps = {
	weekBalance: BalanceProps;
	week: number;
	startDate: string;
	endDate: string;
};

export default function BalanceHistoryChart() {
	const theme = useTheme();
	const [width, setWidth] = useState(0);
	const [weeklyBalance, setWeeklyBalance] = useState<WeeklyBalanceProps[]>();
	const [widthResponsive, setWidthResponsive] = useState(1.1);

	const currencyFormatter = new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	});

	const CustomTooltip = ({ active, payload, label }: any) => {
		if (active && payload && payload.length) {
			return (
				<div>
					<p style={{ margin: 0 }}>{`Week ${label}`}</p>
					<p style={{ margin: 0 }}>{`Balance: ${currencyFormatter.format(
						payload[0].value
					)}`}</p>
				</div>
			);
		}
		return null;
	};

	const handleWindowResize = () => {
		setWidth(window.innerWidth);
	};

	const fetchWeeklyBalances = async () => {
		const accessToken = Cookies.get("budgetbuddy.accessToken");
		const config = {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		};
		try {
			const response = await api.get<WeeklyBalanceProps[]>(
				`/balances/weekly`,
				config
			);
			setWeeklyBalance(response.data);
			return response.data;
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		fetchWeeklyBalances();
		setWidthResponsive(isMobile ? 1.2 : 1.425);
		if (window.innerWidth > 2100) {
			setWidthResponsive(2);
		}
	}, []);

	useEffect(() => {
		handleWindowResize();
		window.addEventListener("resize", handleWindowResize);
		return () => window.removeEventListener("resize", handleWindowResize);
	}, []);

	return (
		<div className={styles[`balance-history-chart__container`]}>
			<div className={styles[`balance-history-chart__header`]}>
				<div className={styles[`balance-history-chart__title`]}>
					<div>
						<span className={styles[`balance-history-chart__title--first`]}>
							Balance
						</span>{" "}
						<span className={styles[`balance-history-chart__title--second`]}>
							History
						</span>
					</div>
					<span className={styles[`balance-history-chart__title--subtitle`]}>
						balance per week
					</span>
				</div>
				<div className={styles[`balance-history-chart__buttons`]}>
					<Button height={2} label={"Week"} />
					<Button height={2} label={"Month"} colour={"secondary"} />
				</div>
			</div>
			<div className={styles[`balance-history-chart__chart`]}>
				<LineChart
					width={width / widthResponsive}
					height={200}
					data={weeklyBalance}
				>
					<Tooltip content={<CustomTooltip />} />
					{theme.activeTheme === "light" ? (
						<>
							<Line
								type="monotone"
								dataKey="weekBalance.balance"
								stroke="#4c566a"
								strokeWidth={2}
							/>
							<XAxis
								dataKey="week"
								stroke="#4c566a"
								axisLine={false}
								tickLine={false}
							/>
						</>
					) : (
						<>
							<Line
								type="monotone"
								dataKey="weekBalance.balance"
								stroke="#c8ccd2"
								strokeWidth={2}
							/>
							<XAxis
								dataKey="week"
								stroke="#c8ccd2"
								axisLine={false}
								tickLine={false}
							/>
						</>
					)}
				</LineChart>
			</div>
		</div>
	);
}
