import React, { forwardRef, useRef, useState, useImperativeHandle, useEffect } from "react";
import cn from "classnames";
import styles from "./TextareaLabel.module.css";
import { TextareaLabelProps } from "./TextareaLabel.props";

const TextareaLabel = forwardRef<HTMLTextAreaElement, TextareaLabelProps>(
	({ label, id, onChange, className, value: controlledValue, maxLength, ...props }, ref) => {
		const localRef = useRef<HTMLTextAreaElement>(null);
		const [value, setValue] = useState(controlledValue || "");
		const [isFocused, setIsFocused] = useState(false);
		const [isFilled, setIsFilled] = useState(false);

		useEffect(() => {
			if(value !== "") {
				setIsFilled(true)
			}
		}, [value]);

		useEffect(() => {
			setValue(controlledValue || '');
		}, [controlledValue]);

		useImperativeHandle(ref, () => localRef.current as HTMLTextAreaElement);

		const handleFocus = () => setIsFocused(true);
		const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
			setIsFocused(false);
			setIsFilled(e.target.value !== "");
		};
		const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
			const newValue = e.target.value;
			if(!maxLength || newValue.length <= maxLength) {
				setValue(newValue);
				if (onChange) {
					onChange(newValue);
				}
			}
		};

		return (
		<div className={styles.field}>
			<label
				htmlFor={id}
				className={cn(styles.field__label, { [styles.active]: isFocused || isFilled })}
			>
				{label}
			</label>
			<textarea
				{...props}
				id={id}
				value={value}
				ref={localRef}
				className={cn(className, styles['textarea'])}
				onFocus={handleFocus}
				onBlur={handleBlur}
				onChange={handleChange}
			/>
			<div className={styles['counter']}>
				{(value as string).length}
				<span>{maxLength && ` / ${maxLength}`}</span>
			</div>
		</div>
		);
	}
);

export default TextareaLabel;
