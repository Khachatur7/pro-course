import { CheckBoxItemProps } from "./CheckBoxItem.props";
import styles from './CheckBoxItem.module.css';
import { useState } from "react";

const CheckBoxItem: React.FC<CheckBoxItemProps> = ({ isChecked, onToggle, onChange }) => {
	const [internalChecked, setInternalChecked] = useState(false);

	const handleToggle = () => {
		if (onToggle) {
			onToggle();
		} else {
			setInternalChecked((prev) => {
				const newState = !prev;
				if(onChange) {
					onChange(newState);
				}
				return newState;
			});
		}
	};

	const checkedState = isChecked ?? internalChecked;
	
	return(
		<div className={styles['checkbox-item']} onClick={handleToggle}>
			<div className={`${styles['checkbox-item__label']} ${checkedState ? styles['dimmed'] : ''}`}>Студент</div>
			<div className={`${styles['checkbox-item__switch']} ${checkedState ? styles['checked'] : ''}`}>
				<input 
					type="checkbox" 
					checked={checkedState} 
					onChange={(e) => {
						handleToggle();
						if (onChange) {
							onChange(e.target.checked);
						}
					}} 
					className={styles['checkbox-item__checkbox']} />
				<div className={styles['checkbox-item__slider']}>
					<span></span>
				</div>
			</div>
			<div className={`${styles['checkbox-item__label']} ${checkedState ? '' : styles['dimmed']}`}>Школа</div>
		</div>
	)
}

export default CheckBoxItem;