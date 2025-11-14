import { Card } from "@/components/ui/Card";
import type { LucideProps } from "lucide-react";
import type { PropsWithChildren } from "react";

export interface Props {
	Icon: React.ForwardRefExoticComponent<
		Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
	>;
	title: string;
	className?: React.HTMLAttributes<HTMLDivElement>["className"];
}

export const ConfigGroup = ({
	Icon,
	title,
	className = "",
	children,
}: PropsWithChildren<Props>) => {
	return (
		<Card className={`bg-gradient-to-r from-green-50 to-white border-l-4 border-green-600 shadow-md ${className}`}>
			<div className="flex gap-3 items-center pb-4 border-b-2 border-green-200">
				<div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-md">
					<Icon size={24} className="text-white" />
				</div>

				<div>
					<h3 className="font-bold text-lg text-green-800">{title}</h3>
				</div>
			</div>

			<div className="flex flex-col gap-4 pt-4">{children}</div>
		</Card>
	);
};
