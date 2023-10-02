"use client";

import styles from "../new/styles.module.css";
import { Layout } from "@/layouts";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { api } from "@/services/api";
import { Karla, Rubik } from "next/font/google";
import { Card } from "@/components/layoutElements/card";
import Calendar from "react-calendar";
import { InputValue } from "@/components/basicElements/inputValue";
import { ExpenseTypeButton } from "@/components/expensesElements/expenseTypeButton/expenseTypeButton";
import { Input } from "@/components/basicElements/input";
import { Button } from "@/components/basicElements/button";
import { useRouter } from "next/navigation";
import { CurrencyInputProps, formatValue } from "react-currency-input-field";

interface ExpenseProps {
	id: number;
	value: number;
	expenseType: string;
	date: string;
	description: string | null;
}

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

export default function Page({ params }: { params: { id: string } }) {
	const router = useRouter();
	const [expense, setExpense] = useState<ExpenseProps>();
	const [dateValue, setDateValue] = useState(new Date());
	const [expenseType, setExpenseType] = useState<string | undefined>("");
	const [expenseValue, setExpenseValue] = useState<number | string | undefined>(
		""
	);
	const [expenseDescription, setExpenseDescription] = useState<
		string | undefined
	>(undefined);
	const [expenseValueFormError, setExpenseValueFormError] = useState(false);
	const [expenseTypeFormError, setExpenseTypeFormError] = useState(false);

	const handleExpenseValue: CurrencyInputProps["onValueChange"] = (
		expenseValue
	): void => {
		setExpenseValue(expenseValue === undefined ? "" : expenseValue);
	};

	const fetchExpenseById = async () => {
		const accessToken = Cookies.get("budgetbuddy.accessToken");
		const config = {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		};
		try {
			const response = await api.get(`/expenses/${params.id}`, config);
			setExpense(response.data);
		} catch (e) {
			console.log(e);
		}
	};

	const formValidator = async () => {
		// @ts-ignore
		if (expenseValue.toString().length === 0) {
			setExpenseValueFormError(true);
		}
		// @ts-ignore
		if (expenseType.toString().length === 0) {
			setExpenseTypeFormError(true);
		}
	};

	const handleExpenseRequest = async () => {
		await formValidator();
		const expenseData = {
			id: params.id,
			value: parseFloat(
				// @ts-ignore
				expenseValue.toString().replace(",", ".")
			),
			expenseType: expenseType,
			date: dateValue,
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
					.put(`/expenses/${params.id}`, expenseData, config)
					.then(() => router.push("/expenses"));
			}
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		fetchExpenseById();
	}, []);

	useEffect(() => {
		// @ts-ignore
		setDateValue(expense?.date);
		setExpenseType(expense?.expenseType);
		setExpenseValue(expense?.value);
		if (expense?.description === null) {
			setExpenseDescription("");
		}
		// @ts-ignore
		setExpenseDescription(expense?.description);
	}, [expense]);

	return (
		<Layout>
			<section className={`${karla.className}`}>
				<div className={`${styles[`expenses__header`]}`}>
					<span className={styles[`expenses-header__title--first`]}>Edit</span>{" "}
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
								value={expenseValue}
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
									maxLength={30}
									defaultValue={expenseDescription}
									onChange={(e) => setExpenseDescription(e.target.value)}
								/>
							</div>
							<span className={styles[`expenses__label`]}>set description</span>
						</div>
						<div className={styles[`expenses-register__container`]}>
							<div className={styles[`expenses-register__wrapper`]}>
								<Button
									onClick={() => router.push("/expenses")}
									label={"Cancel"}
									colour={"secondary"}
								/>
							</div>
							<Button onClick={handleExpenseRequest} label={"Register"} />
						</div>
					</Card>
				</div>
			</section>
		</Layout>
	);
}
