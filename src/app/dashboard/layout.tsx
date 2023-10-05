"use client";

import { Header } from "@/components/layoutElements/header";
import { BottonNavigation } from "@/components/layoutElements/bottonNavigation";
import {Suspense, useEffect, useState} from "react";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
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
		<section>
			<nav>
				<Header />
			</nav>
			<main style={{
				marginTop: "5.1rem",
				marginBottom: "5.5rem",
				overflow: "hidden"
			}}>
				<Suspense>
					{children}
				</Suspense>
			</main>
			<footer>
				<BottonNavigation />
			</footer>
		</section>
	);
}
