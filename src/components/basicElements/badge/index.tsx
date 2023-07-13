import styles from "./styles.module.css"
import {ReactNode} from "react";

type LabelProps = {
  children: ReactNode;
  color?: string;
};

export const Badge = ({ children, color }: LabelProps) => {
  return (
    <div
      className={styles[`label`]}
      style={{ backgroundColor: color }}
    >
      {children}
    </div>
  )
}