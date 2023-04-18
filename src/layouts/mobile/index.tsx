import { ReactNode } from "react";
import { Header } from "@/components/header";
import { BottonNavigation } from "@/components/bottonNavigation";

interface MobileLayoutProps {
	children: ReactNode;
}

export const MobileLayout = ({ children }: MobileLayoutProps) => {
	return (
		<>
			<Header />
			<main>{children}</main>
			<BottonNavigation />
		</>
	);
};
