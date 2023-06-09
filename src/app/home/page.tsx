"use client";

import {
	Cell,
	LineChart,
	Line,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	Pie,
	PieChart,
} from "recharts";
import {useEffect, useState} from "react";
import { MobileLayout } from "@/layouts/mobile";
import { Karla } from "next/font/google";
import { useTheme } from "@/contexts/themeContext";
import { iconsFormatter } from "@/utils/iconsFormatter";
import { colorsFormatter } from "@/utils/colorsFormatter";
import { ProgressBar } from "@/components/progressBar";
import { Button } from "@/components/button";
import { api } from "@/services/api";

import styles from "./styles.module.css";
import {useAuth} from "@/contexts/authContext";

type LabelProps = {
	cx: number;
	cy: number;
	midAngle: number;
	innerRadius: number;
	outerRadius: number;
	percent: number;
	index: number;
};

const karla = Karla({
	subsets: ["latin"],
	weight: ["200", "400", "600"],
});

const data01 = [
	{
		week: "1",
		amount: 2210,
	},
	{
		week: "2",
		amount: 6800,
	},
	{
		week: "3",
		amount: 4320,
	},
	{
		week: "4",
		amount: 0,
	},
];
const data02 = [
	{ type: "grocery", value: 2400 },
	{ type: "snacks", value: 4567 },
	{ type: "shopping", value: 1398 },
	{ type: "housing", value: 9800 },
	{ type: "car", value: 3908 },
	{ type: "pharmacy", value: 4800 },
];
const expenses = [
	{ type: "grocery", color: "#7D9768" },
	{ type: "snacks", color: "#EBCB8B" },
	{ type: "shopping", color: "#c8ccd2" },
	{ type: "housing", color: "#88c0d0" },
	{ type: "car", color: "#A32727" },
	{ type: "pharmacy", color: "#5E81AC" },
];
const COLORS = [
	"#7D9768",
	"#A32727",
	"#5E81AC",
	"#88c0d0",
	"#c8ccd2",
	"#EBCB8B",
];
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
	cx,
	cy,
	innerRadius,
	outerRadius,
	percent,
	midAngle,
	index,
}: LabelProps) => {
	const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
	const x = cx + radius * Math.cos(-midAngle * RADIAN);
	const y = cy + radius * Math.sin(-midAngle * RADIAN);
	return (
		<text
			x={x}
			y={y}
			fill="white"
			textAnchor={x > cx ? "start" : "end"}
			dominantBaseline="central"
		>
			{`${(percent * 100).toFixed(0)}%`}
		</text>
	);
};
const monthFormatter = new Intl.DateTimeFormat("en-US", {
	month: "long",
}).format(new Date());
const currencyFormatter = new Intl.NumberFormat("pt-BR", {
	style: "currency",
	currency: "BRL",
});

export default function Home() {
	const auth = useAuth();
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (!auth.user?.name) {
			setIsLoading(true);
			console.log('null')
		}
	}, [])

	const theme = useTheme();
	return (
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
						<div className={styles[`home-chart__graph-buttons`]}>
							<Button label={"Week"} />
							<Button label={"Month"} color={"secondary"} />
						</div>
						<ResponsiveContainer width="100%" height="100%">
							<LineChart width={300} height={100} data={data01}>
								<Tooltip
									contentStyle={{ color: "#232730" }}
									itemStyle={{ color: "#232730" }}
								/>
								{theme.activeTheme === "light" ? (
									<>
										<Line
											type="monotone"
											dataKey="amount"
											stroke="#4c566a"
											strokeWidth={2}
										/>
										<XAxis
											dataKey="week"
											stroke="#4c566a"
											axisLine={false}
											tickLine={false}
										/>
									</>
								) : (
									<>
										<Line
											type="monotone"
											dataKey="amount"
											stroke="#c8ccd2"
											strokeWidth={2}
										/>
										<XAxis
											dataKey="week"
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
				<div className={styles[`home-monthly`]}>
					<div className={styles[`home-monthly__title-container`]}>
						<div className={styles[`home-monthly__title`]}>
							<span className={styles[`home-monthly__title--first`]}>
								{monthFormatter}
							</span>{" "}
							<span className={styles[`home-monthly__title--second`]}>
								Spending
							</span>
						</div>
						<span className={styles[`home-monthly__balance`]}>
							You have spent R$ 1.000,00 so far.
						</span>
					</div>
					<div className={styles[`home-monthly__graph-container`]}>
						<div className={styles[`home-monthly__graph`]}>
							<ResponsiveContainer width="100%" height="100%">
								<PieChart width={100} height={200}>
									<Pie
										dataKey="value"
										isAnimationActive={false}
										data={data02}
										cx="50%"
										cy="50%"
										outerRadius={70}
										fill="#8884d8"
										label={renderCustomizedLabel}
										labelLine={false}
									>
										{data02.map((entry, index) => (
											<Cell
												name={entry.type}
												key={`cell-${index}`}
												fill={colorsFormatter(entry.type)}
											/>
										))}
									</Pie>
									<Tooltip />
								</PieChart>
							</ResponsiveContainer>
						</div>
						<div>
							{data02.map((entry, index) => (
								<div
									key={index}
									className={styles[`home-monthly__graph-description`]}
								>
									{iconsFormatter(entry.type)}
									<span
										className={styles[`home-monthly__graph-description--icons`]}
										style={{
											color: colorsFormatter(entry.type),
										}}
									>
										{currencyFormatter.format(entry.value)}
									</span>
								</div>
							))}
						</div>
					</div>
					<div className={styles[`home-monthly__target`]}>
						<div className={styles[`home-monthly__target-container`]}>
							<span className={styles[`home-monthly__target-current`]}>
								R$ 1.000,00
							</span>
							<span className={styles[`home-monthly__target-maximum`]}>
								Target R$ 3.000,00
							</span>
						</div>
						<ProgressBar value={80} />
					</div>
				</div>
			</section>
		</MobileLayout>
	);
}
