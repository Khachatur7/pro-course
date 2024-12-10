import { Course } from "../hooks/useFormModal";

export const API_URL = 'https://ce18026.tw1.ru/api/';

export function getApiUrl(endpoint: string) {
	return `${API_URL}${endpoint}`;
}

export interface CourseData {
	id: number;
	name: string;
	description: string;
	status: string;
}

export interface Lesson {
    id: string;
    name: string;
    description: string;
    content: string;
    active: number;
    sort: number | null;
	updated_at: string;
	courseId: string;
}

export interface LessonCategory {
    id: number;
    name: string;
    author_id: string;
    lessons: Lesson[];
}

export type SchoolSettingsProps = {
	id: number;
	image: string | null;
	school_name: string;
	email: string;
	role: string;
};

export async function sendSms(phone: string, isAdmin: boolean): Promise<{ success: boolean }> {
    const sanitizedPhone = phone.replace(/[^\d]/g, '');
    const formattedPhone = sanitizedPhone;

    if (!/^7\d{10}$/.test(formattedPhone)) {
        console.error('Неверный формат телефона:', formattedPhone);
        throw new Error('Неверный формат телефона. Ожидается формат +7XXXXXXXXXX.');
    }

    const data = {
        phone: formattedPhone,
        type: isAdmin ? 2 : 1,
    };

	console.log('Тип данных для type:', typeof data.type);
    console.log('Отправляемые данные:', JSON.stringify(data));

	const response = await fetch(getApiUrl('send-sms'), {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	});

	if(!response.ok) {
        const errorData = await response.json();
        console.error('Ошибка сервера:', errorData);
        throw new Error(errorData.message || 'Ошибка отправки СМС кода');
	}
	return await response.json();
}

export async function verifyCode(phone: string, code: string): Promise<{ token: string }> {
	const sanitizedPhone = phone.replace(/[^\d]/g, '');
    const formattedPhone = sanitizedPhone;

	const sanitizedCode = code.replace(/[^\d]/g, '');

    if (!/^7\d{10}$/.test(formattedPhone)) {
        console.error('Неверный формат телефона:', formattedPhone);
        throw new Error('Неверный формат телефона. Ожидается формат 7XXXXXXXXXX.');
    }
	const data = {
        phone: formattedPhone,
        code: Number(sanitizedCode),
    };
	
	const response = await fetch(getApiUrl('check-code'), {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	});
	if(!response.ok) {
		const errorData = await response.json();
        console.error('Ошибка проверки кода:', formattedPhone, errorData);
        throw new Error(errorData.message || 'Ошибка проверки кода');
	}
	return await response.json();
}

export async function createCourse(course: { name: string; description: string; }) : Promise<Course> {
	const token = localStorage.getItem('token');
	if (!token) {
        throw new Error('Токен отсутствует!');
    }

	const response = await fetch(getApiUrl('courses'), {
		method: 'POST',
		headers: { 
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`,
		},
		body: JSON.stringify(course),
	});

	const responseData = await response.json();

	console.log('Ответ от сервера:', responseData);
	if(!response.ok) {
		console.error('Ошибка создания курса:', responseData);
		throw responseData.errors || responseData || { general: ['Ошибка создания курса'] };
	}

	return responseData;
}

export async function getCourses(): Promise<Course[]> {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Не найден токен. Пожалуйста, авторизуйтесь.');
    }

    const fetchCoursesByStatus = async (status: number): Promise<Course[]> => {
        const response = await fetch(`${API_URL}courses?status=${status}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка при получении курсов');
        }

        return await response.json();
    };

    const [status2Courses, status3Courses] = await Promise.all([
        fetchCoursesByStatus(2),
        fetchCoursesByStatus(3),
    ]);
    return [...status2Courses, ...status3Courses];
}

export async function getCourseById(courseId: string): Promise<CourseData> {
	const token = localStorage.getItem('token');
	if(!token) {
		throw new Error('Не найден токен. Пожалуйста, авторизуйтесь.');
	}

	const response = await fetch(getApiUrl(`courses/${courseId}`), {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json;  charset=utf-8',
			'Authorization': `Bearer ${token}`,
		},
	});

	if(!response.ok) {
		throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
	}

	return await response.json();
}

export async function updateCourse(courseId: string, name: string, description: string): Promise<void> {
	const token = localStorage.getItem('token');
	if(!token) {
		throw new Error('Не найден токен. Пожалуйста, авторизуйтесь.');
	}

	const response = await fetch(getApiUrl(`courses/${courseId}`), {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`
		},
		body: JSON.stringify({
            name,
            description,
        }),
	});

	if(!response.ok) {
		const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при обновлении курса');
	}
}

export async function updateCourseStatus(courseId: number, statusId: number, coursesName: string ): Promise<void> {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Не найден токен. Пожалуйста, авторизуйтесь.');
    }

    const response = await fetch(getApiUrl(`courses/${courseId}`), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json;',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: coursesName, status: statusId }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при обновлении статуса курса');
    }
}

export async function getLessonCategories(coursesId: number): Promise<LessonCategory[]> {
	const token = localStorage.getItem('token');
	if(!token) {
		throw new Error('Не найден токен. Пожалуйста, авторизуйтесь.');
	}

	const response = await fetch(getApiUrl(`courses/${coursesId}`), {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json;',
			'Authorization': `Bearer ${token}`,
		},
	});

	if(!response.ok) {
		throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
	}

	const data = await response.json();
    console.log('Ответ API getLessonCategories:', data);
    return data;
}

export async function createLesson(courseId: string, lessonData: { name: string; description: string; content: string }) {
	const token = localStorage.getItem('token');
	if(!token) {
		throw new Error('Не найден токен. Пожалуйста, авторизуйтесь.');
	}

    const response = await fetch(getApiUrl(`courses/${courseId}/category/0/lessons`), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
			'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(lessonData),
    });

    if (!response.ok) {
        throw new Error("Не удалось создать урок");
    }

    return response.json();
}

export async function updateLessonData(courseId: string, lessonId:string, name: string, description: string, content: string): Promise<void> {
	const token = localStorage.getItem('token');
	if (!token) {
		throw new Error('Не найден токен. Пожалуйста, авторизуйтесь.');
	}

	const response = await fetch(getApiUrl(`courses/${courseId}/category/0/lessons/${lessonId}`), {
		method: 'PUT',
		headers: {
			'Content-Type': 'aplication/json',
			'Authorization': `Bearer ${token}`
		},
		body: JSON.stringify({ name, description, content }),
	});

	if(!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.message || 'Ошибка при обновлении данных урока');
	}
}

export async function updateSchollSettings(data: FormData): Promise<void> {
	const token = localStorage.getItem('token');
	if (!token) {
		throw new Error('Не найден токен. Пожалуйста, авторизуйтесь.');
	}

	const response = await fetch(getApiUrl('user'),  {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${token}`,
		},
		body: data,
	});

	const responseData = await response.json();

	console.log('Ответ от сервера:', responseData);

    if (!response.ok) {
        console.error('Ошибка обновления настроек школы:', responseData);
        throw responseData.errors || responseData || { general: ['Ошибка обновления настроек школы'] };
    }
}

export async function getSchoolSettings(): Promise<SchoolSettingsProps> {
	const token = localStorage.getItem('token');
	if (!token) {
		throw new Error('Токен отсутствует!');
	}

	const formData = new FormData();
	
	const response = await fetch(getApiUrl('user'), {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: formData,
	});

	if (!response.ok) {
		const errorData = await response.json();
		console.error('Ошибка при получении настроек:', errorData);
		throw new Error('Не удалось получить настройки');
	}

	return response.json();
}

export async function updateLessonSort(courseId: number, lessonId: number, sort: number): Promise<void> {
	try {
		const token = localStorage.getItem("token");
		if (!token) throw new Error("Токен не найден!");

		const response = await fetch(getApiUrl(`courses/${courseId}/category/0/lessons/${lessonId}`), {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ 
				sort
			}),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || "Ошибка обновления порядка урока.");
		}

		console.log(`Порядок урока с ID ${lessonId} успешно обновлён.`);
	} catch (error) {
		console.error(`Ошибка обновления урока с ID ${lessonId}:`, error);
	}
};