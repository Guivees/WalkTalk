import type { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
	className?: string;
}>;

export const Card = ({ children, className }: Props) => {
	return (
		<div
			className={`w-full rounded-2xl border-2 border-gray-200 bg-white p-5 ${className}`}
		>
			{children}
		</div>
	);
};
