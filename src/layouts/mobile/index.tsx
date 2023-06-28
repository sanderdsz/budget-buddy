import { ReactNode } from "react";
import { Header } from "@/components/header";
import { BottonNavigation } from "@/components/bottonNavigation";

import styles from "./styles.module.css";

interface MobileLayoutProps {
	children: ReactNode;
}

/*
 * TODO: trick to activate scroll if there's any info
 *  between last card and bottom nav, refactor it.
 */

export const MobileLayout = ({ children }: MobileLayoutProps) => {
	return (
		<>
			<Header />
			<main className={styles.layout}>{children}</main>
			<BottonNavigation />
		</>
	);
};
