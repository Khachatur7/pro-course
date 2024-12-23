import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { Form, getFormById } from "../../api/orders";
import InputLabel from "../../components/InputLabel/InputLabel";
import TextareaLabel from "../../components/TextareaLabel/TextareaLabel";
import Select from "../../components/Form/Select/Select";
import Button from "../../components/Button/Button";
import styles from "./FormShare.module.css";
import Headling from "../../components/Headling/Headling";
import { getApiUrl } from "../../helpers/API";
import Vendor from "../../components/Vendor/Vendor";

const FormShare: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [form, setForm] = useState<Form | null>(null);
    const [formDataText, setFormDataText] = useState<{ [key: string]: string }>({});
    const [formDataCheckbox, setFormDataCheckbox] = useState<{ [key: string]: boolean }>({});
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [submissionMessage, setSubmissionMessage] = useState<{
		label: string;
		message: string;
	} | null>(null);

	const [errorMessages, setErrorMessages] = useState<string[]>([]);
	const [vendorActive, setVendorActive] = useState(false);
	
	useEffect(() => {
		if(vendorActive) {
			const timer = setTimeout(() => {
				setVendorActive(false);
			}, 3000);

			return () => clearTimeout(timer);
		}
	}, [vendorActive]);
	
    useEffect(() => {
		const fetchForm = async () => {
			try {
				if (!id) {
					throw new Error("ID формы отсутствует!");
				}
				const selectedForm = await getFormById(id);
				setForm(selectedForm);
	
				setSubmissionMessage({
					label: selectedForm.message.label,
					message: selectedForm.message.message,
				});
	
				const initialTextData: { [key: string]: string } = {};
				const initialCheckboxData: { [key: string]: boolean } = {};
	
				selectedForm.fields.forEach((field) => {
					if (field.id !== undefined) {
						if (field.type === "checkbox" && field.options) {
							let optionsArray: string[] = [];
							try {
								// Проверяем, является ли строка валидным JSON
								if (field.options.trim().startsWith("[") && field.options.trim().endsWith("]")) {
									optionsArray = JSON.parse(field.options);
								} else {
									// Если не JSON, предполагаем, что это строка, разделённая запятыми
									optionsArray = field.options.split(",").map((opt) => opt.trim());
								}
							} catch (e) {
								console.error("Ошибка при обработке options:", e);
								optionsArray = [];
							}
				
							optionsArray.forEach((option) => {
								initialCheckboxData[`${field.id}-${option}`] = false;
							});
						} else {
							initialTextData[field.id.toString()] = "";
						}
					}
				});
				
	
				setFormDataText(initialTextData);
				setFormDataCheckbox(initialCheckboxData);
			} catch (error) {
				console.error("Ошибка загрузки формы:", error);
				setErrorMessages(["Ошибка загрузки формы. Попробуйте позже."]);
				setVendorActive(true);
			}
		};
	
		fetchForm();
	}, [id]);
	

    const handleInputChange = (fieldId: string, value: string | boolean) => {
		if (typeof value === "boolean") {
			setFormDataCheckbox((prev) => {
				const updatedData = { ...prev, [fieldId]: value };
				return updatedData;
			});
		} else {
			setFormDataText((prev) => {
				const updatedData = { ...prev, [fieldId]: value };
				return updatedData;
			});
		}
	};

    const handleSubmit = async () => {
		const newErrors: { [key: string]: string } = {};

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	
		const hasId = (field: { id?: number | undefined }): field is { id: number } => {
			return field.id !== undefined;
		};
	
		form?.fields.forEach((field) => {
			if (hasId(field) && field.is_required) {
				if (field.type === "checkbox") {
					const isChecked = Object.keys(formDataCheckbox).some(
						(key) => key.startsWith(field.id.toString()) && formDataCheckbox[key]
					);
					if (!isChecked) {
						newErrors[field.id.toString()] = "Выберите хотя бы один вариант.";
					}
				} else {
					const value = formDataText[field.id.toString()];
					if (!value?.trim()) {
						newErrors[field.id.toString()] = "Это поле обязательно.";
					} else if (
						field.placeholder &&
						/email|почта|почту/i.test(field.placeholder) && // Проверяем наличие "email" или "почта"
						!emailRegex.test(value)
					) {
						newErrors[field.id.toString()] = "Введите корректный email.";
					}
				}
			}
		});
	
		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}
	
		setErrors({});
		setErrorMessages([]);
		setVendorActive(false);
		
		const fieldsData = form?.fields.map((field) => {
			if (field.type === "checkbox") {
				const selectedOptions = Object.keys(formDataCheckbox)
					.filter((key) => key.startsWith(`${field.id}-`) && formDataCheckbox[key])
					.map((key) => key.split("-")[1]); // Получаем значение после "field.id-"
				return { id: field.id, value: selectedOptions.length ? selectedOptions : null };
			} else if (field.type === "text" || field.type === "textarea" || field.type === "select") {
				const value = formDataText[field.id!.toString()] || null;
				return { id: field.id, value };
			}
			return null; // Для остальных типов, если они не нужны
		}).filter(Boolean); // Удаляем null из массива
	
		const payload = {
			fields: fieldsData,
		};
	
		// Отправка данных на сервер
		try {
			const response = await fetch(getApiUrl(`public/forms/${id}/complete`), {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});
	
			if (!response.ok) {
				const errorResponse = await response.json();
				const extractedErrors = extractErrors(errorResponse.message);
				setErrorMessages(extractedErrors);
				setVendorActive(true);
				return;
			}
	
			const result = await response.json();
			console.log("Ответ сервера:", result);
			setIsSubmitted(true); // Отображаем сообщение об успешной отправке
		} catch (error) {
			console.error("Ошибка при отправке формы:", error);
			setErrorMessages(["Ошибка отправки формы. Попробуйте позже."]);
			setVendorActive(true);
		}
	};
	
	const extractErrors = (serverErrors: Record<string, string[]>): string[] => {
		if (!serverErrors || typeof serverErrors !== "object") return [];
		const messages: string[] = [];
		Object.keys(serverErrors).forEach((key) => {
			if (Array.isArray(serverErrors[key])) {
				messages.push(...serverErrors[key]);
			}
		});
		return messages;
	};

    if (!form) {
        return (
			<div className={styles['loading']}>
				<svg xmlns="http://www.w3.org/2000/svg" width="120" height="30" viewBox="0 0 120 30" fill="#0050ff">
					<circle cx="15" cy="15" r="12">
						<animate attributeName="r" from="12" to="12" begin="0s" dur="0.8s" values="12;9;12" calcMode="linear" repeatCount="indefinite" />
						<animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite" />
					</circle>
					<circle cx="60" cy="15" r="9" fill-opacity="0.5">
						<animate attributeName="r" from="9" to="9" begin="0.2s" dur="0.8s" values="9;12;9" calcMode="linear" repeatCount="indefinite" />
						<animate attributeName="fill-opacity" from="0.5" to="0.5" begin="0.2s" dur="0.8s" values=".5;1;.5" calcMode="linear" repeatCount="indefinite" />
					</circle>
					<circle cx="105" cy="15" r="9" fill-opacity="0.5">
						<animate attributeName="r" from="9" to="9" begin="0.4s" dur="0.8s" values="9;12;9" calcMode="linear" repeatCount="indefinite" />
						<animate attributeName="fill-opacity" from="0.5" to="0.5" begin="0.4s" dur="0.8s" values=".5;1;.5" calcMode="linear" repeatCount="indefinite" />
					</circle>
				</svg>
			</div>
		);
    };

    return (
        <div className={styles['container']}>
			<Vendor className={vendorActive ? styles.active : ""}>
				{errorMessages.map((msg, index) => (
				<div key={index}>{msg}</div>
				))}
			</Vendor>
			{isSubmitted ? (
				<div className={styles['result']}>
					<div className={styles['result__body']}>
						<div className={styles['result__icon']}>
							<img src="/icon-form-good.svg" alt="" />
						</div>
						<Headling appearance="small">{submissionMessage?.label}</Headling>
						<div className={styles['desc']}>{submissionMessage?.message}</div>
						<NavLink to={"/"} className={styles['result-btn']}>Вернуться на главную</NavLink>
					</div>
				</div>
			) : (
				<div className={styles['preview']}>
					<div className={styles['preview-top']}>
						<Headling>{form.name}</Headling>
					</div>
					<form className={styles['form']}>
						<Headling appearance="small">{form.description}</Headling>
						{form.fields.map((field) => (
							<div key={field.id} className={styles['form-field']}>
								{field.id !== undefined && field.type === "text" && (
									<>
										<InputLabel
											label={field.placeholder || ""}
											id={`field-${field.id}`}
											value={formDataText[field.id.toString()]}
											className={errors[field.id] ? styles["error-field"] : ""}
											onChange={(value) => {
												const stringValue = typeof value === "string" ? value : value.target.value;
												handleInputChange(field.id!.toString(), stringValue);
											}}
										/>
										{errors[field.id.toString()] && (
											<div className={styles.error}>{errors[field.id.toString()]}</div>
										)}
									</>
								)}
								{field.id !== undefined && field.type === "textarea" && (
									<>
										<TextareaLabel
											label={field.placeholder || ""}
											value={formDataText[field.id.toString()]}
											id={`field-${field.id}`}
											className={errors[field.id] ? styles["error-field"] : ""}
											maxLength={320}
											onChange={(e) => {
												if (field.id !== undefined) {
													handleInputChange(field.id.toString(), typeof e === "string" ? e : e.target.value);
												}
											}}
										/>
										{errors[field.id.toString()] && (
											<div className={styles.error}>{errors[field.id.toString()]}</div>
										)}
									</>
								)}
								{field.id !== undefined && field.type === "select" && field.options && (
									<>
										<Select
											id={`field-${field.id}`}
											label={field.placeholder || ""}
											options={
												Array.isArray(field.options)
													? field.options
													: (() => {
														try {
															return JSON.parse(field.options);
														} catch {
															return [];
														}
													})()
											}
											className={errors[field.id] ? styles['error-field'] : ""}
											value={formDataText[field.id.toString()]}
											onChange={(value) => {
												if (field.id !== undefined) {
													handleInputChange(field.id.toString(), value);
												}
											}}
										/>
										{errors[field.id.toString()] && (
											<div className={styles.error}>{errors[field.id.toString()]}</div>
										)}
									</>
								)}
								{field.id !== undefined && field.type === "checkbox" && field.options && (
									<div className={styles['checkbox-group']}>
										<div className={styles['checkbox-group__title']}>{field.placeholder}</div>
										{(() => {
											let optionsArray: string[] = [];
											try {
												if (Array.isArray(field.options)) {
													optionsArray = field.options;
												} else if (typeof field.options === "string") {
													if (field.options.trim().startsWith("[") && field.options.trim().endsWith("]")) {
														optionsArray = JSON.parse(field.options);
													} else {
														optionsArray = field.options.split(",").map((opt) => opt.trim());
													}
												}
											} catch (e) {
												console.error("Ошибка при разборе options для чекбоксов:", e);
												optionsArray = [];
											}

											return optionsArray.map((option) => {
												const key = `${field.id}-${option}`;
												return (
													<label key={key} className={styles['checkbox']}>
														<input
															type="checkbox"
															checked={Boolean(formDataCheckbox[key])}
															onChange={(e) => {
																console.log(`Checkbox ${key} changed:`, e.target.checked);
																handleInputChange(key, e.target.checked);
															}}
														/>
														<div className={styles['checkbox__box']}>
															<span className={styles['checkbox__custom']}></span>
															{option}
														</div>
													</label>
												);
											});
										})()}
										{errors[field.id.toString()] && (
											<div className={styles.error}>{errors[field.id.toString()]}</div>
										)}
									</div>
								)}
								{field.type === "button" && (
									<Button
										className={styles['btn']}
										appearance="big"
										onClick={(e) => {
											e.preventDefault();
											handleSubmit();
										}}
									>
										{field.placeholder}
									</Button>
								)}
							</div>
						))}
					</form>
				</div>
			)}
		</div>
    );
};

export default FormShare;
