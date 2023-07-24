"use client"

import styles from "./styles.module.css";
import Cookies from "js-cookie";
import {useEffect, useState} from "react";
import {api} from "@/services/api";
import {useTheme} from "@/contexts/themeContext";
import Skeleton from "react-loading-skeleton";
import {User} from "@/contexts/authContext";
import {Button} from "@/components/basicElements/button";

export default function ConnectedUsers() {
  const theme = useTheme();
  const [userChildren, setUserChildren] = useState<User[]>([]);
  const accessToken = Cookies.get("budgetbuddy.accessToken");
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    }
  };

  const fetchUserChildren = async () => {
    try {
      const response = await api.get("/users/connected", config);
      setUserChildren(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchUserChildren();
  }, []);

  return (
    <div>
      {userChildren.length > 0 ? (
        userChildren.map((user) => (
          <div className={`${styles[`user-children__mapper`]}`}>
            <span>{user.firstName}</span>
            <span className={`${styles[`user-children__email`]}`}>{user.email}</span>
            <Button
              label={""}
              colour={"outline"}
              icon={"trash"}
              size={"small"}
              onClick={() => null}
            />
          </div>
        ))
      ) : (
        <Skeleton
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
    </div>
  )
}