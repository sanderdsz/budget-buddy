import React from "react";
import {
  Coins,
  PiggyBank,
} from "@phosphor-icons/react";
import { Rubik } from "next/font/google";
import { colorMapper } from "@/utils/colorsUtil";

import styles from "./styles.module.css";

interface incomeTypeButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  height: number;
  width: number;
  selected: boolean;
}

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "600"],
});


export const Index = ({
  height,
  label,
  width,
  selected = false,
  ...props
}: incomeTypeButtonProps) => {
  const incomeTypeMapper = (label: string, height: number) => {
    switch (label.toUpperCase()) {
      case "SALARY":
        return <Coins height={height} width={height} />;
      case "INVESTMENT":
        return <PiggyBank height={height} width={height} />;
    }
  };
  const buttonColor = selected ? colorMapper(label) : undefined;

  return (
    <button
      className={`${styles[`income-button`]} ${rubik.className}`}
      style={{ width: width, backgroundColor: buttonColor }}
      {...props}
    >
      <div>{incomeTypeMapper(label, height)}</div>
      <span>{label}</span>
    </button>
  );
};
