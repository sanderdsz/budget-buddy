export type UserConnection = {
	id: number;
	email: string;
	firstName?: string;
	lastName?: string;
	isParent: boolean;
	isEmailVerified: boolean;
};
