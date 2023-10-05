"use client";

import styles from "./styles.module.css";
import { Karla } from "next/font/google";
import { Button } from "@/components/basicElements/button";
import { useRouter } from "next/navigation";
import { Card } from "@/components/layoutElements/card";
import { IncomesHistoryTable } from "@/components/incomesElements/incomesHistoryTable";

const karla = Karla({
	subsets: ["latin"],
	weight: ["200", "400", "600"],
});

export default function Incomes() {
	const router = useRouter();

	return (
		<section className={`${styles[`incomes`]} ${karla.className}`}>
			<div className={styles[`incomes__wrapper`]}>
				<div className={styles[`incomes-header_container`]}>
					<div>
						<span className={styles[`incomes-header__title--first`]}>
							Your
						</span>{" "}
						<span className={styles[`incomes-header__title--second`]}>
							Incomes
						</span>
					</div>
					<Button
						height={2}
						label={"+ income"}
						colour={"primary"}
						onClick={() => router.push("/dashboard/incomes/new")}
					/>
				</div>
				<div className={styles[`incomes_container`]}>
					<Card>
						<IncomesHistoryTable />
					</Card>
				</div>
			</div>
		</section>
	);
}
