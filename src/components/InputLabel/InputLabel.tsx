import React, { forwardRef, useRef, useState, useImperativeHandle } from "react";
import InputMask from "react-input-mask";
import cn from "classnames";
import styles from "./InputLabel.module.css";
import { InputLabelProps } from "./InputLabel.props";

const InputLabel = forwardRef<HTMLInputElement, InputLabelProps>(
  ({ label, id, mask, onChange, className, value: controlledValue, hideClearButton = false, ...props }, ref) => {
    const localRef = useRef<HTMLInputElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    useImperativeHandle(ref, () => localRef.current as HTMLInputElement);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => {
		setIsFocused(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (onChange) {
			onChange(e.target.value);
		}
    };

    const handleClear = () => {
		if (onChange) {
			onChange("");
		}
		if (localRef.current) {
			localRef.current.focus();
		}
    };

    return (
		<div className={styles.field}>
			<label
				htmlFor={id}
				className={cn(styles.field__label, { [styles.active]: isFocused || controlledValue })}
			>
				{label}
			</label>
			{mask ? (
				<InputMask
					{...props}
					mask={mask}
					value={controlledValue}
					inputRef={localRef}
					className={cn(className, styles.input)}
					onFocus={handleFocus}
					onBlur={handleBlur}
					onChange={handleChange}
				/>
				) : (
				<input
					{...props}
					id={id}
					value={controlledValue}
					ref={localRef}
					className={cn(className, styles.input)}
					onFocus={handleFocus}
					onBlur={handleBlur}
					onChange={handleChange}
				/>
				)}
				{!hideClearButton && (
				<button
					type="button"
					className={cn(styles["clear-button"], { [styles["visible"]]: controlledValue })}
					onClick={handleClear}
					aria-label="Очистить поле"
				>
					<svg
					width="25"
					height="24"
					viewBox="0 0 25 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					>
					<path
						d="M10.5303 8.96967C10.2374 8.67678 9.76256 8.67678 9.46967 8.96967C9.17678 9.26256 9.17678 9.73744 9.46967 10.0303L11.4393 12L9.46969 13.9697C9.1768 14.2626 9.1768 14.7374 9.46969 15.0303C9.76258 15.3232 10.2375 15.3232 10.5303 15.0303L12.5 13.0607L14.4696 15.0303C14.7625 15.3232 15.2374 15.3232 15.5303 15.0303C15.8232 14.7374 15.8232 14.2625 15.5303 13.9697L13.5606 12L15.5303 10.0303C15.8232 9.73746 15.8232 9.26258 15.5303 8.96969C15.2374 8.6768 14.7625 8.6768 14.4696 8.96969L12.5 10.9394L10.5303 8.96967Z"
						fill="black"
						fillOpacity="0.2"
					/>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M12.5574 1.25H12.4426C10.1342 1.24999 8.32519 1.24998 6.91371 1.43975C5.46897 1.63399 4.32895 2.03933 3.43414 2.93414C2.53933 3.82895 2.13399 4.96897 1.93975 6.41371C1.74998 7.82519 1.74999 9.63422 1.75 11.9426V12.0574C1.74999 14.3658 1.74998 16.1748 1.93975 17.5863C2.13399 19.031 2.53933 20.1711 3.43414 21.0659C4.32895 21.9607 5.46897 22.366 6.91371 22.5603C8.32519 22.75 10.1342 22.75 12.4426 22.75H12.5574C14.8658 22.75 16.6748 22.75 18.0863 22.5603C19.531 22.366 20.6711 21.9607 21.5659 21.0659C22.4607 20.1711 22.866 19.031 23.0603 17.5863C23.25 16.1748 23.25 14.3658 23.25 12.0574V11.9426C23.25 9.63423 23.25 7.82519 23.0603 6.41371C22.866 4.96897 22.4607 3.82895 21.5659 2.93414C20.6711 2.03933 19.531 1.63399 18.0863 1.43975C16.6748 1.24998 14.8658 1.24999 12.5574 1.25ZM4.4948 3.9948C5.06445 3.42514 5.83517 3.09825 7.11358 2.92637C8.41356 2.75159 10.1218 2.75 12.5 2.75C14.8782 2.75 16.5864 2.75159 17.8864 2.92637C19.1648 3.09825 19.9355 3.42514 20.5052 3.9948C21.0749 4.56445 21.4018 5.33517 21.5736 6.61358C21.7484 7.91356 21.75 9.62177 21.75 12C21.75 14.3782 21.7484 16.0864 21.5736 17.3864C21.4018 18.6648 21.0749 19.4355 20.5052 20.0052C19.9355 20.5749 19.1648 20.9018 17.8864 21.0736C16.5864 21.2484 14.8782 21.25 12.5 21.25C10.1218 21.25 8.41356 21.2484 7.11358 21.0736C5.83517 20.9018 5.06445 20.5749 4.4948 20.0052C3.92514 19.4355 3.59825 18.6648 3.42637 17.3864C3.25159 16.0864 3.25 14.3782 3.25 12C3.25 9.62177 3.25159 7.91356 3.42637 6.61358C3.59825 5.33517 3.92514 4.56445 4.4948 3.9948Z"
						fill="black"
						fillOpacity="0.2"
					/>
					</svg>
				</button>
			)}
		</div>
		);
	}
);

export default InputLabel;
