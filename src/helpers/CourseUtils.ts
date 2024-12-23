import { Course } from '../hooks/useFormModal';
import { createCourse } from './API';

export const handleCreateCourse = async (
	newTitle: string,
	newDescription: string,
	setCourses?: React.Dispatch<React.SetStateAction<Course[]>>,
	onSuccess?: (newCourse: Course) => void,
	onError?: (message: string) => void
): Promise<void> => {
	try {
		const newCourse: Course = await createCourse({
			name: newTitle,
			description: newDescription,
		});
	
		if (newCourse) {
			setCourses?.((prevCourses) => [...prevCourses, newCourse]);
			onSuccess?.(newCourse); // Передаём созданный курс в колбэк
		} else {
			throw new Error('Не удалось создать курс.');
		}
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка';
		onError?.(errorMessage);
	}
};