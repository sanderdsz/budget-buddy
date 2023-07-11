import styles from "./styles.module.css";

export interface ProgressBarProps {
	value: number;
}

export const ProgressBar = ({ value }: ProgressBarProps) => {
	return (
		<progress className={styles.progress} value={value} max={100}></progress>
	);
};
