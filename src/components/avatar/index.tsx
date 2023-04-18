import React from "react";

import styles from "./styles.module.css";

interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
	size: number;
}

export const Avatar = ({ size, ...props }: AvatarProps) => {
	return (
		<img width={size} height={size} className={styles.avatar} {...props} />
	);
};
