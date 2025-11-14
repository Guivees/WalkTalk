interface Props {
	id: string;
	isChecked: boolean;
	onChange?: (value: boolean) => void;
}

export const SwitchInput = ({ id, isChecked, onChange = () => {} }: Props) => {
	return (
		<label
			htmlFor={id}
			className="relative w-10 h-5 rounded-3xl bg-gray-500 cursor-pointer has-checked:bg-primary after:absolute after:top-[2px] after:left-[2px] after:w-[16px] after:h-[16px] after:bg-white after:rounded-full has-checked:after:left-[calc(40px-16px-2px)] after:duration-200"
		>
			<input
				id={id}
				className="hidden"
				type="checkbox"
				checked={isChecked}
				onChange={(event) => onChange(Boolean(event.currentTarget.value))}
			/>
		</label>
	);
};
