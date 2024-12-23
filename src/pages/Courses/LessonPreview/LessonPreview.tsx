import { Lesson } from "../../../helpers/API";
import styles from "./LessonPreview.module.css";
import Headling from "../../../components/Headling/Headling";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const LessonPreview: React.FC = () => {
	const location = useLocation();
	const navigate = useNavigate();
    const { lesson } = location.state as {lesson: Lesson};

    return (
		<div className={styles['preview']}>
			<div className={styles['preview__header']}>
				<button className={styles["back"]} onClick={() => navigate(-1)} >
					<svg
						width="16"
						height="16"
						viewBox="0 0 16 16"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
					<path
						d="M10.4603 11.4676L7.27855 7.99553L10.4603 4.52349C10.7801 4.1745 10.7801 3.61074 10.4603 3.26174C10.1405 2.91275 9.62389 2.91275 9.30407 3.26174L5.54006 7.36913C5.22024 7.71812 5.22024 8.28188 5.54006 8.63087L9.30407 12.7383C9.62389 13.0872 10.1405 13.0872 10.4603 12.7383C10.7719 12.3893 10.7801 11.8166 10.4603 11.4676Z"
						fill="#233566"
					/>
					</svg>
					<span>Назад</span>
				</button>
				<Headling>Урок «{lesson.name}»</Headling>
			</div>
			<div className={styles['preview__body']}>
				<div className={styles['preview__wrap']}>
					<h1>{lesson.name}</h1>
					<div dangerouslySetInnerHTML={{ __html: lesson.description }} className={styles['desc']} />
					{lesson.content && (
						<NavLink to={lesson.content}>
							<img src="/link-outline.svg" alt="" />
							{lesson.content}
						</NavLink>
					)}
				</div>
			</div>
		</div>
    );
};


export default LessonPreview;
