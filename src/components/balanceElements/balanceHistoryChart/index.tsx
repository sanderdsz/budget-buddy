"use client";

import {
	Area,
	AreaChart,
	CartesianGrid,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { useTheme } from "@/contexts/themeContext";
import { PureComponent, useEffect, useState } from "react";
import { Button } from "@/components/basicElements/button";
import { api } from "@/services/api";
import Cookies from "js-cookie";
import { isMobile } from "react-device-detect";

import styles from "./styles.module.css";
import LoadingSpinner from "@/components/basicElements/loadingSpinner";

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
	const [isLoading, setIsLoading] = useState(true);

	const currencyFormatter = new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	});

	const monthNameFormatter = (monthNumber: number, long: boolean) => {
		const date = new Date(2000, monthNumber - 1);
		if (long) {
			return date.toLocaleString("en-US", { month: "long" });
		} else {
			return date.toLocaleString("en-US", { month: "short" });
		}
	};

	const CustomTooltip = ({ active, payload, label }: any) => {
		const fontColor = theme.activeTheme === "light" ? "#87A1C1" : "#c8ccd2";
		const backgroundColor = theme.activeTheme === "light" ? "#eceff4" : "#4c566a";
		if (active && payload && payload.length) {
			return (
				<div style={{
					padding: "0.25rem 0.5rem",
					background: backgroundColor,
					borderRadius: "5px",
					boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
					display: "flex",
					flexDirection: "column",
					gap: "0.25rem"
				}}>
					<p style={{ margin: 0, color: fontColor }}>
						{currentBalance === "week" ?
							`Week ${label}` :
							`${monthNameFormatter(label, true)}`
						}
					</p>
					<p
						style={{ margin: 0, color: fontColor }}
					>{`${currencyFormatter.format(payload[0].value)}`}</p>
				</div>
			);
		}
		return null;
	};

	class CustomWeekAxisTick extends PureComponent {
		render() {
			// @ts-ignore
			const { x, y, stroke, payload } = this.props;
			return (
				<g transform={`translate(${x},${y})`}>
					<text
						x={0}
						y={0}
						dy={8}
						textAnchor="end"
						fill="#4c566a"
						style={{ fontSize: 12 }}
					>
						{`week ${payload.value}`}
					</text>
				</g>
			);
		}
	}

	class CustomMonthAxisTick extends PureComponent {
		render() {
			// @ts-ignore
			const { x, y, stroke, payload } = this.props;
			return (
				<g transform={`translate(${x},${y})`}>
					<text
						x={0}
						y={0}
						dy={8}
						textAnchor="end"
						fill="#4c566a"
						transform="rotate(-25)"
						style={{ fontSize: 11 }}
					>
						{monthNameFormatter(payload.value, false)}
					</text>
				</g>
			);
		}
	}

	const CustomYAxisTick = ({ x, y, payload }: any) => {
		return (
			<text
				x={x}
				y={y}
				fill="#4c566a"
				style={{ fontSize: 12 }}
				textAnchor="end"
			>
				{`${payload.value}`}
			</text>
		);
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
			setIsLoading(false);
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
				{isLoading ? (
					<LoadingSpinner />
				) : (
					<>
						<AreaChart
							width={window.innerWidth > 800 ? 650 : width / widthResponsive}
							height={200}
							data={currentBalance === "week" ? weeklyBalance : monthlyBalance}
							margin={{
								top: 0,
								right: 5,
								left: 0,
								bottom: 0,
							}}
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
										dataKey={
											currentBalance === "week"
												? "weekBalance.balance"
												: "monthBalance.balance"
										}
										stroke="#4c566a"
										strokeWidth={2}
										fill="url(#colorUv)"
									/>
									<CartesianGrid
										strokeDasharray="8"
										vertical={false}
										stroke="#c8ccd2"
										strokeWidth={0.85}
									/>
									<YAxis
										stroke="#4c566a"
										axisLine={false}
										tickLine={false}
										style={{ fontSize: 12 }}
										tick={<CustomYAxisTick />}
									/>
									<XAxis
										dataKey={currentBalance === "week" ? "week" : "month"}
										stroke="#4c566a"
										axisLine={false}
										tickLine={false}
										hide={false}
										tick={
											currentBalance === "week" ? (
												<CustomWeekAxisTick />
											) : (
												<CustomMonthAxisTick />
											)
										}
									/>
								</>
							) : (
								<>
									<Area
										type="monotone"
										dataKey={
											currentBalance === "week"
												? "weekBalance.balance"
												: "monthBalance.balance"
										}
										stroke="#c8ccd2"
										strokeWidth={2}
										fill="url(#colorUv)"
									/>
									<CartesianGrid
										strokeDasharray="8"
										vertical={false}
										stroke="#4c566a"
										strokeWidth={0.85}
									/>
									<YAxis
										stroke="#4c566a"
										axisLine={false}
										tickLine={false}
										style={{ fontSize: 12 }}
										tick={<CustomYAxisTick />}
									/>
									<XAxis
										dataKey={currentBalance === "week" ? "week" : "month"}
										stroke="#c8ccd2"
										axisLine={false}
										tickLine={false}
										hide={false}
										tick={
											currentBalance === "week" ? (
												<CustomWeekAxisTick />
											) : (
												<CustomMonthAxisTick />
											)
										}
									/>
								</>
							)}
						</AreaChart>
					</>
				)}
			</div>
		</div>
	);
}
