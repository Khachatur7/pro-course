import { SearchProps } from "./Search.props";
import cn from "classnames";
import { forwardRef } from "react";
import styles from './Search.module.css';

const Search = forwardRef<HTMLInputElement, SearchProps>(function Input({ className, isValid = true, ...props}, ref) {
	return (
		<div className={styles['search']}>
			<input {...props} ref={ref} className={cn(className, styles['input'], {
				[styles['invalid']] : !isValid
			})} />
		</div>
	);
});

export default Search;