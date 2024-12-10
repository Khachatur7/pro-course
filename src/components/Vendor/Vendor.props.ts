import { HTMLAttributes, ReactNode } from "react";


export interface VendorProps extends HTMLAttributes<HTMLHeadElement> {
	children: ReactNode;
	className?: string;
}