"use client"

import styles from "./styles.module.css";
import Cookies from "js-cookie";
import {useEffect, useState} from "react";
import {api} from "@/services/api";
import {useTheme} from "@/contexts/themeContext";
import Skeleton from "react-loading-skeleton";
import {Button} from "@/components/basicElements/button";
import {Badge} from "@/components/basicElements/badge";
import {Plugs, PlugsConnected} from "@phosphor-icons/react";
import {UserConnection} from "@/interfaces/userInterface";

export default function ConnectionsRequestsSentTable() {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [userConnections, setUsersConnections] = useState<UserConnection[]>([]);
  const accessToken = Cookies.get("budgetbuddy.accessToken");
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    }
  };

  const handleConfirmConnection = async (id: number) => {
    setIsLoading(true);
    try {
      const response = await api.post(`/users/connections/confirm/${id}`, null, config);
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
  }

  const handleCancelConnection = async (id: number) => {
    setIsLoading(true);
    try {
      const response = await api.post(`/users/connections/cancel/${id}`, null, config);
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
  }

  const fetchUserChildren = async () => {
    try {
      const response = await api.get("/users/connections", config);
      setUsersConnections(response.data);
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUserChildren();
  }, []);

  return (
    <div>
      <span className={`${styles[`connected-users__title`]}`}>
        Connections
      </span>
      <div style={{paddingTop: ".5rem"}}>
        {!isLoading ? (
          <div>
            {userConnections.length > 0 ? (
              <table className={`${styles[`connected-users__table`]}`}>
                <thead>
                <tr>
                  <th>Name</th>
                  <th>E-mail</th>
                  <th>Status</th>
                  <th></th>
                </tr>
                </thead>
                <tbody>
                {userConnections.map((user, index) => (
                  <tr key={index} className={`${styles[``]}`}>
                    <td>{user.firstName}</td>
                    <td className={`${styles[`user-children__email`]}`}>{user.email}</td>
                    {
                      // @ts-ignore
                      user.isEmailVerified ? (
                        <td>
                          <Badge color={"success"}>
                            <PlugsConnected height={20} width={20} />
                          </Badge>
                        </td>
                      ) : (
                        <td>
                          <Badge color={"warning"}>
                            <Plugs height={20} width={20} />
                          </Badge>
                        </td>
                      )
                    }
                    {
                      user.isParent && user.isEmailVerified ? (
                        <td>
                          <Button
                            label={""}
                            colour={"outline"}
                            icon={"cancel"}
                            size={"small"}
                            onClick={() => handleCancelConnection(user.id)}
                          />
                        </td>
                      ) : (
                        <>
                          {
                            user.isParent ? (
                              <td>
                                <Button
                                  label={""}
                                  colour={"outline"}
                                  icon={"check"}
                                  size={"small"}
                                  onClick={() => handleConfirmConnection(user.id)}
                                />
                              </td>
                              ) : (
                              <td>
                                <Button
                                  label={""}
                                  colour={"outline"}
                                  icon={"cancel"}
                                  size={"small"}
                                  onClick={() => handleCancelConnection(user.id)}
                                />
                              </td>
                            )
                          }
                        </>
                      )
                    }
                  </tr>
                ))}
                </tbody>
              </table>
            ) : (
              <span>There's no connection requests sent or received.</span>
            )}
          </div>
        ) : (
          <div className={`${styles[`connected-users__skeleton`]}`}>
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
          </div>
        )}
      </div>
    </div>
  )
}