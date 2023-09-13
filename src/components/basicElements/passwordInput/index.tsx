import React, {useState} from "react";

import styles from "./styles.module.css";
import { Karla } from "next/font/google";
import {Eye, EyeClosed} from "@phosphor-icons/react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const karla = Karla({
  subsets: ["latin"],
  weight: ["400"],
});

export const PasswordInput = ({ ...props }: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword((showPassword) => !showPassword);
  };

  return (
    <div className={`${styles[`password-input`]}`}>
      <input
        className={`${karla.className} ${styles[`password-input__field`]}`}
        type={showPassword ? "text" : "password"}
        {...props}
      />
      <button
        onClick={togglePassword}
        className={`${styles[`password-input__button`]}`}
      >
        { showPassword ? (
          <Eye height={20} width={20} />
        ) : (
          <EyeClosed height={20} width={20} />
        )}
      </button>
    </div>
  );
};
