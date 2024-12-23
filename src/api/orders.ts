import { getApiUrl } from "../helpers/API";

export interface Field {
	id?: number; // ID может отсутствовать
	type: string;
	label: string;
	placeholder: string | null;
	is_required: boolean;
	//options?: string[];
	options?: string | null;
}

export interface Form {
	id: number;
	name: string;
	description: string;
	fields: Field[];
	message: { label: string; message: string };
}

export interface FormCpation {
    id: number;
    placeholder: string;
}

export type FormAnswer = {
    id: number;
    form_id: number;
    user_id: number;
    form_field_id: number;
    answers: string | string[];
};

export async function createForm(formData: {
	form: { name: string; description: string };
		fields?: Array<{
			type: string;
			label: string;
			placeholder: string | null;
			is_required: boolean;
		}>;
		message?: { label: string; message: string };
	}): Promise<Form> {
	const token = localStorage.getItem('token');
	if (!token) {
		throw new Error('Токен отсутствует!');
	}

	const response = await fetch(getApiUrl('forms'), {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`,
		},
		body: JSON.stringify(formData),
	});
	
	const responseData = await response.json();
	if (!response.ok) {
		throw new Error(`Ошибка создания формы: ${response.statusText}`);
	}

	return responseData as Form; // Возвращаем объект типа Form
}

export async function getForms(): Promise<Form[]> {
	const token = localStorage.getItem("token");
	if (!token) {
		throw new Error("Токен отсутствует!");
	}

	const response = await fetch(getApiUrl("forms"), {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		throw new Error(`Ошибка получения форм: ${response.statusText}`);
	}

	return await response.json();
}

export async function getFormById(formId: string): Promise<Form> {
    const response = await fetch(getApiUrl(`public/forms/${formId}`), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`Ошибка получения формы: ${response.statusText}`);
    }

    return await response.json();
}

export async function getFormAnswers(formId: string): Promise<FormAnswer[]> {
	const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Токен отсутствует!");
    }

	const response = await fetch(getApiUrl(`forms/${formId}/answers`), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Ошибка получения данных формы: ${response.statusText}`);
    }

    return await response.json();
}

export async function updateForm(
	id: number,
	data: {
		form: { name: string; description: string };
		fields?: Array<{
			id?: number; // Для новых полей id не передаём
			type: string;
			label: string;
			placeholder: string | null; // null для полей без плейсхолдера
			is_required: 0 | 1; // 0 или 1 вместо true/false
		}>;
		message: { label: string; message: string };
	}
	): Promise<void> {
	const token = localStorage.getItem("token");
	if (!token) {
		throw new Error("Токен отсутствует!");
	}

	const response = await fetch(getApiUrl(`forms/${id}`), {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		throw new Error(`Ошибка обновления формы: ${response.statusText}`);
	}

	console.log("Form updated successfully!");
}

export async function deleteForm(formId: number): Promise<void> {
	const token = localStorage.getItem("token");
	if (!token) {
		throw new Error("Токен отсутствует!");
	}

	const response = await fetch(getApiUrl(`forms/${formId}`), {
		method: "DELETE",
		headers: {
			"Authorization": `Bearer ${token}`,
		},
	});

	if(!response.ok) {
		throw new Error(`Ошибка удаления формы: ${response.statusText}`);
	}
}

export async function deleteField(formId: number, fieldId: number): Promise<void> {
	const token = localStorage.getItem("token");
	if (!token) {
		throw new Error("Токен отсутствует!");
	}

	const response = await fetch(getApiUrl(`forms/${formId}/fields/${fieldId}`), {
		method: "DELETE",
		headers: {
			"Authorization": `Bearer ${token}`,
		},
	});

	if(!response.ok) {
		throw new Error(`Ошибка удаления поля: ${response.statusText}`)
	};
}
