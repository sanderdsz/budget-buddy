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
		case "GROCERY":
			return <Basket color={"#7D9768"} height={25} width={25} />;
		case "MEALS":
			return <Hamburger color={"#EBCB8B"} height={25} width={25} />;
		case "SHOPPING":
			return <ShoppingBag color={"#c8ccd2"} height={25} width={25} />;
		case "HOUSING":
			return <Buildings color={"#88c0d0"} height={25} width={25} />;
		case "CAR":
			return <Car color={"#BF616A"} height={25} width={25} />;
		case "PHARMACY":
			return <Pill color={"#5E81AC"} height={25} width={25} />;
	}
};
