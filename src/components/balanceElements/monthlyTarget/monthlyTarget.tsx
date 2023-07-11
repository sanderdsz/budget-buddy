"use client"

import Skeleton from "react-loading-skeleton";
import {ProgressBar} from "@/components/basicElements/progressBar";
import {useTheme} from "@/contexts/themeContext";
import {useEffect, useState} from "react";
import {api} from "@/services/api";
import Cookies from "js-cookie";

import styles from "./styles.module.css";

export const MonthlyTarget = () => {
  const theme = useTheme();
  const currentDate = new Date();
  const [expense, setExpense] = useState("");

  const currencyFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const fetchBalance = async () => {
    const accessToken = Cookies.get("budgetbuddy.accessToken");
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    try {
      const response = await api.get(
        `/balances?year=${currentDate.getFullYear()}&month=${
          currentDate.getMonth() + 1
        }`,
        config
      );
      setExpense(currencyFormatter.format(response.data.expenses));
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  return (
    <div className={styles[`monthly-target__container`]}>
      {/*
      <span className={styles[`home-monthly__target-current`]}>
        {expense ? (
          <>{expense}</>
        ) : (
          <Skeleton
            width={"75px"}
            baseColor={
              theme.activeTheme === "dark"
                ? "var(--gray-02)"
                : "var(--white-05)"
            }
            highlightColor={
              theme.activeTheme === "dark"
                ? "var(--gray-03)"
                : "var(--white-03)"
            }
          />
        )}
      </span>
      */}
      <div className={styles[`monthly-target__wrapper`]}>
        <div className={styles[`monthly-target__title`]}>
          <span className={styles[`monthly-target__title--first`]}>
            Target
          </span>
          <span className={styles[`monthly-target__title--second`]}>
            by month
          </span>
        </div>
        <div className={styles[`monthly-target__amount`]}>
          <span>85%</span>
        </div>
      </div>
      <ProgressBar value={80} />
    </div>
  )
}