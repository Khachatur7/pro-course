import { SelectHTMLAttributes } from "react";

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
    label: string;
    id: string;
    options: string[];
    value: string;
    onChange?: (value: string) => void;
    hideClearButton?: boolean;
	className?: string;
}
