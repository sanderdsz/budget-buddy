"use client";

import { Karla, Rubik } from "next/font/google";
import { InputValue } from "@/components/basicElements/inputValue";
import Calendar from "react-calendar";
import { useState } from "react";
import { ExpenseTypeButton } from "@/components/expensesElements/expenseTypeButton/expenseTypeButton";
import { CurrencyInputProps } from "react-currency-input-field";
import { Button } from "@/components/basicElements/button";
import { format } from "date-fns";
import { api } from "@/services/api";
import Cookies from "js-cookie";
import { Input } from "@/components/basicElements/input";

import styles from "./styles.module.css";

const karla = Karla({
	subsets: ["latin"],
	weight: ["200", "400", "600"],
});

const rubik = Rubik({
	subsets: ["latin"],
	weight: ["400", "600"],
});

const expensesTypes = [
	"GROCERY",
	"MEALS",
	"SHOPPING",
	"HOUSING",
	"CAR",
	"PHARMACY",
];

export default function Expenses() {
	const [dateValue, setDateValue] = useState(new Date());
	const [expenseType, setExpenseType] = useState("");
	const [expenseValue, setExpenseValue] = useState<number | string | undefined>(
		""
	);
	const [expenseDescription, setExpenseDescription] = useState("");

	const handleExpenseValue: CurrencyInputProps["onValueChange"] = (
		expenseValue
	): void => {
		setExpenseValue(
			expenseValue === undefined ? "undefined" : expenseValue || ""
		);
	};

	const handleExpenseType = (expense: string) => {
		setExpenseType(expense);
	};

	const handleExpenseRequest = async () => {
		const dateFormatted = format(dateValue, "yyyy-MM-dd");
		const expenseData = {
			value: expenseValue,
			expenseType: expenseType,
			date: dateFormatted,
			description: expenseDescription,
		};
		const accessToken = Cookies.get("budgetbuddy.accessToken");
		const config = {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		};
		await api.post("/expenses", expenseData, config);
	};

	const colorMapper = (selected: string) => {
		switch (selected.toUpperCase()) {
			case "GROCERY":
				return "#7DA5A4";
			case "MEALS":
				return "#bf616a";
			case "SHOPPING":
				return "#DEA97E";
			case "HOUSING":
				return "#87A1C1";
			case "CAR":
				return "#AC9970";
			case "PHARMACY":
				return "#90AB7A";
			default:
				return "#c8ccd2";
		}
	};

	return (
		<section className={`${karla.className}`}>
			<div className={styles[`expenses-top__container`]}>
				<span className={styles[`expenses-header__title--first`]}>New</span>{" "}
				<span className={styles[`expenses-header__title--second`]}>
					Expenses
				</span>
				<div className={styles[`expenses-calendar__container`]}>
					<div>
						<Calendar
							locale={"en-US"}
							className={[`${rubik.className}`]}
							// @ts-ignore
							onChange={setDateValue}
							value={dateValue}
						/>
						<span className={styles[`expenses-calendar__label`]}>
							select date
						</span>
					</div>
				</div>
			</div>
			<div className={styles[`expenses-bottom__container`]}>
				<div className={styles[`expenses-value__container`]}>
					<InputValue onValueChange={(value) => handleExpenseValue(value)} />
					<div className={styles[`expenses__label`]}>
						<span>set value</span>
					</div>
				</div>
				<div className={styles[`expenses-type-selector__container`]}>
					<div className={styles[`expenses-type-selector__wrapper`]}>
						{expensesTypes.map((expense, index) => (
							<div
								key={index}
								className={styles[`expenses-type-selector__button`]}
							>
								<ExpenseTypeButton
									selected={expenseType === expense}
									onClick={() => setExpenseType(expense)}
									width={110}
									height={20}
									label={expense}
								/>
							</div>
						))}
					</div>
					<div className={styles[`expenses__label`]}>
						<span>select type</span>
					</div>
				</div>
				<div>
					<div className={styles[`expenses-description__container`]}>
						<Input onChange={(e) => setExpenseDescription(e.target.value)} />
					</div>
					<span className={styles[`expenses__label`]}>set description</span>
				</div>
				<div className={styles[`expenses-register__container`]}>
					<div className={styles[`expenses-register__wrapper`]}>
						<Button
							onClick={handleExpenseRequest}
							label={"Cancel"}
							color={"secondary"}
						/>
					</div>
					<Button onClick={handleExpenseRequest} label={"Register"} />
				</div>
			</div>
		</section>
	);
}
