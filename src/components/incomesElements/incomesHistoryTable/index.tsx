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

interface ExpenseProps {
	id: number;
	value: number;
	incomeType: string;
	date: string;
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

export const IncomesHistoryTable = () => {
	const router = useRouter();
	const themeContext = useTheme();
	const [isLoading, setIsLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(0);
	const [isNextPageEnable, setIsNextPageEnable] = useState(true);
	const [incomeTypeOption, setExpenseTypeOption] =
		useState<ExpenseTypeOptionProps>({
			value: "",
			label: "income type",
		});
	const [incomesPageable, setIncomesPageable] = useState<ExpenseProps[]>([]);
	const [dateValue, setDateValue] = useState(null);
	const accessToken = Cookies.get("budgetbuddy.accessToken");
	const config = {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	};

	const incomeTypeOptions = [
		{ value: "", label: "income type" },
		{ value: "SALARY", label: "salary" },
		{ value: "INVESTMENT", label: "investment" },
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
		if (incomeTypeOption.value && dateValue) {
			return `/incomes/pageable?page=${currentPage}&size=10&incomeType=${
				incomeTypeOption.value
			}&date=${format(dateValue, "yyyy-MM-dd")}`;
		} else if (incomeTypeOption.value) {
			return `/incomes/pageable?page=${currentPage}&size=10&incomeType=${incomeTypeOption.value}`;
		} else if (dateValue) {
			return `/incomes/pageable?page=${currentPage}&size=10&date=${format(
				dateValue,
				"yyyy-MM-dd"
			)}`;
		} else {
			return `/incomes/pageable?page=${currentPage}&size=10`;
		}
	};

	const fetchMonthlyIncomes = async () => {
		setIsLoading(true);
		try {
			const response = await api.get(urlBuilder(), config);
			setIncomesPageable(response.data);
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
			const response = await api.delete(`/incomes/${id}`, config).then(() => {
				fetchMonthlyIncomes();
			});
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		fetchMonthlyIncomes();
	}, [currentPage, incomeTypeOption, dateValue]);

	return (
		<>
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<div className={`${karla.className}`}>
					<div className={`${styles[`incomes-table__header`]}`}>
						<div className={`${styles[`incomes-table__header--title`]}`}>
							<span>Expense</span> <span>History</span>
						</div>
						<div className={`${styles[`incomes-table__header--buttons`]}`}>
							<DatePicker
								// @ts-ignore
								onChange={setDateValue}
								value={dateValue}
							/>
							<Select
								options={incomeTypeOptions}
								value={incomeTypeOption}
								// @ts-ignore
								onChange={setExpenseTypeOption}
								className="react-select-container"
								classNamePrefix="react-select"
								theme={(theme) => ({
									...theme,
									borderRadius: 5,
									colors: {
										...theme.colors,
										primary25:
											themeContext.activeTheme === "dark"
												? "#4c566a"
												: "#c8ccd2",
										primary:
											themeContext.activeTheme === "dark"
												? "#E4BA84"
												: "#5E81AC",
									},
								})}
								styles={{
									option: (base) => ({
										...base,
										borderRadius: `5px`,
									}),
								}}
							/>
						</div>
					</div>
					<table className={`${styles[`incomes-table`]}`}>
						<thead>
							<tr>
								<th>Value</th>
								<th>Type</th>
								<th>Date</th>
								<th>Description</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{incomesPageable.map((item, index) => (
								<tr key={index}>
									<td style={{textAlign: "end"}}>{currencyFormatter.format(item.value)}</td>
									<td
										style={{
											color: colorMapper(item.incomeType),
											fontWeight: 600,
											fontSize: isMobile ? ".85rem" : "1rem",
										}}
									>
										{item.incomeType.toLowerCase()}
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
										{item.description}
									</td>
									<td>
										<div
											style={{
												display: "flex",
												gap: isMobile ? "2px" : "5px",
												justifyContent: "flex-end",
											}}
										>
											<Button
												label={""}
												colour={"outline"}
												icon={"pencil"}
												size={"small"}
												onClick={() => router.push(`/incomes/${item.id}`)}
											/>
											<Button
												label={""}
												colour={"outline"}
												icon={"trash"}
												size={"small"}
												onClick={() => handleDeleteExpense(item.id)}
											/>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
					<div className={styles[`incomes-table__footer`]}>
						<div className={styles[`incomes-table__footer-buttons`]}>
							<Button label={"<"} onClick={previousPage} />
							<Button
								label={">"}
								onClick={nextPage}
								colour={isNextPageEnable ? "primary" : "disabled"}
								disabled={!isNextPageEnable}
							/>
						</div>
					</div>
				</div>
			)}
		</>
	);
};
