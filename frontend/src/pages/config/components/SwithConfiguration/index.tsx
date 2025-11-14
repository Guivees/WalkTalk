import { SwitchInput } from "@/components/ui/SwitchInput";
import type React from "react";
import { useId, useState } from "react";

export interface Props {
	title: string;
	description: string;
	className?: React.HTMLAttributes<HTMLDivElement>["className"];
}

export const SwithConfiguration = ({ title, description }: Props) => {
	const id = useId();
	const [isSwitchEnabled, setSwitchEnabledState] = useState(false);

	return (
		<div className="flex justify-between items-center p-3 bg-white rounded-lg border border-green-200 hover:border-green-400 transition">
			<div className="flex-1">
				<h3 className="font-semibold text-gray-800">{title}</h3>
				<span className="text-sm text-gray-600">{description}</span>
			</div>

			<SwitchInput
				id={id}
				isChecked={isSwitchEnabled}
				onChange={() => setSwitchEnabledState(!isSwitchEnabled)}
			/>
		</div>
	);
};
