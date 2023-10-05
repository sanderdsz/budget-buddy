"use client";

import {
	Cell,
	ResponsiveContainer,
	Tooltip,
	Pie,
	PieChart,
	Label,
	Sector,
} from "recharts";
import { useEffect, useState } from "react";
import { colorsFormatter, iconsMapper } from "@/utils/colorsUtil";
import { api } from "@/services/api";
import Cookies from "js-cookie";
import Skeleton from "react-loading-skeleton";
import { useTheme } from "@/contexts/themeContext";

import styles from "./styles.module.css";
import LoadingSpinner from "@/components/basicElements/loadingSpinner";

type ExpenseProps = {
	value: number;
	expenseType: string;
	date: string;
};

type MonthlyExpenseProps = {
	expenses: ExpenseProps[];
	expenseType: string;
	totalValue: number;
	percentage: number;
};

type LabelProps = {
	cx: number;
	cy: number;
	midAngle: number;
	innerRadius: number;
	outerRadius: number;
	percent: number;
	index: number;
};

export default function ExpensesPieChart() {
	const theme = useTheme();
	const currentDate = new Date();
	const accessToken = Cookies.get("budgetbuddy.accessToken");
	const [monthlyExpenses, setMonthlyExpenses] = useState<
		MonthlyExpenseProps[] | undefined
	>();
	const [expense, setExpense] = useState("");
	const [isLoading, setIsLoading] = useState(true);

	const renderLabelContent = (props: any) => {
		const {
			value,
			name,
			x,
			y,
			midAngle,
			fill,
			outerRadius,
			percentage,
			cx,
			cy,
		} = props;
		const xAngle = (percentage: number) => {
			if (midAngle < -170) {
				return -50;
			}
			if (midAngle < -150) {
				return -60;
			}
			if (midAngle < -100) {
				return -50;
			}
			if (percentage < -125) {
				return -90;
			}
			return 0;
		};
		return (
			<g transform={`translate(${x}, ${y})`} textAnchor={"start"}>
				<text
					x={xAngle(midAngle)}
					y={10}
					fill={`${fill}`}
					fontSize={"1rem"}
					fontWeight={600}
				>
					R$ {`${value}`}
				</text>
			</g>
		);
	};

	const CustomTooltip = (props: any) => {
		const { active, payload, label, name } = props;
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
					<span
						style={{
							color: theme.activeTheme === "light" ? "#87A1C1" : "#c8ccd2",
						}}
					>
						{payload[0].name.toLowerCase()}
					</span>
					<span
						style={{
							margin: 0,
							color: theme.activeTheme === "light" ? "#87A1C1" : "#c8ccd2",
						}}
					>
						{`${currencyFormatter.format(payload[0].value)}`}
					</span>
				</div>
			);
		}
		return null;
	};

	const monthFormatter = new Intl.DateTimeFormat("en-US", {
		month: "long",
	}).format(new Date());

	const currencyFormatter = new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	});

	const config = {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	};

	const fetchMonthlyExpenses = async () => {
		try {
			const response = await api.get<MonthlyExpenseProps[]>(
				`/expenses/summary/month/${currentDate.getMonth() + 1}`,
				config
			);
			setMonthlyExpenses(response.data);
		} catch (e) {
			console.log(e);
		}
	};

	const fetchBalance = async () => {
		try {
			const response = await api.get(
				`/balances?year=${currentDate.getFullYear()}&month=${
					currentDate.getMonth() + 1
				}`,
				config
			);
			setExpense(currencyFormatter.format(response.data.expenses));
			setIsLoading(false);
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		fetchMonthlyExpenses();
		fetchBalance();
	}, []);

	return (
		<div className={styles[`home-monthly`]}>
			<div className={styles[`home-monthly__title-container`]}>
				<div className={styles[`home-monthly__title`]}>
					<span className={styles[`home-monthly__title--first`]}>
						{monthFormatter}
					</span>{" "}
					<span className={styles[`home-monthly__title--second`]}>
						Spending
					</span>
				</div>
				<span className={styles[`home-monthly__balance`]}>
					{expense ? (
						<span className={styles[`home-monthly__subtitle`]}>
							You have spent{" "}
							<span className={styles[`home-monthly__subtitle--expense`]}>
								{expense}
							</span>{" "}
							so far.
						</span>
					) : (
						<Skeleton
							width={"75%"}
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
			{isLoading ? (
				<div className={styles[`home-monthly__loading-container`]}>
					<LoadingSpinner />
				</div>
			) : (
				<>
					{monthlyExpenses?.length === 0 ? (
						<div className={styles[`home-monthly__graph-container`]}>
							<div
								className={styles[`home-monthly__graph-container--no-content`]}
							>
								There's no spending's this month.
							</div>
						</div>
					) : (
						<div className={styles[`home-monthly__graph-container`]}>
							<div className={styles[`home-monthly__graph`]}>
								<PieChart width={300} height={250}>
									<Pie
										dataKey="totalValue"
										isAnimationActive={true}
										data={monthlyExpenses}
										cx="50%"
										cy="50%"
										startAngle={180}
										endAngle={-180}
										innerRadius={55}
										paddingAngle={5}
										// @ts-ignore
										outerRadius={monthlyExpenses?.length > 5 ? 90 : 80}
										label={renderLabelContent}
										labelLine={false}
									>
										{monthlyExpenses &&
											monthlyExpenses.map((expense, index) => (
												<Cell
													name={expense.expenseType}
													key={`cell-${index}`}
													fill={colorsFormatter(expense.expenseType)}
													stroke={colorsFormatter(expense.expenseType)}
													strokeWidth={1}
												/>
											))}
										<Label
											width={50}
											position="center"
											fontWeight={600}
											fill={
												theme.activeTheme === "light" ? "#232730" : "#c8ccd2"
											}
										>
											{expense}
										</Label>
									</Pie>
									<Tooltip
										wrapperStyle={{ outline: "none" }}
										content={<CustomTooltip />}
									/>
								</PieChart>
							</div>
						</div>
					)}
				</>
			)}
		</div>
	);
}
