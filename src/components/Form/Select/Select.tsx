import React, { useState, useRef, useEffect } from "react";
import cn from "classnames";
import styles from "./Select.module.css";
import { SelectProps } from "./Select.props";

const Select: React.FC<SelectProps> = ({
    label,
    id,
    options,
    value,
    onChange,
    className,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(value || "");
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Обработка клика вне компонента
    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    const toggleDropdown = () => setIsOpen((prev) => !prev);

    const handleSelect = (option: string) => {
        setSelectedValue(option);
        onChange?.(option);
        setIsOpen(false);
    };

    return (
        <div className={cn(styles['field'], className)} ref={dropdownRef} onClick={toggleDropdown}>
            {label && (
                <label
                    htmlFor={id}
                    className={cn(styles['field__label'], {
                        [styles.active]: selectedValue,
                    })}
                >
                    {label}
                </label>
            )}

            <div
                className={cn(styles['select'], { [styles.open]: isOpen })}
            >
                <span className={styles['select__value']}>
                    {selectedValue}
                </span>
                <span className={cn(styles['select__arrow'], {[styles['rotated']]: isOpen})}>
					<img src="/select-arrow.svg" alt="" />
				</span>
            </div>

            {isOpen && (
                <div className={styles['dropdown']}>
                    {options.map((option, index) => (
                        <div
                            key={index}
                            className={cn(styles.option, {
                                [styles.selected]: option === selectedValue,
                            })}
                            onClick={(e) => {
								e.stopPropagation();
								handleSelect(option);
							}}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Select;
