import styles from "./styles.module.css";

export default function LoadingSpinner() {
	return (
		<div className={styles[`loader-container`]}>
			<div className={styles.spinner}></div>
		</div>
	);
}
