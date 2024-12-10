import { useEffect, useState } from "react";
import { CourseData, getCourseById } from "../helpers/API";

const useCourseData = (courseId: string | undefined) => {
    const [courseData, setCourseData] = useState<CourseData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
	
	useEffect(() => {
        const fetchCourseData = async () => {
            if (!courseId) return;

            try {
                setLoading(true);
                const data = await getCourseById(courseId);
                setCourseData(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Неизвестная ошибка");
            } finally {
                setLoading(false);
            }
        };

        fetchCourseData();
    }, [courseId]);

	return { courseData, loading, error, setCourseData };
};

export default useCourseData;