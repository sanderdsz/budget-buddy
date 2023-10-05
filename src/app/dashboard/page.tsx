"use client";

import { useEffect, useState } from "react";
import { Karla } from "next/font/google";
import LoadingSpinner from "@/components/basicElements/loadingSpinner";
import { Card } from "@/components/layoutElements/card";
import dynamic from "next/dynamic";
import { AvailableBalance } from "@/components/balanceElements/availableBalance";
import { isMobile } from "react-device-detect";
import { MonthlyTarget } from "@/components/balanceElements/monthlyTarget/monthlyTarget";
import ExpensesPieChart from "@/components/expensesElements/expensesPieChart";

import styles from "./styles.module.css";

const karla = Karla({
	subsets: ["latin"],
	weight: ["200", "400", "600"],
});

const DynamicBalanceHistoryChart = dynamic(
	() => import("../../components/balanceElements/balanceHistoryChart"),
	{
		ssr: false,
	}
);

export default function Dashboard() {
	const [isLoading, setIsLoading] = useState(false);
	const [availableContainerResponsive, setavailableContainerResponsive] =
		useState("");
	const [
		monthlyExpenseContainerResponsive,
		setmonthlyExpenseContainerResponsive,
	] = useState("");

	useEffect(() => {
		setavailableContainerResponsive(`home__card-container--md`);
		setmonthlyExpenseContainerResponsive(
			isMobile ? `home__card-container--lg` : `home__card-container--md`
		);
	}, []);

	return (
		<>
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<section className={`${styles.home} ${karla.className}`}>
					<div className={`${styles[`home__wrapper`]}`}>
						<div className={`${styles[`home__card-container--first`]}`}>
							<div
								className={`${styles[`${availableContainerResponsive}`]}`}
								style={{ paddingRight: ".5rem" }}
							>
								<Card>
									<AvailableBalance />
								</Card>
							</div>
							<div
								className={`${styles[`${availableContainerResponsive}`]}`}
								style={{ paddingLeft: ".5rem" }}
							>
								<Card>
									<MonthlyTarget />
								</Card>
							</div>
						</div>
						<div className={`${styles[`home__card-container--lg`]}`}>
							<Card>
								<DynamicBalanceHistoryChart />
							</Card>
						</div>
						<div className={styles[`${monthlyExpenseContainerResponsive}`]}>
							{/*
							<Card>
								<MonthlyExpensesPieChart />
							</Card>
							*/}
							<Card>
								<ExpensesPieChart />
							</Card>
						</div>
					</div>
				</section>
			)}
		</>
	);
}
