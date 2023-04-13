import { Rubik } from "@next/font/google";

interface ButtonProps {
	color?: "primary" | "secondary" | "success" | "warning" | "danger";
	size?: "small" | "medium" | "large";
	label: string;
	variant?: "rounded" | "outline" | "disabled";
	textColor?: "font-light" | "font-dark";
}

const rubik = Rubik({ subsets: ["latin"] });

export const Button = ({
	color = "primary",
	size = "medium",
	label,
	textColor = "font-dark",
	variant,
	...props
}: ButtonProps) => {
	return (
		<button
			className={`
				${color} 
				${size} 
				${textColor} 
				${variant} 
				${rubik.className}
			`}
			{...props}
		>
			{label}
		</button>
	);
};
