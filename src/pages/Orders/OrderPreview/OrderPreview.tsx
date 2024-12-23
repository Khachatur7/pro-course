import React, { useEffect, useState } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { Form, getForms } from "../../../api/orders"; // Функция для запроса данных формы
import styles from "./OrderPreview.module.css";
import InputLabel from "../../../components/InputLabel/InputLabel";
import Select from "../../../components/Form/Select/Select";
import Checkbox from "../../../components/Form/Checkbox/Checkbox";
import Button from "../../../components/Button/Button";
import Headling from "../../../components/Headling/Headling";
import TextareaLabel from "../../../components/TextareaLabel/TextareaLabel";

interface FormData {
    [key: string]: string | boolean;
}

const OrderPreview: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [form, setForm] = useState<Form | null>(null);
    const [, setFormData] = useState<FormData>({});
	const [formDataText, setFormDataText] = useState<{ [key: string]: string }>({});
	const [formDataCheckbox, setFormDataCheckbox] = useState<{ [key: string]: boolean }>({});
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [submissionMessage, setSubmissionMessage] = useState<{
		label: string;
		message: string;
	} | null>(null);

    useEffect(() => {
		const fetchForm = async () => {
			const forms = await getForms();
			const selectedForm = forms.find((f: Form) => f.id === Number(id));
			if (selectedForm) {
				setForm(selectedForm);
				setSubmissionMessage({
					label: selectedForm.message.label,
					message: selectedForm.message.message,
				});
	
				const initialData: FormData = {};
				selectedForm.fields.forEach((field) => {
					if (field.id) {
						initialData[field.id.toString()] = "";
					}
				});
				setFormData(initialData);
	
				const initialCheckboxData: { [key: string]: boolean } = {};
				selectedForm.fields.forEach((field) => {
					if (field.type === "checkbox" && field.options) {
						try {
							const options = JSON.parse(field.options) as string[];
							options.forEach((option) => {
								const key = `${field.id}-${option}`;
								initialCheckboxData[key] = false;
							});
						} catch (e) {
							console.error("Ошибка при разборе options для чекбоксов:", e);
						}
					}
				});
				setFormDataCheckbox(initialCheckboxData);
			}
		};
		fetchForm();
	}, [id]);
	

	useEffect(() => {
		if (form) {
			const initialCheckboxData: { [key: string]: boolean } = {};
			form.fields.forEach((field) => {
				if (field.type === "checkbox" && field.options) {
					try {
						const options = JSON.parse(field.options) as string[];
						options.forEach((option) => {
							const key = `${field.id}-${option}`;
							initialCheckboxData[key] = false;
						});
					} catch (e) {
						console.error("Ошибка при разборе options для чекбоксов:", e);
					}
				}
			});
			setFormDataCheckbox(initialCheckboxData);
		}
	}, [form]);

	const handleChange = (fieldId: string, value: string | boolean) => {
		setFormData((prev) => ({
			...prev,
			[fieldId]: value,
		}));
	
		if (typeof value === "boolean") {
			setFormDataCheckbox((prev) => ({
				...prev,
				[fieldId]: value,
			}));
		} else {
			setFormDataText((prev) => ({
				...prev,
				[fieldId]: value,
			}));
		}
	};
	
    const handleValidate = () => {
		const newErrors: { [key: string]: string } = {};
		form?.fields.forEach((field) => {
			if (field.id !== undefined && field.is_required) {
				const fieldId = field.id.toString();
	
				if (field.type === "checkbox") {
					// Проверяем, выбран ли хотя бы один чекбокс
					const isChecked = Object.keys(formDataCheckbox).some(
						(key) => key.startsWith(fieldId) && formDataCheckbox[key]
					);
					if (!isChecked) {
						newErrors[fieldId] = "Необходимо выбрать хотя бы один вариант";
					}
				} else if (
					(field.type === "text" || field.type === "textarea" || field.type === "select") &&
					!formDataText[fieldId]?.trim()
				) {
					newErrors[fieldId] = "Это поле обязательно для заполнения";
				}
			}
		});

		if(Object.keys(newErrors).length === 0) {
			setErrors({});
			setIsSubmitted(true);
		} else {
			setErrors(newErrors);
		}
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
			{isSubmitted ? (
				<div className={styles['result']}>
					<div className={styles['result__icon']}>
						<img src="/icon-form-good.svg" alt="" />
					</div>
					<Headling appearance="small">{submissionMessage?.label}</Headling>
					<div className={styles['desc']}>{submissionMessage?.message}</div>
					<NavLink to={"/"} className={styles['result-btn']}>Вернуться на главную</NavLink>
				</div>
			) : (
				<div className={styles["preview"]}>
					<div className={styles['preview-top']}>
						<button  onClick={() => navigate(-1)} className={styles["back"]}>
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
						<Headling>{form.name}</Headling>
					</div>
					<form className={styles['form']}>
						<Headling appearance="small">{form.description}</Headling>
						{form.fields.map((field) => (
							<div key={field.id} className={styles['form-field']}>
								{field.type === "text" && field.id !== undefined && (
									<>
										<InputLabel
											label={field.placeholder || ""}
											id={`field-${field.id}`}
											value={formDataText[field.id]}
											className={errors[field.id] ? styles["error-field"] : ""}
											onChange={(e) => {
												if (field.id !== undefined) {
													handleChange(field.id.toString(), typeof e === "string" ? e : e.target.value);
												}
											}}
										/>
										{errors[field.id] && (
											<div className={styles["error"]}>{errors[field.id]}</div>
										)}
									</>
								)}
								{field.type === "textarea" && field.id !== undefined && (
									<>
										<TextareaLabel
											label={field.placeholder || ""}
											id={`field-${field.id}`}
											value={formDataText[field.id]}
											className={errors[field.id] ? styles["error-field"] : ""}
											maxLength={320}
											onChange={(e) => {
												if (field.id !== undefined) {
													handleChange(field.id.toString(), typeof e === "string" ? e : e.target.value);
												}
											}}
										/>
										{errors[field.id] && (
											<div className={styles["error"]}>{errors[field.id]}</div>
										)}
									</>
								)}
								{field.type === "select" && field.id !== undefined && field.options && (
									<>
										<Select
											id={`field-${field.id}`}
											label={field.placeholder || ""}
											options={
												Array.isArray(field.options)
													? field.options
													: typeof field.options === "string"
													? JSON.parse(field.options)
													: []
											}
											className={errors[field.id] ? styles['error-field'] : ""}
											value={formDataText[field.id] || ""}
											onChange={(value) => {
												if (field.id !== undefined) {
													handleChange(field.id.toString(), value);
												}
											}}
										/>
										{errors[field.id] && (
											<div className={styles["error"]}>{errors[field.id]}</div>
										)}
									</>
								)}
								{field.type === "checkbox" && field.id !== undefined && field.options && (
									<>
										<div className={styles['checkbox-group']}>
											<div className={styles['checkbox-group__title']}>{field.placeholder}</div>
											{(() => {
												let optionsArray: string[] = [];
												try {
													if (field.options) {
														optionsArray = JSON.parse(field.options) as string[];
														if (!Array.isArray(optionsArray)) {
															throw new Error("Некорректный формат options");
														}
													}
												} catch (e) {
													console.log("Ошибка при разборе options:", e);
													optionsArray = [];
												}
								
												return optionsArray.map((option, index) => {
													const optionLabel = typeof option === "string" ? option : String(option);
													return (
														<Checkbox
															key={`${field.id}-${index}`}
															label={optionLabel}
															checked={Boolean(formDataCheckbox[`${field.id}-${option}`])}
															onChange={(checked) => {
																const key = `${field.id}-${option}`;
																handleChange(key, checked);
															}}
														/>
													);
												});
											})()}
										</div>
										{errors[field.id] && (
											<div className={styles["error"]}>{errors[field.id]}</div>
										)}
									</>
								)}
								{field.type === "button" && (
									<Button
										className={styles['btn']}
										appearance="big"
										onClick={(e) => {
											e.preventDefault();
											handleValidate();
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

export default OrderPreview;
