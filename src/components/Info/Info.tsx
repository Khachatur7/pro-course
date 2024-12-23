import styles from "./Info.module.css";

interface InfoProps {
	description: string;
}

const Info: React.FC<InfoProps> = ({ description }) => {
	return (
		<div className={styles['info']}>
			<div className={styles['info__icon']}>
				<img src="/info.svg" alt="" />
			</div>
			<div className={styles['info__desc']}>{description}</div>
		</div>
	);
};

export default Info;