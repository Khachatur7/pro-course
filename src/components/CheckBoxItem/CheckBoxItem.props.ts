export interface CheckBoxItemProps {
	isChecked?: boolean;
	onToggle?: () => void;
	onChange: (checked: boolean) => void;
}