"use client";

import styles from "./styles.module.css";
import { Karla } from "next/font/google";
import { Card } from "@/components/layoutElements/card";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useAuth, User } from "@/contexts/authContext";
import { useTheme } from "@/contexts/themeContext";
import { api } from "@/services/api";
import Skeleton from "react-loading-skeleton";
import { Input } from "@/components/basicElements/input";
import { Button } from "@/components/basicElements/button";
import { AvatarSelector } from "@/components/profileElements/avatarSelector";
import FormData from "form-data";
import { Divider } from "@/components/basicElements/divider";
import { isMobile } from "react-device-detect";
import ConnectionsRequestsSentTable from "@/components/profileElements/connectionsRequestsSentTable";
import { useSession } from "next-auth/react";

const karla = Karla({
	subsets: ["latin"],
	weight: ["200", "400", "600"],
});

export default function Profile() {
	const auth = useAuth();
	const theme = useTheme();
	const { data: session }: any = useSession();
	const accessToken = Cookies.get("budgetbuddy.accessToken");
	const provider = Cookies.get("budgetbuddy.provider");
	const [avatar, setAvatar] = useState("");
	const [user, setUser] = useState<User>();
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");
	const [userConnectionEmail, setUserConnectionEmail] = useState("");
	const [userConnection, setUserConnection] = useState<User>();
	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingUserConnection, setIsLoadingUserConnection] = useState(false);
	const [selectedImage, setSelectedImage] = useState<File | string | null>(
		null
	);
	const [availableContainerResponsive, setAvailableContainerResponsive] =
		useState("");
	const config = {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
		responseType: "blob",
	};

	const handleUpdate = async () => {
		const userData = {
			id: auth.user?.id,
			firstName: auth.user?.firstName,
			lastName: auth.user?.lastName,
			email: auth.user?.email,
			password: password,
			userParent: auth.user?.userParent,
			userChildren: auth.user?.userChildren,
		};
		try {
			await api.put("/users", userData, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});
		} catch (e) {
			console.log(e);
		}
	};

	const handleAvatarUpload = async (file: File) => {
		const formData = new FormData();
		formData.append("file", file);
		try {
			await api.post("/users/avatar", formData, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});
		} catch (e) {
			console.log(e);
		}
		setSelectedImage(URL.createObjectURL(file));
		setAvatar("");
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

	const fetchUser = async () => {
		setIsLoading(true);
		try {
			const response = await api.get(
				`/users/email?email=${userConnectionEmail}`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);
			setUserConnection(response.data);
		} catch (e) {
			console.log(e);
		}
		setIsLoading(false);
	};

	const handleNewUserConnection = async () => {
		setIsLoadingUserConnection(true);
		const connectionData = {
			email: userConnectionEmail,
		};
		try {
			const response = await api.post(
				`/users/connections/new`,
				connectionData,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);
			setUserConnectionEmail("");
			setUserConnection(undefined);
		} catch (e) {
			console.log(e);
		}
		setIsLoadingUserConnection(false);
	};

	useEffect(() => {
		if (!provider) {
			fetchAvatar();
		}
		auth.fetchUser();
		setAvailableContainerResponsive(
			isMobile ? `profile__container--lg` : `profile__container--md`
		);
	}, []);

	useEffect(() => {
		if (session && session.user && session.user.image !== undefined) {
			setAvatar(session.user.image);
		}
	}, [session]);

	return (
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
					<div className={`${styles[`profile__section--first`]}`}>
						<div
							className={`
              ${styles[`profile__container`]}
              ${styles[`${availableContainerResponsive}`]}
            `}
						>
							<Card>
								<div className={`${styles[`profile-info__wrapper`]}`}>
									<div className={`${styles[`profile-info__avatar`]}`}>
										{!avatar && !selectedImage ? (
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
											<>
												<AvatarSelector
													onChange={handleAvatarUpload}
													size={100}
													//@ts-ignore
													src={avatar ? avatar : selectedImage}
													disabled={provider ? true : false}
												/>
											</>
										)}
										<span className={`${styles[`profile-info__label`]}`}>
											{ provider ? null : `set avatar` }
										</span>
									</div>
									<div style={{ width: "100%" }}>
										<div className={`${styles[`profile-info__container`]}`}>
											<div>
												{auth.user?.firstName ? (
													<Input
														value={
															firstName === "" ? auth.user.firstName : firstName
														}
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
														value={
															lastName === "" ? auth.user.lastName : lastName
														}
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
						<div
							className={`
              ${styles[`profile__container`]}
              ${styles[`${availableContainerResponsive}`]}
            `}
						>
							<Card>
								<div className={`${styles[`profile-password`]}`}>
									<div className={`${styles[`profile__title`]}`}>
										<span>Change Password</span>
									</div>
									<div>
										<Input
											value={password}
											onChange={(e) => setPassword(e.target.value)}
										/>
										<span className={`${styles[`profile-info__label`]}`}>
											password
										</span>
									</div>
									<div>
										<Input
											value={passwordConfirmation}
											onChange={(e) => setPasswordConfirmation(e.target.value)}
										/>
										<span className={`${styles[`profile-info__label`]}`}>
											confirm password
										</span>
									</div>
								</div>
								<div className={`${styles[`profile__buttons`]}`}>
									<Button label={"update"} onClick={handleUpdate} />
								</div>
							</Card>
						</div>
					</div>
					<div className={`${styles[`profile-header__container--second`]}`}>
						<Card>
							<div className={`${styles[`profile__title`]}`}>
								<span>Your Network</span>
							</div>
							<div className={`${styles[`profile__container--small`]}`}>
								<div className={`${styles[`profile-connection__container`]}`}>
									<div style={{ width: "100%" }}>
										<Input
											value={userConnectionEmail}
											onChange={(e) => setUserConnectionEmail(e.target.value)}
										/>
										<span className={`${styles[`profile-info__label`]}`}>
											e-mail
										</span>
									</div>
									<Button label={"search"} onClick={fetchUser} />
								</div>
								{isLoading ? (
									<div className={`${styles[`profile__container`]}`}>
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
								) : (
									<div
										className={`${styles[`profile__container--connection`]}`}
									>
										{userConnection ? (
											<div className={`${styles[`profile-connection__list`]}`}>
												<span>
													{userConnection.firstName} {userConnection.lastName}
												</span>
												<Button
													label={"connect"}
													colour={"success"}
													onClick={handleNewUserConnection}
													isLoading={isLoadingUserConnection}
												/>
											</div>
										) : null}
									</div>
								)}
							</div>
							<div>
								<Divider />
							</div>
							<div className={`${styles[`profile__container--small`]}`}>
								{/*
                 <span className={`${styles[`profile-connection__title`]}`}>
                  Connection Requests
                </span>
                */}
								<div>
									<ConnectionsRequestsSentTable />
								</div>
							</div>
						</Card>
					</div>
				</div>
			</section>
	);
}
