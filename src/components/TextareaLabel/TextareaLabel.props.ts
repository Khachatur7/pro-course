import { TextareaHTMLAttributes } from "react";

export interface TextareaLabelProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
	label: string;
	id: string;
	onChange?: (value: string | React.ChangeEvent<HTMLInputElement>) => void;
}
