import { HTMLAttributes, ReactNode } from "react";


export interface HeadlingProps extends HTMLAttributes<HTMLHeadElement> {
	children: ReactNode;
	className?: string;
	appearance?: 'big' | 'small';
}