import { FC } from "react";
import styles from "./Checkbox.module.css";
import cn from "classnames";

interface ICheckbox {
  active?:boolean
  label?: string;
  onChange: () => void;
  className?: string;
	children?: React.ReactNode;
}

const Checkbox: FC<ICheckbox> = ({ active,label, onChange, className,children }) => {
  return (
    <label className={cn(styles["checkbox-container"], className)}>
      <input type="checkbox" onChange={onChange} checked={active}/>
      <span className={styles["checkmark"]}>
        <svg
          width="18px"
          viewBox="0 -0.5 25 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.5 12.5L10.167 17L19.5 8"
            stroke="none"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {label}
      {children}
    </label>
  );
};

export default Checkbox;
