import { TextareaHTMLAttributes } from "react";

export interface SlateTextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
	label: string;
	id: string;
	onChange?: (value: string) => void;
	maxLength?: number;
}