import { ReactNode, useEffect } from "react";
import { Header } from "@/components/header";
import { BottonNavigation } from "@/components/bottonNavigation";
import { LoadingProvider, useLoading } from "@/contexts/loadingContext";
import Loading from "@/components/loadingSpinner";

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
			<main
				style={{
					paddingBottom: "4rem",
					paddingTop: "5rem",
				}}
			>
				{children}
			</main>
			<BottonNavigation />
		</>
	);
};
