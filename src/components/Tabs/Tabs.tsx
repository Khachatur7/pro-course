import styles from "./Tabs.module.css";
import cn from "classnames";

interface TabsProps {
	tabs: string[];
	activeTab: number;
	onTabClick: (index: number) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabClick }) => {
	return (
		<div className={styles['tabs']}>
			{tabs.map((tab, i) => (
				<button
					key={i}
					className={cn(styles['tab'], { [styles['active']]: activeTab === i})}
					onClick={() => onTabClick(i)}
				>
					{tab}
				</button>
			))}
		</div>
	);
};

export default Tabs;