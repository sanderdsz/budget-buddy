import {
	Basket,
	Buildings,
	Car,
	Hamburger,
	Pill,
	ShoppingBag,
} from "@phosphor-icons/react";

export const iconsFormatter = (icon: string) => {
	switch (icon) {
		case "grocery":
			return <Basket color={"#7D9768"} height={25} width={25} />;
		case "snacks":
			return <Hamburger color={"#EBCB8B"} height={25} width={25} />;
		case "shopping":
			return <ShoppingBag color={"#c8ccd2"} height={25} width={25} />;
		case "housing":
			return <Buildings color={"#88c0d0"} height={25} width={25} />;
		case "car":
			return <Car color={"#BF616A"} height={25} width={25} />;
		case "pharmacy":
			return <Pill color={"#5E81AC"} height={25} width={25} />;
	}
};
