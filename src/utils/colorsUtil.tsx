export const colorsFormatter = (icon: string) => {
	switch (icon) {
		case "GROCERY":
			return "#7D9768";
		case "MEALS":
			return "#EBCB8B";
		case "SHOPPING":
			return "#c8ccd2";
		case "HOUSING":
			return "#88c0d0";
		case "CAR":
			return "#BF616A";
		case "PHARMACY":
			return "#5E81AC";
	}
};

export const colorMapper = (label: string) => {
	switch (label.toUpperCase()) {
		case "GROCERY":
			return "#7DA5A4";
		case "MEALS":
			return "#bf616a";
		case "SHOPPING":
			return "#DEA97E";
		case "HOUSING":
			return "#87A1C1";
		case "CAR":
			return "#AC9970";
		case "PHARMACY":
			return "#90AB7A";
		default:
			return "#c8ccd2";
	}
};
