import { InputHTMLAttributes } from "react";

export interface InputLabelProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
	label: string;
	id: string;
	mask?: string;
	hideClearButton?: boolean;
	onChange?: (value: string | React.ChangeEvent<HTMLInputElement>) => void;
	type?: string;
	className?: string;
}