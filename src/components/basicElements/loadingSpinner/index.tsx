import styles from "./styles.module.css";

type LoadingSpinnerProps = {
	height?: number;
	width?: number;
	borderWidth?: number;
};

export default function LoadingSpinner({
	height = 60,
	width = 60,
	borderWidth = 8,
}: LoadingSpinnerProps) {
	return (
		<div className={styles[`loader-container`]}>
			<div
				className={styles.spinner}
				style={{
					width: width,
					height: height,
					borderWidth: borderWidth,
				}}
			></div>
		</div>
	);
}
