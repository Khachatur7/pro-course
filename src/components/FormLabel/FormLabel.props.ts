import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;
type TextareaProps = TextareaHTMLAttributes<HTMLAreaElement>;

export interface FormLabelProps {
	label: string;
	id: string;
	isvalid?: boolean;
	mask?: string;
	type?: 'input' | 'textarea';
	onChange?: (value: string) => void;
}

export type FormLabelComponentProps = FormLabelProps & (InputProps | TextareaProps);
