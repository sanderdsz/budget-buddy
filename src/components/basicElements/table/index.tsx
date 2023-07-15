"use client"

import styles from "./styles.module.css";
import {api} from "@/services/api";
import Cookies from "js-cookie";
import {useEffect, useState} from "react";

interface ExpenseProps {
  value: number;
  expenseType: string;
  date: string;
  description: string | null;
}

export const Table = () => {
  const [expensesPageable, setExpensesPageable] = useState<ExpenseProps[]>([]);

  const fetchMonthlyExpenses = async () => {
    const accessToken = Cookies.get("budgetbuddy.accessToken");
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    try {
      const response = await api.get(
        `/expenses/pageable`,
        config
      );
      console.log(response.data);
      setExpensesPageable(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchMonthlyExpenses();
  }, []);

  return (
    <table>
      <thead>
      <tr>
        <th>Value</th>
        <th>Expense Type</th>
        <th>Date</th>
        <th>Description</th>
      </tr>
      </thead>
      <tbody>
      {expensesPageable.map((item, index) => (
        <tr key={index}>
          <td>{item.value}</td>
          <td>{item.expenseType}</td>
          <td>{item.date}</td>
          <td>{item.description}</td>
        </tr>
      ))}
      </tbody>
    </table>
  );
}