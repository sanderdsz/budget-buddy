"use client";

import styles from "../new/styles.module.css";
import { Layout } from "@/layouts";
import { Karla, Rubik } from "next/font/google";
import { Card } from "@/components/layoutElements/card";
import Calendar from "react-calendar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { InputValue } from "@/components/basicElements/inputValue";
import { Input } from "@/components/basicElements/input";
import { Button } from "@/components/basicElements/button";
import { CurrencyInputProps } from "react-currency-input-field";
import { format } from "date-fns";
import Cookies from "js-cookie";
import { api } from "@/services/api";
import { IncomeTypeButton } from "@/components/incomesElements/incomeTypeButton";
import LoadingSpinner from "@/components/basicElements/loadingSpinner";

interface IncomeProps {
	id: number;
	value: number;
	incomeType: string;
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

const incomesTypes = ["SALARY", "TICKETS", "BONUS", "SERVICES"];

export default function EditIncome({ params }: { params: { id: string } }) {
	const router = useRouter();
	const [income, setIncome] = useState<IncomeProps>();
	const [dateValue, setDateValue] = useState(new Date());
	const [incomeType, setincomeType] = useState<string | undefined>("");
	const [incomeValue, setincomeValue] = useState<number | string | undefined>(
		""
	);
	const [incomeDescription, setIncomeDescription] = useState("");
	const [incomeValueFormError, setincomeValueFormError] = useState(false);
	const [incomeTypeFormError, setincomeTypeFormError] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	const handleIncomeValue: CurrencyInputProps["onValueChange"] = (
		incomeValue
	): void => {
		setincomeValue(incomeValue === undefined ? "undefined" : incomeValue || "");
	};

	const formValidator = async () => {
		// @ts-ignore
		if (incomeValue.toString().length === 0) {
			setincomeValueFormError(true);
		}
		// @ts-ignore
		if (incomeType.toString().length === 0) {
			setincomeTypeFormError(true);
		}
	};

	const handleIncomeRequest = async () => {
		const dateFormatted = format(dateValue, "yyyy-MM-dd");
		await formValidator();
		const incomeData = {
			value: incomeValue,
			incomeType: incomeType,
			date: dateFormatted,
			description: incomeDescription,
		};
		const accessToken = Cookies.get("budgetbuddy.accessToken");
		const config = {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		};
		try {
			if (!incomeValueFormError && !incomeTypeFormError) {
				await api
					.post("/incomes", incomeData, config)
					.then(() => router.push("/incomes"));
			}
		} catch (e) {
			console.log(e);
		}
	};

	const fetchIncomeById = async () => {
		const accessToken = Cookies.get("budgetbuddy.accessToken");
		const config = {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		};
		try {
			const response = await api.get(`/incomes/${params.id}`, config);
			setIncome(response.data);
			setIsLoading(false);
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		fetchIncomeById();
	}, []);

	useEffect(() => {
		// @ts-ignore
		setDateValue(income?.date);
		setincomeType(income?.incomeType);
		setincomeValue(income?.value);
		if (income?.description === null) {
			setIncomeDescription("");
		}
		// @ts-ignore
		setIncomeDescription(income?.description);
	}, [income]);

	return (
		<Layout>
			<section className={`${styles[`incomes`]} ${karla.className}`}>
				<div className={`${styles[`incomes__header`]}`}>
					<span className={styles[`incomes-header__title--first`]}>Edit</span>{" "}
					<span className={styles[`incomes-header__title--second`]}>
						Income
					</span>
				</div>
				<div className={`${styles[`incomes__wrapper`]}`}>
					<div className={styles[`incomes-top__container`]}>
						<Card>
							<div className={styles[`incomes-calendar__wrapper`]}>
								<div className={styles[`incomes-calendar__container`]}>
									{isLoading ? (
										<LoadingSpinner />
									) : (
										<Calendar
											locale={"en-US"}
											className={[`${rubik.className}`]}
											// @ts-ignore
											onChange={setDateValue}
											value={dateValue}
										/>
									)}
									<span className={styles[`incomes-calendar__label`]}>
										select date
									</span>
								</div>
							</div>
						</Card>
					</div>
					<div className={styles[`incomes-bottom__container`]}>
						<Card>
							{isLoading ? (
								<LoadingSpinner />
							) : (
								<>
									<div className={styles[`incomes-value__container`]}>
										<InputValue
											value={incomeValue}
											onValueChange={(value) => handleIncomeValue(value)}
										/>
										{!incomeValueFormError ? (
											<div className={styles[`incomes__label`]}>
												<span>set value</span>
											</div>
										) : (
											<div className={styles[`incomes__label--error`]}>
												<span>set value</span>
											</div>
										)}
									</div>
									<div className={styles[`incomes-type-selector__container`]}>
										<div className={styles[`incomes-type-selector__wrapper`]}>
											{incomesTypes.map((income, index) => (
												<div
													key={index}
													className={styles[`incomes-type-selector__button`]}
												>
													<IncomeTypeButton
														selected={incomeType === income}
														onClick={() => setincomeType(income)}
														width={120}
														height={20}
														label={income}
													/>
												</div>
											))}
										</div>
										{!incomeTypeFormError ? (
											<div className={styles[`incomes__label`]}>
												<span>select type</span>
											</div>
										) : (
											<div className={styles[`incomes__label--error`]}>
												<span>select type</span>
											</div>
										)}
									</div>
									<div>
										<div className={styles[`incomes-description__container`]}>
											<Input
												maxLength={30}
												defaultValue={incomeDescription}
												onChange={(e) => setIncomeDescription(e.target.value)}
											/>
										</div>
										<span className={styles[`incomes__label`]}>
											set description
										</span>
									</div>
									<div className={styles[`incomes-register__container`]}>
										<div className={styles[`incomes-register__wrapper`]}>
											<Button
												onClick={() => router.push("/incomes")}
												label={"Cancel"}
												colour={"secondary"}
											/>
										</div>
										<Button onClick={handleIncomeRequest} label={"Register"} />
									</div>
								</>
							)}
						</Card>
					</div>
				</div>
			</section>
		</Layout>
	);
}
