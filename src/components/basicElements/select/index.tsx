import styles from "./styles.module.css";
import React, { useState } from "react";

interface Option {
	value: string;
	label: string;
}

interface CustomSelectProps {
	options: Option[];
}

export const Select = ({ options }: CustomSelectProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedOption, setSelectedOption] = useState<Option | null>(null);

	const handleToggleSelect = () => {
		setIsOpen(!isOpen);
	};

	const handleSelectOption = (option: Option) => {
		setSelectedOption(option);
		setIsOpen(false);
	};

	return (
		<div className={styles.selectContainer}>
			<div className={styles.selectedOption} onClick={handleToggleSelect}>
				{selectedOption ? selectedOption.label : "Select an option"}
			</div>
			{isOpen && (
				<ul className={styles.optionList}>
					{options.map((option) => (
						<li
							key={option.value}
							className={styles.optionItem}
							onClick={() => handleSelectOption(option)}
						>
							{option.label}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};
