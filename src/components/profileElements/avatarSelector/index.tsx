import { Avatar } from "@/components/basicElements/avatar";
import React, { useRef } from "react";
import styles from "./styles.module.css";

interface AvatarSelectorProps {
	src: string;
	size: number;
	onChange: (file: File) => void;
	disabled?: boolean;
}

export const AvatarSelector = ({
	onChange,
	src,
	size,
	disabled
}: AvatarSelectorProps) => {
	const inputRef = useRef<HTMLInputElement>(null);

	const handleButtonClick = () => {
		if (inputRef.current) {
			inputRef.current.click();
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			onChange(file);
		}
	};

	return (
		<div>
			<button
				onClick={handleButtonClick}
				className={`${styles[`avatar-selector__button`]}`}
				disabled={disabled}
			>
				<Avatar size={size} src={src} />
			</button>
			<input
				type="file"
				ref={inputRef}
				accept="image/*"
				style={{ display: "none" }}
				onChange={handleFileChange}
				disabled={disabled}
			/>
		</div>
	);
};
