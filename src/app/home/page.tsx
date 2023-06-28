"use client";

import {
	Cell,
	LineChart,
	Line,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	Pie,
	PieChart,
} from "recharts";
import { useEffect, useState } from "react";
import { MobileLayout } from "@/layouts/mobile";
import { Karla } from "next/font/google";
import { useTheme } from "@/contexts/themeContext";
import { iconsFormatter } from "@/utils/iconsFormatter";
import { colorsFormatter } from "@/utils/colorsFormatter";
import { ProgressBar } from "@/components/progressBar";
import { Button } from "@/components/button";
import { api } from "@/services/api";
import LoadingSpinner from "@/components/loadingSpinner";
import Cookies from "js-cookie";

import styles from "./styles.module.css";
import Skeleton from "react-loading-skeleton";

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

const karla = Karla({
	subsets: ["latin"],
	weight: ["200", "400", "600"],
});

const renderCustomizedLabel = ({
	cx,
	cy,
	innerRadius,
	outerRadius,
	percent,
	midAngle,
	index,
}: LabelProps) => {
	const RADIAN = Math.PI / 180;
	const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
	const x = cx + radius * Math.cos(-midAngle * RADIAN);
	const y = cy + radius * Math.sin(-midAngle * RADIAN);
	return (
		<text
			x={x}
			y={y}
			fill="white"
			textAnchor={x > cx ? "start" : "end"}
			dominantBaseline="central"
		>
			{`${(percent * 100).toFixed(0)}%`}
		</text>
	);
};

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

const monthFormatter = new Intl.DateTimeFormat("en-US", {
	month: "long",
}).format(new Date());

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
	style: "currency",
	currency: "BRL",
});

export default function Home() {
	const theme = useTheme();
	const [isLoading, setIsLoading] = useState(false);
	const [balance, setBalance] = useState("");
	const [expense, setExpense] = useState("");
	const [weeklyBalance, setWeeklyBalance] = useState<WeeklyBalanceProps[]>();
	const [monthlyExpenses, setMonthlyExpenses] = useState<
		MonthlyExpenseProps[] | undefined
	>();
	const currentDate = new Date();
	const accessToken = Cookies.get("budgetbuddy.accessToken");
	const config = {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	};

	useEffect(() => {
		setIsLoading(true);
		fetchBalance();
		fetchWeeklyBalances();
		fetchMonthlyExpenses().then(() => {
			setIsLoading(false);
		});
	}, []);

	const fetchBalance = async () => {
		try {
			const response = await api.get(
				`/balances?year=${currentDate.getFullYear()}&month=${
					currentDate.getMonth() + 1
				}`,
				config
			);
			setBalance(currencyFormatter.format(response.data.balance));
			setExpense(currencyFormatter.format(response.data.expenses));
		} catch (e) {
			console.log(e);
		}
	};

	const fetchWeeklyBalances = async () => {
		try {
			const response = await api.get<WeeklyBalanceProps[]>(
				`/balances/weekly`,
				config
			);
			setWeeklyBalance(response.data);
		} catch (e) {
			console.log(e);
		}
	};

	const fetchMonthlyExpenses = async () => {
		try {
			const response = await api.get<MonthlyExpenseProps[]>(
				`/expenses/monthly`,
				config
			);
			setMonthlyExpenses(response.data);
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<MobileLayout>
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<section className={`${styles.home} ${karla.className}`}>
					<div className={styles[`home-chart`]}>
						<div className={styles[`home-chart__container`]}>
							<div className={styles[`home-chart__title`]}>
								<span className={styles[`home-chart__title--first`]}>
									Available
								</span>{" "}
								<span className={styles[`home-chart__title--second`]}>
									Balance
								</span>
							</div>
							<span className={styles[`home-chart__balance`]}>
								{
									balance ? (
										<>{ balance }</>
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
									)
								}
							</span>
						</div>
						<div className={styles[`home-chart__graph`]}>
							<div className={styles[`home-chart__graph-buttons`]}>
								<Button label={"Week"} />
								<Button label={"Month"} color={"secondary"} />
							</div>
							<ResponsiveContainer width="100%" height="100%">
								<LineChart width={300} height={100} data={weeklyBalance}>
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
							</ResponsiveContainer>
						</div>
					</div>
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
								{
									expense ? (
										<>You have spent { expense } so far.</>
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
									)
								}
							</span>
						</div>
						<div className={styles[`home-monthly__graph-container`]}>
							<div className={styles[`home-monthly__graph`]}>
								<ResponsiveContainer width="100%" height="100%">
									<PieChart width={100} height={200}>
										<Pie
											dataKey="totalValue"
											isAnimationActive={false}
											data={monthlyExpenses}
											cx="50%"
											cy="50%"
											outerRadius={70}
											fill="#8884d8"
											label={renderCustomizedLabel}
											labelLine={false}
										>
											{monthlyExpenses &&
												monthlyExpenses.map((expense, index) => (
													<Cell
														name={expense.expenseType}
														key={`cell-${index}`}
														fill={colorsFormatter(expense.expenseType)}
													/>
												))}
										</Pie>
										<Tooltip />
									</PieChart>
								</ResponsiveContainer>
							</div>
							<div className={styles[`home-monthly__graph-description`]}>
								{monthlyExpenses &&
									monthlyExpenses.map((expense, index) => (
										<div
											key={index}
											className={
												styles[`home-monthly__graph-description--text`]
											}
										>
											{iconsFormatter(expense.expenseType)}
											<span
												className={
													styles[`home-monthly__graph-description--icons`]
												}
												style={{
													color: colorsFormatter(expense.expenseType),
												}}
											>
												{currencyFormatter.format(expense.totalValue)}
											</span>
										</div>
									))}
							</div>
						</div>
						<div className={styles[`home-monthly__target`]}>
							<div className={styles[`home-monthly__target-container`]}>
								<span className={styles[`home-monthly__target-current`]}>
									{
										expense ? (
											<>{ expense }</>
										) : (
											<Skeleton
												width={"75px"}
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
										)
									}
								</span>
								<span className={styles[`home-monthly__target-maximum`]}>
									Target R$ 3.000,00
								</span>
							</div>
							<ProgressBar value={80} />
						</div>
					</div>
				</section>
			)}
		</MobileLayout>
	);
}
