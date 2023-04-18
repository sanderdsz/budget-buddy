import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { MobileLayout } from "@/layouts/mobile";
import { Karla } from "next/font/google";

import styles from "./styles.module.css";
import { useTheme } from "@/contexts/themeContext";

const karla = Karla({
	subsets: ["latin"],
	weight: ["200", "400", "600"],
});

const data = [
	{
		name: "0W",
		uv: 4000,
		pv: 2400,
		amt: 2400,
	},
	{
		name: "1W",
		uv: 3000,
		pv: 1398,
		amt: 2210,
	},
	{
		name: "2W",
		uv: 2000,
		pv: 9800,
		amt: 2290,
	},
	{
		name: "3W",
		uv: 2780,
		pv: 3908,
		amt: 2000,
	},
	{
		name: "4W",
		uv: 1890,
		pv: 4800,
		amt: 2181,
	},
	{
		name: "",
		uv: 1890,
		pv: 4800,
		amt: 2181,
	},
];

export default function Home() {
	const theme = useTheme();
	return (
		<>
			<MobileLayout>
				<section className={`${styles.home} ${karla.className}`}>
					<div className={styles[`home-chart`]}>
						<div className={styles[`home-chart__container`]}>
							<div className={styles[`home-chart__title`]}>
								<span className={styles[`home-chart__title--first`]}>
									Available
								</span>{" "}
								<span className={styles[`home-chart__title--second`]}>
									Balance
								</span>
							</div>
							<span className={styles[`home-chart__balance`]}>R$ 1.200,00</span>
						</div>
						<div className={styles[`home-chart__graph`]}>
							<ResponsiveContainer width="100%" height="100%">
								<LineChart width={300} height={100} data={data}>
									<Tooltip />
									{theme.activeTheme === "light" ? (
										<>
											<Line
												type="monotone"
												dataKey="pv"
												stroke="#4c566a"
												strokeWidth={2}
											/>
											<XAxis
												dataKey="name"
												stroke="#4c566a"
												axisLine={false}
												tickLine={false}
											/>
										</>
									) : (
										<>
											<Line
												type="monotone"
												dataKey="pv"
												stroke="#c8ccd2"
												strokeWidth={2}
											/>
											<XAxis
												dataKey="name"
												stroke="#c8ccd2"
												axisLine={false}
												tickLine={false}
											/>
										</>
									)}
								</LineChart>
							</ResponsiveContainer>
						</div>
					</div>
				</section>
			</MobileLayout>
		</>
	);
}
