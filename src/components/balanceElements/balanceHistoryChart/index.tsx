"use client";

import { Button } from "@/components/basicElements/button";
import {
	Area,
	AreaChart,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
} from "recharts";
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

type MonthlyBalanceProps = {
	monthBalance: BalanceProps;
	month: number;
	startDate: string;
	endDate: string;
};

export default function BalanceHistoryChart() {
	const theme = useTheme();
	const [width, setWidth] = useState(0);
	const [weeklyBalance, setWeeklyBalance] = useState<WeeklyBalanceProps[]>();
	const [monthlyBalance, setMonthlyBalance] = useState<MonthlyBalanceProps[]>();
	const [currentBalance, setCurrentBalance] = useState("month");
	const [widthResponsive, setWidthResponsive] = useState(1.2);

	const currencyFormatter = new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	});

	const CustomTooltip = ({ active, payload, label }: any) => {
		const fontColor = theme.activeTheme === "light" ? "#5E81AC" : "#EBCB8B";
		if (active && payload && payload.length) {
			return (
				<div>
					<p style={{ margin: 0, color: fontColor }}>{
						currentBalance === "week" ? `Week ${label}` : `Month ${label}`
					}</p>
					<p
						style={{ margin: 0, color: fontColor }}
					>{`Balance: ${currencyFormatter.format(payload[0].value)}`}</p>
				</div>
			);
		}
		return null;
	};

	const handleWindowResize = () => {
		setWidth(window.innerWidth);
	};

	const handleCurrentBalance = (balance: string) => {
		if (balance === "week") {
			setCurrentBalance("week");
		} else {
			setCurrentBalance("month");
		}
	}

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

	const fetchMonthlyBalances = async () => {
		const accessToken = Cookies.get("budgetbuddy.accessToken");
		const config = {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		};
		try {
			const response = await api.get<MonthlyBalanceProps[]>(
				`/balances/monthly`,
				config
			);
			setMonthlyBalance(response.data);
			return response.data;
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		fetchWeeklyBalances();
		fetchMonthlyBalances();
		setWidthResponsive(isMobile ? 1.2 : 1.5);
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
						balance per {currentBalance}
					</span>
				</div>
				<div className={styles[`balance-history-chart__buttons`]}>
					<Button
						height={2}
						label={"Week"}
						colour={currentBalance === "week" ? "primary" : "secondary"}
						onClick={() => handleCurrentBalance("week")}
					/>
					<Button
						height={2}
						label={"Month"}
						colour={currentBalance === "month" ? "primary" : "secondary"}
						onClick={() => handleCurrentBalance("month")}
					/>
				</div>
			</div>
			<div className={styles[`balance-history-chart__chart`]}>
				<AreaChart
					width={window.innerWidth > 800 ? 650 : width / widthResponsive}
					height={200}
					data={currentBalance === "week" ? weeklyBalance : monthlyBalance}
				>
					<defs>
						<linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
							<stop offset="5%" stopColor="#5E81AC" stopOpacity={0} />
							<stop offset="95%" stopColor="#5E81AC" stopOpacity={1} />
						</linearGradient>
					</defs>
					<Tooltip
						wrapperStyle={{ outline: "none" }}
						content={<CustomTooltip />}
					/>
					{theme.activeTheme === "light" ? (
						<>
							<Area
								type="monotone"
								dataKey={currentBalance === "week" ? "weekBalance.balance" : "monthBalance.balance"}
								stroke="#4c566a"
								strokeWidth={2}
								fill="url(#colorUv)"
							/>
							<XAxis
								dataKey={currentBalance === "week" ? "week" : "month"}
								stroke="#4c566a"
								axisLine={false}
								tickLine={false}
								hide={true}
							/>
						</>
					) : (
						<>
							<Area
								type="monotone"
								dataKey={currentBalance === "week" ? "weekBalance.balance" : "monthBalance.balance"}
								stroke="#c8ccd2"
								strokeWidth={2}
								fill="url(#colorUv)"
							/>
							<XAxis
								dataKey={currentBalance === "week" ? "week" : "month"}
								stroke="#c8ccd2"
								axisLine={false}
								tickLine={false}
								hide={true}
							/>
						</>
					)}
				</AreaChart>
			</div>
		</div>
	);
}
