import { HeadlingProps } from "./Headling.props";
import cn from 'classnames';
import styles from './Headling.module.css';

function Headling({ children, className, appearance, ...props}: HeadlingProps) {
	return (
		<h1 {...props} className={cn(styles['h1'], className, {
			[styles['big']]: appearance === 'big',
			[styles['small']]: appearance === 'small',
		})}>{children}</h1>
	)
}

export default Headling;
