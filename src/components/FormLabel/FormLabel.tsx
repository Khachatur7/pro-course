import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { FormLabelComponentProps } from "./FormLabel.props";
import InputMask from 'react-input-mask';
import cn from "classnames";
import styles from "./FormLabel.module.css";

const FormLabel = forwardRef<HTMLInputElement | HTMLTextAreaElement, FormLabelComponentProps>(
	({ className, onChange, mask, label, type = "input", ...props }, ref) => {
		const localRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
		const [isFilled, setIsFilled] = useState(false);
		const [isFocused, setIsFocused] = useState(false);
		
		useImperativeHandle(ref, () => localRef.current as HTMLInputElement | HTMLTextAreaElement);

		const handleFocus = () => setIsFocused(true);

		const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			setIsFocused(false);
			setIsFilled(e.target.value !== '');
		};

		const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			if (onChange) {
				onChange(e.target.value);
			}
		}

		return (
			<div className={styles["field"]}>
				<label 
					htmlFor={props.id}
					className={cn(styles['field__label'], { [styles['active']]: isFocused || isFilled})}
				>
					{label}
				</label>
				{type === 'input' && (
					mask ? (
						<InputMask
							{...(props as React.InputHTMLAttributes<HTMLInputElement>)}
							inputRef={localRef as React.RefObject<HTMLInputElement>}
							className={cn(className, styles['input'])}
							onFocus={handleFocus}
							onBlur={handleBlur}
							onChange={handleChange}
							mask={mask}
						/>
					) : (
						<input
							{...(props as React.InputHTMLAttributes<HTMLInputElement>)}
							ref={localRef as React.RefObject<HTMLInputElement>}
							className={cn(className, styles['input'])}
							onFocus={handleFocus}
							onBlur={handleBlur}
							onChange={handleChange}
						/>
					)
				)}
				{type === 'textarea' && (
					<textarea
						{...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
						ref={localRef as React.RefObject<HTMLTextAreaElement>}
						className={cn(className, styles['textarea'])}
						onFocus={handleFocus}
						onBlur={handleBlur}
						onChange={handleChange}
					/>
				)}
			</div>
		);
	}
);

export default FormLabel;
