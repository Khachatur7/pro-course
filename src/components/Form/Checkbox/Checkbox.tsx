import styles from "./Checkbox.module.css";

interface CheckboxProps {
	label: string;
	checked: boolean;
	onChange: (checked: boolean) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange }) => {
	return (
		<label className={styles['checkbox']}>
			<input 
				type="checkbox"
				checked={checked}
				onChange={(e) => onChange(e.target.checked)}
			/>
			<div className={styles['checkbox__box']}>
				<span className={styles['checkbox__custom']}></span>
				{label}
			</div>
		</label>
	);
};

export default Checkbox;