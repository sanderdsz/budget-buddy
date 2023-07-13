"use client";

import styles from "./styles.module.css";
import { Karla, Rubik } from "next/font/google";
import {Layout} from "@/layouts";
import {Button} from "@/components/basicElements/button";
import MonthlyExpensesPieChart from "@/components/expensesElements/monthlyExpensesPieChart";
import {Card} from "@/components/layoutElements/card";
import { isMobile } from "react-device-detect";
import {useEffect, useState} from "react";

const karla = Karla({
	subsets: ["latin"],
	weight: ["200", "400", "600"],
});

const rubik = Rubik({
	subsets: ["latin"],
	weight: ["400", "600"],
});

export default function Expenses() {
	const [
		monthlyExpenseContainerResponsive,
		setMonthlyExpenseContainerResponsive,
	] = useState("");

	useEffect(() => {
		setMonthlyExpenseContainerResponsive(
			isMobile ? `expenses-card__container--lg` : `expenses-card__container--md`
		);
	}, []);

	return (
		<Layout>
			<section className={`${styles[`expenses`]} ${karla.className}`}>
				<div className={styles[`expenses__wrapper`]}>
					<div className={styles[`expenses-header_container`]}>
						<div>
							<span className={styles[`expenses-header__title--first`]}>New</span>{" "}
							<span className={styles[`expenses-header__title--second`]}>
								Expenses
							</span>
						</div>
						<Button height={2} label={"+ expense"} colour={"primary"}/>
					</div>
					<div className={styles[`expenses_container`]}>
						<div className={styles[`${monthlyExpenseContainerResponsive}`]}>
							<Card>
								<MonthlyExpensesPieChart />
							</Card>
						</div>
					</div>
				</div>
			</section>
		</Layout>
	);
}
