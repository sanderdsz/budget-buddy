"use client";

import styles from "./styles.module.css";
import { api } from "@/services/api";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Button } from "@/components/basicElements/button";
import { Karla } from "next/font/google";
import { parse, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { colorMapper } from "@/utils/colorsUtil";
import dynamic from "next/dynamic";
import { useTheme } from "@/contexts/themeContext";
import { isMobile } from "react-device-detect";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/basicElements/loadingSpinner";
import {SmileySad} from "@phosphor-icons/react";

interface ExpenseConnectionProps {
	id: number;
	value: number;
	expenseType: string;
	date: string;
	userName: string;
	description: string | null;
}

interface ExpenseTypeOptionProps {
	value: string;
	label: string;
}

const karla = Karla({
	subsets: ["latin"],
	weight: ["200", "400", "600"],
});

const Select = dynamic(() => import("react-select"), {
	ssr: false,
});

// @ts-ignore
const DatePicker = dynamic(() => import("react-date-picker"), {
	ssr: false,
});

export const ConnectionExpensesTable = () => {
	const router = useRouter();
	const themeContext = useTheme();
	const [isLoading, setIsLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(0);
	const [isNextPageEnable, setIsNextPageEnable] = useState(true);
	const [expenseTypeOption, setExpenseTypeOption] =
		useState<ExpenseTypeOptionProps>({
			value: "",
			label: "expense type",
		});
	const [expensesPageable, setExpensesPageable] = useState<
		ExpenseConnectionProps[]
	>([]);
	const [dateValue, setDateValue] = useState(null);
	const accessToken = Cookies.get("budgetbuddy.accessToken");
	const config = {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	};

	const expenseTypeOptions = [
		{ value: "", label: "expense type" },
		{ value: "GROCERY", label: "grocery" },
		{ value: "MEALS", label: "meals" },
		{ value: "SHOPPING", label: "shopping" },
		{ value: "HOUSING", label: "housing" },
		{ value: "CAR", label: "car" },
		{ value: "PHARMACY", label: "pharmacy" },
		{ value: "TRAVELS", label: "travels" },
	];

	const currencyFormatter = new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	});

	const dateFormatter = (date: string) => {
		const dateParse = parse(date, "yyyy-MM-dd", new Date());
		return format(dateParse, "dd/MM/yy", { locale: ptBR });
	};

	const nextPage = async () => {
		setCurrentPage((prevPage) => prevPage + 1);
	};

	const previousPage = async () => {
		setCurrentPage((prevPage) => (prevPage > 0 ? prevPage - 1 : 0));
	};

	const urlBuilder = () => {
		if (expenseTypeOption.value && dateValue) {
			return `/expenses/connected?page=${currentPage}&size=10&expenseType=${
				expenseTypeOption.value
			}&date=${format(dateValue, "yyyy-MM-dd")}`;
		} else if (expenseTypeOption.value) {
			return `/expenses/connected?page=${currentPage}&size=10&expenseType=${expenseTypeOption.value}`;
		} else if (dateValue) {
			return `/expenses/connected?page=${currentPage}&size=10&date=${format(
				dateValue,
				"yyyy-MM-dd"
			)}`;
		} else {
			return `/expenses/connected?page=${currentPage}&size=10`;
		}
	};

	const fetchMonthlyExpenses = async () => {
		setIsLoading(true);
		try {
			const response = await api.get(urlBuilder(), config);
			setExpensesPageable(response.data);
			if (response.data.length > 9) {
				setIsNextPageEnable(true);
			} else {
				setIsNextPageEnable(false);
			}
			setIsLoading(false);
		} catch (e) {
			console.log(e);
		}
	};

	const handleDeleteExpense = async (id: number) => {
		setIsLoading(true);
		try {
			const response = await api.delete(`/expenses/${id}`, config).then(() => {
				fetchMonthlyExpenses();
			});
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		fetchMonthlyExpenses();
	}, [currentPage, expenseTypeOption, dateValue]);

	return (
		<>
			{ isLoading ? (
				<LoadingSpinner />
			) : (
				<>
					<div className={`${karla.className}`}>
						<div className={`${styles[`expenses-table__header`]}`}>
							<div className={`${styles[`expenses-table__header--title`]}`}>
								<span>Expense</span>
								<span>Connection</span>
							</div>
							<>
								{ expensesPageable.length === 0 ? (
									<div style={{
										display: "flex",
										gap: "0.5rem",
										fontWeight: 200,
										fontSize: "1.25rem"
									}}>
										<SmileySad
											width={25}
											height={25}
										/>
										connections expenses are empty.
									</div>
								) : (
									<>
										<div className={`${styles[`expenses-table__header--buttons`]}`}>
											<DatePicker
												// @ts-ignore
												onChange={setDateValue}
												value={dateValue}/>
											<Select
												options={expenseTypeOptions}
												value={expenseTypeOption}
												// @ts-ignore
												onChange={setExpenseTypeOption}
												className="react-select-container"
												classNamePrefix="react-select"
												theme={(theme) => ({
													...theme,
													borderRadius: 5,
													colors: {
														...theme.colors,
														primary25: themeContext.activeTheme === "dark"
															? "#4c566a"
															: "#c8ccd2",
														primary: themeContext.activeTheme === "dark"
															? "#E4BA84"
															: "#5E81AC",
													},
												})}
												styles={{
													option: (base) => ({
														...base,
														borderRadius: `5px`,
													}),
												}}/>
										</div>
										<table className={`${styles[`expenses-table`]}`}>
											<thead>
											<tr>
												<th>Value</th>
												<th>Type</th>
												<th>Date</th>
												<th>User</th>
												<th>Description</th>
											</tr>
											</thead>
											<tbody>
											{expensesPageable.map((item, index) => (
												<tr key={index}>
													<td style={{textAlign: "end"}}>
														{currencyFormatter.format(item.value)}
													</td>
													<td
														style={{
															color: colorMapper(item.expenseType),
															fontWeight: 600,
															fontSize: isMobile ? ".85rem" : "1rem",
														}}
													>
														{item.expenseType.toLowerCase()}
													</td>
													<td
														style={{
															fontSize: isMobile ? ".85rem" : "1rem",
														}}
													>
														{dateFormatter(item.date)}
													</td>
													<td
														style={{
															fontSize: isMobile ? ".85rem" : "1rem",
														}}
													>
														{item.userName}
													</td>
													<td
														style={{
															fontSize: isMobile ? ".85rem" : "1rem",
														}}
													>
														{item.description}
													</td>
												</tr>
											))}
											</tbody>
										</table>
										<div className={styles[`expenses-table__footer`]}>
											<div className={styles[`expenses-table__footer-buttons`]}>
												<Button label={"<"} onClick={previousPage}/>
												<Button
													label={">"}
													onClick={nextPage}
													colour={isNextPageEnable ? "primary" : "disabled"}
													disabled={!isNextPageEnable}/>
											</div>
										</div>
									</>
								)}
							</>
						</div>
					</div>
				</>
			)}
		</>
	);
};
