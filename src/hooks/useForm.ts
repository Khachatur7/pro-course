import { useState, ChangeEvent } from "react";

const useForm = <T extends Record<string, unknown>>(initialValues: T) => {
	const [values, setValues] = useState(initialValues);

	const handleInputChange = <K extends keyof T>(
		field: K,
		valueOrEvent: T[K] | ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | null
	) => {
		if (valueOrEvent === null) return; // Если значение null, ничего не делаем.

		const value =
		typeof valueOrEvent === "object" && "target" in valueOrEvent
			? valueOrEvent.target.value
			: valueOrEvent;

			setValues((prev) => {
				const newValues = { ...prev, [field]: value as T[K] };
				console.log("Новое состояние:", newValues);
				return newValues;
			});
	};

	return { values, setValues, handleInputChange };
};

export default useForm;
