import { Course } from "../hooks/useFormModal";

export const API_URL = "https://ce18026.tw1.ru/api/";

export const BaseUrl = "https://ce18026.tw1.ru/api/marketplace";

export function getApiUrl(endpoint: string) {
  return `${API_URL}${endpoint}`;
}

interface UpdateCourseStatusRequest {
  name: string;
  status?: number;
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
  categoryId: number;
}

export interface LessonCategory {
  id: number;
  name: string;
  author_id: string;
  lessons: Lesson[];
}

export interface Student {
  id: number;
  fullName: string;
  phone: string;
}

export interface IExpert {
  id: number;
  name: string;
  lastname: string;
  middle_name: string;
  description: string;
  photo: string;
  specialization: string;
  services_count: number;
  services_list: IService[];
}

export interface IService {
  id: number;
  name: string;
  price: number;
  orders_count: number;
  reorders_count: number;
  reviews_count: null;
}

export interface IOrder {
  contact: string;
  message: string;
  services_id: number | null;
}

export interface IOffer {
  id: number;
  price: number;
  school_id: number;
  course_id: number;
  tariff_name: string;
  in_credit: boolean;
  credit_payment_link: string | null;
  payment_by_card: boolean;
  card_payment_link: string | null;
  created_at: string;
  updated_at: string;
}

export interface ICreateOffer {
  tariff_name: string;
  price: string;
  in_credit: boolean;
  credit_payment_link: string | null;
  payment_by_card: boolean;
  card_payment_link: string | null;
}

export type SchoolSettingsProps = {
  id: number;
  image?: string | null;
  school_name?: string;
  email?: string;
  role?: string;
  name?: string;
  surname?: string;
  phone?: string;
};

export async function sendSms(
  phone: string,
  isAdmin: boolean
): Promise<{ success: boolean }> {
  const sanitizedPhone = phone.replace(/[^\d]/g, "");
  const formattedPhone = sanitizedPhone;

  if (!/^7\d{10}$/.test(formattedPhone)) {
    console.error("Неверный формат телефона:", formattedPhone);
    throw new Error("Неверный формат телефона. Ожидается формат +7XXXXXXXXXX.");
  }

  const data = {
    phone: formattedPhone,
    type: isAdmin ? 2 : 1,
  };

  console.log("Тип данных для type:", typeof data.type);
  console.log("Отправляемые данные:", JSON.stringify(data));

  const response = await fetch(getApiUrl("send-sms"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Ошибка сервера:", errorData);
    throw new Error(errorData.message || "Ошибка отправки СМС кода");
  }
  return await response.json();
}

export async function verifyCode(
  phone: string,
  code: string
): Promise<{ token: string; role: "student" | "school" }> {
  const sanitizedPhone = phone.replace(/[^\d]/g, "");
  const formattedPhone = sanitizedPhone;

  const sanitizedCode = code.replace(/[^\d]/g, "");

  if (!/^7\d{10}$/.test(formattedPhone)) {
    console.error("Неверный формат телефона:", formattedPhone);
    throw new Error("Неверный формат телефона. Ожидается формат 7XXXXXXXXXX.");
  }
  const data = {
    phone: formattedPhone,
    code: Number(sanitizedCode),
  };

  const response = await fetch(getApiUrl("check-code"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json();
    console.error("Ошибка проверки кода:", formattedPhone, errorData);
    throw new Error(errorData.message || "Ошибка проверки кода");
  }
  return await response.json();
}

export async function createCourse(course: {
  name: string;
  description: string;
}): Promise<Course> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Токен отсутствует!");
  }

  const response = await fetch(getApiUrl("courses"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(course),
  });

  const responseData = await response.json();

  console.log("Ответ от сервера:", responseData);
  if (!response.ok) {
    console.error("Ошибка создания курса:", responseData);
    throw (
      responseData.errors ||
      responseData || { general: ["Ошибка создания курса"] }
    );
  }

  return responseData;
}

export async function getCourses(): Promise<Course[]> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Не найден токен. Пожалуйста, авторизуйтесь.");
  }

  const fetchCoursesByStatus = async (status: number): Promise<Course[]> => {
    const response = await fetch(`${API_URL}courses?status=${status}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Ошибка при получении курсов");
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
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Не найден токен. Пожалуйста, авторизуйтесь.");
  }

  const response = await fetch(getApiUrl(`courses/${courseId}`), {
    method: "GET",
    headers: {
      "Content-Type": "application/json;  charset=utf-8",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
  }

  return await response.json();
}

export async function updateCourse(
  courseId: string,
  name: string,
  description: string
): Promise<void> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Не найден токен. Пожалуйста, авторизуйтесь.");
  }

  const response = await fetch(getApiUrl(`courses/${courseId}`), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name,
      description,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Ошибка при обновлении курса");
  }
}

export async function updateCourseStatus(
  courseId: number,
  statusId: number | null,
  coursesName: string
): Promise<void> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Не найден токен. Пожалуйста, авторизуйтесь.");
  }

  const requestBody: UpdateCourseStatusRequest = { name: coursesName };
  if (statusId !== null) {
    requestBody.status = statusId;
  }

  const response = await fetch(getApiUrl(`courses/${courseId}`), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json;",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Ошибка при обновлении статуса курса");
  }
}

export async function getLessonCategories(
  coursesId: number
): Promise<LessonCategory[]> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Не найден токен. Пожалуйста, авторизуйтесь.");
  }

  const response = await fetch(getApiUrl(`courses/${coursesId}`), {
    method: "GET",
    headers: {
      "Content-Type": "application/json;",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

export async function createLesson(
  courseId: string,
  lessonData: { name: string; description: string; content: string }
) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Не найден токен. Пожалуйста, авторизуйтесь.");
  }

  const response = await fetch(
    getApiUrl(`courses/${courseId}/category/0/lessons`),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(lessonData),
    }
  );

  if (!response.ok) {
    throw new Error("Не удалось создать урок");
  }

  return response.json();
}

export async function updateLessonData(
  courseId: string,
  lessonId: string,
  name: string,
  description: string,
  content: string
): Promise<void> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Не найден токен. Пожалуйста, авторизуйтесь.");
  }

  const response = await fetch(
    getApiUrl(`courses/${courseId}/category/0/lessons/${lessonId}`),
    {
      method: "PUT",
      headers: {
        "Content-Type": "aplication/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, description, content }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Ошибка при обновлении данных урока");
  }
}

export async function updateSchollSettings(data: FormData): Promise<{
  image?: string;
  message?: string;
  errors?: Record<string, string[]>;
}> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Не найден токен. Пожалуйста, авторизуйтесь.");
  }

  const response = await fetch(getApiUrl("user"), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });

  const responseData = await response.json();

  console.log("Ответ от сервера:", responseData);

  if (!response.ok) {
    console.error("Ошибка обновления настроек школы:", responseData);
    throw (
      responseData.errors ||
      responseData || { general: ["Ошибка обновления настроек школы"] }
    );
  }

  return responseData;
}

export async function getSchoolSettings(): Promise<SchoolSettingsProps> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Токен отсутствует!");
  }

  const formData = new FormData();

  const response = await fetch(getApiUrl("user"), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Ошибка при получении настроек:", errorData);
    throw new Error("Не удалось получить настройки");
  }

  return response.json();
}

export async function updateLessonSort(
  courseId: number,
  lessonId: number,
  sort: number
): Promise<void> {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Токен не найден!");

    const response = await fetch(
      getApiUrl(`courses/${courseId}/category/0/lessons/${lessonId}`),
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sort,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Ошибка обновления порядка урока.");
    }

    console.log(`Порядок урока с ID ${lessonId} успешно обновлён.`);
  } catch (error) {
    console.error(`Ошибка обновления урока с ID ${lessonId}:`, error);
  }
}

export async function deleteLesson(
  courseId: number,
  categoryId: number,
  lessonId: number
): Promise<void> {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Токен не найден!");

    const response = await fetch(
      getApiUrl(
        `courses/${courseId}/category/${categoryId}/lessons/${lessonId}`
      ),
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Ошибка удаления урока.");
    }

    console.log(`Урок с ID ${lessonId} успешно удалён.`);
  } catch (error) {
    console.error(`Ошибка удаления урока с ID ${lessonId}:`, error);
  }
}

export async function getCourseStudents(courseId: string): Promise<Student[]> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Не найден токен. Пожалуйста, авторизуйтесь.");
  }

  const response = await fetch(getApiUrl(`courses/${courseId}/students`), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

export async function addStudentToCourse(
  courseId: string,
  data: { phone: string }
): Promise<Student> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Не найден токен. Пожалуйста, авторизуйтесь.");
  }

  const response = await fetch(getApiUrl(`courses/${courseId}/students`), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
  }

  return response.json() as Promise<Student>;
}

export async function deleteStudentFromCourse(
  courseId: string,
  studentId: number
): Promise<void> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Не найден токен. Пожалуйста, авторизуйтесь.");
  }

  const response = await fetch(
    getApiUrl(`courses/${courseId}/students/${studentId}`),
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
  }
}

export async function getExperts(): Promise<{ data: IExpert[] }> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Не найден токен. Пожалуйста, авторизуйтесь.");
  }

  const response = await fetch(getApiUrl(`marketplace`), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

export async function sortExpertsByDecrease(): Promise<{ data: IExpert[] }> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Не найден токен. Пожалуйста, авторизуйтесь.");
  }

  const response = await fetch(
    getApiUrl(`marketplace/users?sortBy=price&sort=desc`),
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

export async function sortExpertsByIncrease(): Promise<{ data: IExpert[] }> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Не найден токен. Пожалуйста, авторизуйтесь.");
  }

  const response = await fetch(
    getApiUrl(`marketplace/users?sortBy=price&sort=asc`),
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

export async function filterExpertsByName(
  text: string
): Promise<{ data: IExpert[] }> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Не найден токен. Пожалуйста, авторизуйтесь.");
  }

  const response = await fetch(getApiUrl(`marketplace/users?search=${text}`), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

export async function getExpert(id: string): Promise<IExpert> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Не найден токен. Пожалуйста, авторизуйтесь.");
  }

  const response = await fetch(getApiUrl(`marketplace/users/${id}`), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

export async function createOrder(orderData: IOrder): Promise<IOrder> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Не найден токен. Пожалуйста, авторизуйтесь.");
  }

  const response = await fetch(getApiUrl(`marketplace/order`), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

export async function getOffers(id: string): Promise<IOffer[]> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Не найден токен. Пожалуйста, авторизуйтесь.");
  }

  const response = await fetch(getApiUrl(`courses/${id}/offers`), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

export async function createOffer(
  offerData: ICreateOffer,
  courseId: string
): Promise<{ message: string }> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Не найден токен. Пожалуйста, авторизуйтесь.");
  }

  const response = await fetch(getApiUrl(`courses/${courseId}/offers`), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(offerData),
  });

  if (!response.ok) {
    throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

export async function deleteOffer(
  courseId: number,
  offerId: number,
): Promise<void> {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Токен не найден!");

    const response = await fetch(
      getApiUrl(
        `courses/${courseId}/offers/${offerId}`
      ),
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Ошибка удаления предложения.");
    }

    console.log(`Предложение с ID ${offerId} успешно удалёно.`);
  } catch (error) {
    console.error(`Ошибка предложения с ID ${offerId}:`, error);
  }
}

export async function changeOffer(
  courseId: string,
  offerId: string,
  offerData: ICreateOffer,

): Promise<any> {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Токен не найден!");

    const response = await fetch(
      getApiUrl(
        `courses/${courseId}/offers/${offerId}`
      ),
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(offerData),
      }
    );
    console.log(response);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Ошибка изменения преложения.");
    }

    console.log(`Предложение с ID ${offerId} успешно изменено.`);
  } catch (error) {
    console.error(`Ошибка предложения с ID ${offerId}:`, error);
  }
}


export async function getOfferData(
  courseId: string,
  offerId: string
): Promise<any> {
  const response = await fetch(
    getApiUrl(`public/course/${courseId}/offers/${offerId}`)
  );

  if (!response.ok) {
    throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}
