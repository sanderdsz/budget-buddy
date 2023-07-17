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
import {isMobile} from "react-device-detect";

interface ExpenseProps {
	value: number;
	expenseType: string;
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

export const Table = () => {
	const themeContext = useTheme();
	const [currentPage, setCurrentPage] = useState(0);
	const [isNextPageEnable, setIsNextPageEnable] = useState(true);
	const [expenseTypeOption, setExpenseTypeOption] =
		useState<ExpenseTypeOptionProps>({
			value: "",
			label: "expense type",
		});
	const [expensesPageable, setExpensesPageable] = useState<ExpenseProps[]>([]);

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

	const fetchMonthlyExpenses = async () => {
		const accessToken = Cookies.get("budgetbuddy.accessToken");
		const config = {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		};
		const urlBuilder =
			expenseTypeOption.value === "" || expenseTypeOption.value === undefined
				? `/expenses/pageable?page=${currentPage}&size=10`
				: `/expenses/pageable?page=${currentPage}&size=10&expenseType=${expenseTypeOption.value}`;
		try {
			const response = await api.get(urlBuilder, config);
			setExpensesPageable(response.data);
			if (response.data.length > 9) {
				setIsNextPageEnable(true);
			} else {
				setIsNextPageEnable(false);
			}
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		fetchMonthlyExpenses();
	}, [currentPage, expenseTypeOption]);

	return (
		<div className={`${karla.className}`}>
			<div className={`${styles[`expenses-table__header`]}`}>
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
							primary25:
								themeContext.activeTheme === "dark" ? "#4c566a" : "#c8ccd2",
							primary:
								themeContext.activeTheme === "dark" ? "#E4BA84" : "#5E81AC",
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
			<table className={`${styles[`expenses-table`]}`}>
				<thead>
					<tr>
						<th>Value</th>
						<th>Expense Type</th>
						<th>Date</th>
						<th>Description</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{expensesPageable.map((item, index) => (
						<tr key={index}>
							<td>{currencyFormatter.format(item.value)}</td>
							<td
								style={{
									color: colorMapper(item.expenseType),
									fontWeight: 600,
								}}
							>
								{item.expenseType.toLowerCase()}
							</td>
							<td>{dateFormatter(item.date)}</td>
							<td>{item.description}</td>
							<td style={{
								display: 'flex',
								gap: isMobile ? '2px' : '5px',
								justifyContent: "flex-end"
							}}>
								<Button label={""} colour={"outline"} icon={"pencil"} size={"small"}/>
								<Button label={""} colour={"outline"} icon={"trash"} size={"small"}/>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			<div className={styles[`expenses-table__footer`]}>
				<div className={styles[`expenses-table__footer-buttons`]}>
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
	);
};
