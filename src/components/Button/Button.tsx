import { ButtonProps } from "./Button.props";
import cn from 'classnames';
import styles from './Button.module.css';

function Button({ children, className, appearance = 'small', ...props }: ButtonProps) {
	return (
		<button className={cn(styles['button'], styles['accent'], className, {
			[styles['big']]: appearance === 'big',
			[styles['small']]: appearance === 'small',
			[styles['item']]: appearance === 'item',
		})} {...props}>
			{children}
		</button>
	)
}

export default Button;