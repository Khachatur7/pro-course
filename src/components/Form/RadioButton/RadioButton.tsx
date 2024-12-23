import styles from "./RadioButton.module.css";

interface RadioButtonProps {
	name: string;
	value: string;
	label: string;
	checked: boolean;
	onChange: (value: string) => void;
}

const RadioButton: React.FC<RadioButtonProps> = ({ name, value, label, checked, onChange }) => {
	return (
		<label className={styles['radio-button']}>
			<input 
				type="radio"
				name={name}
				value={value}
				checked={checked}
				onChange={() => onChange(value)}
			/>
			<div className={styles['radio-button__box']}>
				<span className={styles['radio-button__custom']}></span>
				{label}
			</div>
		</label>
	);
};

export default RadioButton;