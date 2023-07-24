"use client"

import styles from "./styles.module.css"
import {Layout} from "@/layouts";
import {Karla} from "next/font/google";
import {Card} from "@/components/layoutElements/card";
import Cookies from "js-cookie";
import {useEffect, useState} from "react";
import {useAuth, User} from "@/contexts/authContext";
import {useTheme} from "@/contexts/themeContext";
import {api} from "@/services/api";
import Skeleton from "react-loading-skeleton";
import {Avatar} from "@/components/basicElements/avatar";
import {Input} from "@/components/basicElements/input";
import {Button} from "@/components/basicElements/button";
import ConnectedUsers from "@/components/profileElements/connectedUsers";

const karla = Karla({
  subsets: ["latin"],
  weight: ["200", "400", "600"],
});

export default function Profile() {
  const auth = useAuth();
  const theme = useTheme();
  const accessToken = Cookies.get("budgetbuddy.accessToken");
  const [avatar, setAvatar] = useState("");
  const [user, setUser] = useState<User>();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    responseType: "blob",
  };

  const handleFirstName = (): void => {
    setFirstName(firstName === undefined ? "" : firstName);
  };

  const fetchAvatar = async () => {
    try {
      // @ts-ignore
      const response = await api.get("/users/avatar", config);
      const blob = new Blob([response.data], { type: "image/png" });
      const url = URL.createObjectURL(blob);
      setAvatar(url);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchAvatar();
    auth.fetchUser();
  }, []);

  return (
    <Layout>
      <section className={`${styles[`profile`]} ${karla.className}`}>
        <div className={`${styles[`profile__wrapper`]}`}>
          <div className={`${styles[`profile-header__container`]}`}>
            <span className={`${styles[`profile-header__title--first`]}`}>
              Your
            </span>{" "}
            <span className={`${styles[`profile-header__title--second`]}`}>
              Profile
            </span>
          </div>
          <div className={`${styles[`profile__container`]}`}>
            <Card>
              <div className={`${styles[`profile-info__wrapper`]}`}>
                <div className={`${styles[`profile-info__avatar`]}`}>
                  {!avatar ? (
                    <Skeleton
                      circle
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
                      style={{
                        width: 100,
                        height: 100,
                      }}
                    />
                  ) : (
                    <Avatar size={100} src={avatar} />
                  )}
                  <span className={`${styles[`profile-info__label`]}`}>
                    set avatar
                  </span>
                </div>
                <div style={{width: "100%"}}>
                  <div className={`${styles[`profile-info__container`]}`}>
                    <div>
                      {auth.user?.firstName ? (
                        <Input
                          value={firstName === "" ? auth.user.firstName : firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          disabled={true}
                        />
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
                    <div>
                      <span className={`${styles[`profile-info__label`]}`}>
                        first name
                      </span>
                    </div>
                  </div>
                  <div className={`${styles[`profile-info__container`]}`}>
                    <div>
                      {auth.user?.lastName ? (
                        <Input
                          value={lastName === "" ? auth.user.lastName : lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          disabled={true}
                        />
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
                    <div>
                      <span className={`${styles[`profile-info__label`]}`}>
                        last name
                      </span>
                    </div>
                  </div>
                  <div className={`${styles[`profile-info__container`]}`}>
                    <div>
                      {auth.user?.email ? (
                        <Input
                          value={email === "" ? auth.user.email : email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={true}
                        />
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
                    <div>
                      <span className={`${styles[`profile-info__label`]}`}>
                        e-mail
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          <div className={`${styles[`profile-header__container--second`]}`}>
            <Card>
              <div className={`${styles[`profile-password`]}`}>
                <div className={`${styles[`profile__title`]}`}>
                  <span>Change Password</span>
                </div>
                <div>
                  <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={true}
                  />
                  <span className={`${styles[`profile-info__label`]}`}>
                    password
                  </span>
                </div>
                <div>
                  <Input
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    disabled={true}
                  />
                  <span className={`${styles[`profile-info__label`]}`}>
                    confirm password
                  </span>
                </div>
              </div>
            </Card>
          </div>
          <div className={`${styles[`profile-header__container--second`]}`}>
            <Card>
              <div className={`${styles[`profile__title`]}`}>
                <span>Connected Users</span>
              </div>
              <div>
                <ConnectedUsers />
              </div>
            </Card>
          </div>
          <div className={`${styles[`profile__buttons`]}`}>
            <Button label={"update"} />
          </div>
        </div>
      </section>
    </Layout>
  )
}