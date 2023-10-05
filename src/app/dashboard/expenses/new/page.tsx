"use client";

import styles from "./styles.module.css";
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
import { Card } from "@/components/layoutElements/card";
import { useRouter } from "next/navigation";

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
	const router = useRouter();
	const [dateValue, setDateValue] = useState(new Date());
	const [expenseType, setExpenseType] = useState("");
	const [expenseValue, setExpenseValue] = useState<number | string | undefined>(
		""
	);
	const [expenseDescription, setExpenseDescription] = useState("");
	const [expenseValueFormError, setExpenseValueFormError] = useState(false);
	const [expenseTypeFormError, setExpenseTypeFormError] = useState(false);

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

	const formValidator = async () => {
		// @ts-ignore
		if (expenseValue.toString().length === 0) {
			setExpenseValueFormError(true);
		}
		if (expenseType.toString().length === 0) {
			setExpenseTypeFormError(true);
		}
	};

	const handleExpenseRequest = async () => {
		const dateFormatted = format(dateValue, "yyyy-MM-dd");
		await formValidator();
		const expenseData = {
			value: parseFloat(
				// @ts-ignore
				expenseValue.toString().replace(",", ".")
			),
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
		try {
			if (!expenseValueFormError && !expenseTypeFormError) {
				await api
					.post("/expenses", expenseData, config)
					.then(() => router.push("/dashboard/expenses"));
			}
		} catch (e) {
			console.log(e);
		}
	};

	return (
			<section className={`${styles[`expenses`]} ${karla.className}`}>
				<div className={`${styles[`expenses__wrapper`]}`}>
					<div className={`${styles[`expenses__header`]}`}>
						<span className={styles[`expenses-header__title--first`]}>New</span>{" "}
						<span className={styles[`expenses-header__title--second`]}>
							Expense
						</span>
					</div>
					<div className={styles[`expenses-top__container`]}>
						<Card>
							<div className={styles[`expenses-calendar__wrapper`]}>
								<div className={styles[`expenses-calendar__container`]}>
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
						</Card>
					</div>
					<div className={styles[`expenses-bottom__container`]}>
						<Card>
							<div className={styles[`expenses-value__container`]}>
								<InputValue
									onValueChange={(value) => handleExpenseValue(value)}
								/>
								{!expenseValueFormError ? (
									<div className={styles[`expenses__label`]}>
										<span>set value</span>
									</div>
								) : (
									<div className={styles[`expenses__label--error`]}>
										<span>set value</span>
									</div>
								)}
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
								{!expenseTypeFormError ? (
									<div className={styles[`expenses__label`]}>
										<span>select type</span>
									</div>
								) : (
									<div className={styles[`expenses__label--error`]}>
										<span>select type</span>
									</div>
								)}
							</div>
							<div>
								<div className={styles[`expenses-description__container`]}>
									<Input
										onChange={(e) => setExpenseDescription(e.target.value)}
									/>
								</div>
								<span className={styles[`expenses__label`]}>
									set description
								</span>
							</div>
							<div className={styles[`expenses-register__container`]}>
								<div className={styles[`expenses-register__wrapper`]}>
									<Button
										onClick={() => router.push("/dashboard/expenses")}
										label={"Cancel"}
										colour={"secondary"}
									/>
								</div>
								<Button onClick={handleExpenseRequest} label={"Register"} />
							</div>
						</Card>
					</div>
				</div>
			</section>
	);
}
