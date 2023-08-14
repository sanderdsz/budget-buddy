"use client";

import styles from "./styles.module.css";
import { Karla } from "next/font/google";
import { Layout } from "@/layouts";
import { Button } from "@/components/basicElements/button";
import MonthlyExpensesPieChart from "@/components/expensesElements/monthlyExpensesPieChart";
import { Card } from "@/components/layoutElements/card";
import { isMobile } from "react-device-detect";
import { useEffect, useState } from "react";
import { ExpensesHistoryTable } from "@/components/expensesElements/expensesHistoryTable";
import { useRouter } from "next/navigation";
import {ConnectionExpensesTable} from "@/components/expensesElements/connectionExpensesTable";
import {MonthExpenses} from "@/components/expensesElements/monthExpenses";
import {YearExpenses} from "@/components/expensesElements/yearExpenses";

const karla = Karla({
	subsets: ["latin"],
	weight: ["200", "400", "600"],
});

export default function Expenses() {
	const router = useRouter();
	const [
		monthlyExpenseContainerResponsive,
		setMonthlyExpenseContainerResponsive,
	] = useState("");

	useEffect(() => {
		setMonthlyExpenseContainerResponsive(
			isMobile ? `expenses-card__container--md` : `expenses-card__container--md`
		);
	}, []);

	return (
		<Layout>
			<section className={`${styles[`expenses`]} ${karla.className}`}>
				<div className={styles[`expenses__wrapper`]}>
					<div className={styles[`expenses-header_container`]}>
						<div>
							<span className={styles[`expenses-header__title--first`]}>
								Your
							</span>{" "}
							<span className={styles[`expenses-header__title--second`]}>
								Expenses
							</span>
						</div>
						<Button
							height={2}
							label={"+ expense"}
							colour={"primary"}
							onClick={() => router.push("/expenses/new")}
						/>
					</div>
					{/*
					<div className={styles[`expenses_container--first`]}>
						<div className={styles[`${monthlyExpenseContainerResponsive}`]}>
							<Card>
								<MonthlyExpensesPieChart />
							</Card>
						</div>
					</div>
					*/}
					<div className={styles[`expenses_container--first`]}>
						<div className={styles[`${monthlyExpenseContainerResponsive}`]}>
							<Card>
								<MonthExpenses />
							</Card>
						</div>
						<div className={styles[`${monthlyExpenseContainerResponsive}`]}>
							<Card>
								<YearExpenses />
							</Card>
						</div>
					</div>
					<div className={styles[`expenses_container`]}>
						<Card>
							<ExpensesHistoryTable />
						</Card>
					</div>
					<div className={styles[`expenses_container`]}>
						<Card>
							<ConnectionExpensesTable />
						</Card>
					</div>
				</div>
			</section>
		</Layout>
	);
}
