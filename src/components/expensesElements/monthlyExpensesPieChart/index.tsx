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
import { colorsFormatter } from "@/utils/colorsUtil";
import { api } from "@/services/api";
import Cookies from "js-cookie";
import Skeleton from "react-loading-skeleton";
import { iconsFormatter } from "@/utils/iconsFormatter";
import { ProgressBar } from "@/components/basicElements/progressBar";
import { useTheme } from "@/contexts/themeContext";

import styles from "./styles.module.css";

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

export default function MonthlyExpensesPieChart() {
	const theme = useTheme();
	const currentDate = new Date();
	const accessToken = Cookies.get("budgetbuddy.accessToken");
	const [monthlyExpenses, setMonthlyExpenses] = useState<
		MonthlyExpenseProps[] | undefined
	>();
	const [expense, setExpense] = useState("");

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
				`/expenses/monthly`,
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
			{monthlyExpenses?.length === 0 ? (
				<div className={styles[`home-monthly__graph-container`]}>
					<div className={styles[`home-monthly__graph-container--no-content`]}>
						There's no spending's this month yet.
					</div>
				</div>
			) : (
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
									className={styles[`home-monthly__graph-description--text`]}
								>
									{iconsFormatter(expense.expenseType)}
									<span
										className={styles[`home-monthly__graph-description--icons`]}
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
			)}
		</div>
	);
}
