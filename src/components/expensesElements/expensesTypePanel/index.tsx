"use client";

import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import { api } from "@/services/api";
import Cookies from "js-cookie";
import { iconsFormatter } from "../../../utils/iconsFormatter";
import { Badge } from "@/components/basicElements/badge";
import { ArrowDownRight, ArrowElbowRight } from "@phosphor-icons/react";
import Skeleton from "react-loading-skeleton";
import { useTheme } from "@/contexts/themeContext";
import "react-loading-skeleton/dist/skeleton.css";

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

export const ExpensesTypePanel = () => {
	const theme = useTheme();
	const currentDate = new Date();
	const accessToken = Cookies.get("budgetbuddy.accessToken");
	const [monthlyExpenses, setMonthlyExpenses] = useState<
		MonthlyExpenseProps[] | undefined
	>();
	const [lastMonthlyExpenses, setLastMonthlyExpenses] = useState<
		MonthlyExpenseProps[] | undefined
	>();
	const [isLoading, setIsLoading] = useState(true);

	const currencyFormatter = new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	});

	const config = {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	};

	const skeleton = Array.from({ length: 4 }, (_, index) => (
		<div key={index} className={styles[`expenses-type__loading--skeleton`]}>
			<Skeleton
				circle
				baseColor={
					theme.activeTheme === "dark" ? "var(--gray-02)" : "var(--white-05)"
				}
				highlightColor={
					theme.activeTheme === "dark" ? "var(--gray-03)" : "var(--white-03)"
				}
				style={{
					width: 60,
					height: 60,
				}}
			/>
			<Skeleton
				width={60}
				baseColor={
					theme.activeTheme === "dark" ? "var(--gray-02)" : "var(--white-05)"
				}
				highlightColor={
					theme.activeTheme === "dark" ? "var(--gray-03)" : "var(--white-03)"
				}
			/>
		</div>
	));

	const handleColorPercentage = (percentage: number) => {
		if (percentage > 65) {
			return "#bf616a";
		}
		if (percentage < 65 && percentage > 25) {
			return "#DEA97E";
		}
		return "#7D9768";
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

	const fetchLastMonthlyExpenses = async () => {
		try {
			const response = await api.get<MonthlyExpenseProps[]>(
				`/expenses/summary/month/${currentDate.getMonth()}`,
				config
			);
			setLastMonthlyExpenses(response.data);
			setIsLoading(false);
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		fetchMonthlyExpenses();
		fetchLastMonthlyExpenses();
	}, []);

	return (
		<div className={styles[`expenses-type`]}>
			<div className={styles[`expenses-type__header`]}>
				<div className={styles[`expenses-type__title`]}>
					<span className={styles[`expenses-type__title--first`]}>
						Expenses
					</span>
					<span className={styles[`expenses-type__title--second`]}>Types</span>
				</div>
				<div className={styles[`expenses-type__subtitle`]}>
					types and comparison by month
				</div>
			</div>
			<div className={styles[`expenses-type__container`]}>
				{isLoading ? (
					<div className={styles[`expenses-type__loading`]}>{skeleton}</div>
				) : (
					<>
						{monthlyExpenses &&
							monthlyExpenses.map((expense, index) => (
								<div key={index} className={styles[`expenses-type__wrapper`]}>
									<div className={styles[`expenses-type__box`]}>
										<div
											className={styles[`expenses-type__progress-bar`]}
											style={{
												background: `
                          radial-gradient(closest-side, white 60%, transparent 80% 100%),
                          conic-gradient(${handleColorPercentage(
														expense.percentage
													)} ${expense.percentage}%, #4c566a 0)
                        `,
											}}
										>
											<div className={styles[`expenses-type__icon`]}>
												{iconsFormatter(expense.expenseType)}
											</div>
										</div>
										<div className={styles[`expenses-type__badge`]}>
											{lastMonthlyExpenses &&
												lastMonthlyExpenses.map((lastExpense, index) => (
													<div key={index}>
														{expense.expenseType === lastExpense.expenseType ? (
															<>
																{expense.totalValue >
																	lastExpense.totalValue && (
																	<Badge
																		paddingX={0.1}
																		paddingY={0.1}
																		customColor={"#AC997099"}
																	>
																		<ArrowElbowRight width={15} height={15} />
																	</Badge>
																)}
																{expense.totalValue <
																	lastExpense.totalValue && (
																	<Badge
																		paddingX={0.1}
																		paddingY={0.1}
																		customColor={"#A3BE8C99"}
																	>
																		<ArrowDownRight width={15} height={15} />
																	</Badge>
																)}
															</>
														) : null}
													</div>
												))}
										</div>
									</div>
									<span
										className={styles[`expenses-type__value`]}
										style={{ color: handleColorPercentage(expense.percentage) }}
									>
										{currencyFormatter.format(expense.totalValue)}
									</span>
								</div>
							))}
					</>
				)}
			</div>
		</div>
	);
};
