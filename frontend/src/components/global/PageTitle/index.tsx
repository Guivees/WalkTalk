import type { PropsWithChildren } from "react";

export const PageTitle = ({ children }: PropsWithChildren) => {
	return <h1 className="font-bold text-3xl">{children}</h1>;
};
