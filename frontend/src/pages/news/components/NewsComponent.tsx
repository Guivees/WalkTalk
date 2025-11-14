import { Card } from "@/components/ui/Card";
import type { LucideProps } from "lucide-react";
import type React from "react";

export interface Props {
	Icon: React.ForwardRefExoticComponent<
		Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
	>;
	title: string;
	description: string;
	className?: React.HTMLAttributes<HTMLDivElement>["className"];
}

export const NewsComponent = ({
	Icon,
	title,
	description,
	className,
}: Props) => {
	return (
		<Card className={`flex gap-5 bg-gradient-to-r from-green-50 to-white border-l-4 border-green-600 shadow-md hover:shadow-lg transition ${className}`}>
			<div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex-shrink-0 shadow-md">
				<Icon className="text-white" size={28} />
			</div>

			<div className="flex-1 py-2">
				<h3 className="font-bold text-lg text-green-800 mb-2">{title}</h3>

				<p className="text-gray-700 leading-relaxed text-sm">{description}</p>
			</div>
		</Card>
	);
};
