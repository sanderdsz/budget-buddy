import { ReactNode, useEffect, useState } from "react";
import { Header } from "@/components/layoutElements/header";
import { BottonNavigation } from "@/components/layoutElements/bottonNavigation";

import styles from "./styles.module.css";

interface LayoutProps {
	children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const handleResize = () => {
			const breakpoint = 768;
			const isMobile = window.innerWidth < breakpoint;
			setIsMobile(isMobile);
		};
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return (
		<>
			<Header />
			<main className={styles[`layout`]}>{children}</main>
			<BottonNavigation />
		</>
	);
};
