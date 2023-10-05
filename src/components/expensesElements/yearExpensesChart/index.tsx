"use client";

import styles from "./styles.module.css";
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
import Cookies from "js-cookie";
import { api } from "@/services/api";
import { isMobile } from "react-device-detect";
import LoadingSpinner from "@/components/basicElements/loadingSpinner";

type YearExpensesProps = {
	value: number;
	month: number;
};

export const YearExpensesChart = () => {
	const theme = useTheme();
	const [isLoading, setIsLoading] = useState(true);
	const [width, setWidth] = useState(0);
	const [widthResponsive, setWidthResponsive] = useState(1.2);
	const [yearExpense, setYearExpense] = useState<YearExpensesProps[]>();

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
		const backgroundColor =
			theme.activeTheme === "light" ? "#eceff4" : "#4c566a";
		if (active && payload && payload.length) {
			return (
				<div
					style={{
						padding: "0.25rem 0.5rem",
						background: backgroundColor,
						borderRadius: "5px",
						boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
						display: "flex",
						flexDirection: "column",
						gap: "0.25rem",
					}}
				>
					<p style={{ margin: 0, color: fontColor }}>{`${monthNameFormatter(
						label,
						true
					)}`}</p>
					<p
						style={{ margin: 0, color: fontColor }}
					>{`${currencyFormatter.format(payload[0].value)}`}</p>
				</div>
			);
		}
		return null;
	};

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

	class CustomAxisTick extends PureComponent {
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
						transform="rotate(-35)"
						style={{ fontSize: 12 }}
					>
						{monthNameFormatter(payload.value, false)}
					</text>
				</g>
			);
		}
	}

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
			const response = await api.get<YearExpensesProps[]>(
				`/expenses/year`,
				config
			);
			setYearExpense(response.data);
			setIsLoading(false);
			return response.data;
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		fetchWeeklyBalances();
		setWidthResponsive(isMobile ? 1.125 : 1.5);
	}, []);

	useEffect(() => {
		handleWindowResize();
		window.addEventListener("resize", handleWindowResize);
		return () => window.removeEventListener("resize", handleWindowResize);
	}, []);

	return (
		<div className={`${styles[`year-expense-chart__container`]}`}>
			<div className={`${styles[`year-expense-chart__header`]}`}>
				<div className={styles[`year-expense-chart__title`]}>
					<div>
						<span className={styles[`year-expense-chart__title--first`]}>
							Expenses
						</span>{" "}
						<span className={styles[`year-expense-chart__title--second`]}>
							History
						</span>
					</div>
					<span className={styles[`year-expense-chart__title--subtitle`]}>
						expenses per month
					</span>
				</div>
			</div>
			{isLoading ? (
				<div className={`${styles[`year-expense-chart__loading`]}`}>
					<LoadingSpinner />
				</div>
			) : (
				<div className={`${styles[`year-expense-chart__chart`]}`}>
					<AreaChart
						width={window.innerWidth > 800 ? 650 : width / widthResponsive}
						height={220}
						data={yearExpense}
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
						<CartesianGrid
							strokeDasharray="8"
							vertical={false}
							stroke="#4c566a"
							strokeWidth={0.85}
						/>
						<Area
							type="monotone"
							dataKey={"value"}
							stroke="#4c566a"
							strokeWidth={2}
							fill="url(#colorUv)"
						/>
						<YAxis
							stroke="#4c566a"
							axisLine={false}
							tickLine={false}
							style={{ fontSize: 12 }}
							tick={<CustomYAxisTick />}
						/>
						<XAxis
							dataKey={"month"}
							stroke="#4c566a"
							axisLine={false}
							tickLine={false}
							hide={false}
							tick={<CustomAxisTick />}
						/>
					</AreaChart>
				</div>
			)}
		</div>
	);
};
