import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { deleteField, Form, Field, FormAnswer, getFormAnswers, getForms, updateForm } from "../../../api/orders";
import useForm from "../../../hooks/useForm";
import useNotifications from "../../../hooks/useNotifications";
import styles from "./OrdersSettings.module.css";
import Vendor from "../../../components/Vendor/Vendor";
import Headling from "../../../components/Headling/Headling";
import InputLabel from "../../../components/InputLabel/InputLabel";
import TextareaLabel from "../../../components/TextareaLabel/TextareaLabel";
import Button from "../../../components/Button/Button";
import Tabs from "../../../components/Tabs/Tabs";
import useTabs from "../../../hooks/useTabs";
import cn from "classnames";

type FormField = {
    tempId?: string;
    id?: number;
    type: string;
    label: string;
    placeholder: string;
    is_required: boolean;
    options?: string[];
};

interface FormCaption {
    id: number;
    placeholder: string;
}

const OrdersSettings: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const [form, setForm] = useState<Form | null>(null);
	const { values, handleInputChange, setValues } = useForm({
		name: "",
		description: "",
	});
	const [messageValue, setMessageValue] = useState({
		label: "",
		message: "",
	});
	const [formFields, setFormFields] = useState<FormField[]>([]);
	const { activeTab, handleTabClick } = useTabs();
	const { message, setMessage, vendorActive, setError } = useNotifications();
	const [loading, setLoading] = useState<boolean>(true);
	const [formAnswers, setFormAnswers] = useState<FormAnswer[]>([]);
    const [loadingAnswers, setLoadingAnswers] = useState<boolean>(false);
	const navigate =  useNavigate();
	const generateTempId = () => `temp-${crypto.randomUUID()}`;

	useEffect(() => {
		const fetchForm = async () => {
			if (!id) {
				setError("Идентификатор формы отсутствует.");
				setLoading(false);
				return;
			}
			try {
				const fetchedForms = await getForms();
				const selectedForm = fetchedForms.find((form) => form.id === Number(id));
				if (selectedForm) {
					setForm(selectedForm);
					setValues({
						name: selectedForm.name || "",
						description: selectedForm.description || "",
					});
					setMessageValue({
						label: selectedForm.message?.label || "",
						message: selectedForm.message?.message || "",
					});

					if (selectedForm.fields) {
						setFormFields(
							selectedForm.fields.map((field) => ({
								id: field.id,
								type: field.type,
								label: field.label,
								placeholder: field.placeholder || "",
								is_required: Boolean(field.is_required),
								options: field.options
									? (typeof field.options === "string"
										? JSON.parse(field.options) as string[]  // Парсим строку в массив
										: Array.isArray(field.options)
										? field.options
										: []) // Если не строка и не массив, используем []
									: [],
							}))
						);
					}
				} else {
					setError("Форма с указанным ID не найдена.");
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : "Ошибка при загрузке форм.");
			} finally {
				setLoading(false);
			}
		};

		fetchForm();
	}, [id, setValues, setError]);

	useEffect(() => {
        const fetchFormAnswers = async () => {
            if (activeTab === 3 && id) {
                setLoadingAnswers(true);
                try {
                    const answers = await getFormAnswers(id);
                    setFormAnswers(answers);
                } catch (error) {
                    setError(error instanceof Error ? error.message : "Ошибка загрузки ответов");
                } finally {
                    setLoadingAnswers(false);
                }
            }
        };

        fetchFormAnswers();
    }, [activeTab, id, setError]);

	const handleSave = async () => {
		if (!id) {
			console.error("Идентификатор формы отсутствует.");
			setError("Идентификатор формы отсутствует.");
			return;
		}
		try {
			await updateForm(Number(id), {
				form: {
					name: values.name,
					description: values.description,
				},
				fields: formFields.map((field) => {
					const fieldCopy = { ...field };
					delete fieldCopy.tempId;
					return {
						id: field.id,
						type: field.type,
						label: field.label,
						placeholder: field.placeholder || null,
						is_required: field.is_required ? 1 : 0,
						...(field.type === "select" || field.type === "checkbox"
							? { options: field.options || [] }
							: {}),
					}
				}),
				message: {
					label: messageValue.label,
					message: messageValue.message
				},
			});
			setMessage("Форма успешно обновлена!");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Ошибка при сохранении формы.");
		}
	};

	const addTextField = () => {
		setFormFields((prev) => [
			...prev,
			{
				tempId: generateTempId(),
				type: "text",
				label: "Заголовок поля",
				placeholder: "",
				is_required: false,
			},
		]);
	};

	const addTextareaField = () => {
		setFormFields((prev) => [
			...prev,
			{
				tempId: generateTempId(),
				type: "textarea",
				label: "Заголовок поля",
				placeholder: "",
				is_required: false,
			}
		]);
	};

	const addCheckboxField = () => {
		setFormFields((prev) => [
			...prev,
			{
				tempId: generateTempId(),
				type: "checkbox",
				label: "Сопровождающий",
				placeholder: "",
				is_required: false,
				options: [],
			},
		]);
	};

	const addSelectField = () => {
		setFormFields((prev) => [
			...prev,
			{
				tempId: generateTempId(),
				type: "select",
				label: "Заголовок поля",
				placeholder: "",
				is_required: false,
				options: [],
			},
		]);
	};
	
	const addButtonField = () => {
		setFormFields((prev) => [
			...prev,
			{
				tempId: generateTempId(),
				type: "button",
				label: "Надпись на кнопке",
				placeholder: "",
				is_required: false,
			},
		]);
	};

	const addOption = (fieldId: number | string | undefined) => {
		setFormFields((prev) =>
			prev.map((field) => {
				// Проверяем, что поле имеет нужный ID
				if (
					(field.id === fieldId || field.tempId === fieldId) &&
					(field.type === "checkbox" || field.type === "select")
				) {
					return {
						...field,
						// Создаём новый массив для options
						options: [...(field.options || []), ""],
					};
				}
				return field;
			})
		);
	};
	
	const removeOption = (fieldId: number | undefined, optionIndex: number) => {
		setFormFields((prev) =>
			prev.map((field) =>
				field.id === fieldId
					? {
							...field,
							options: field.options?.filter((_, index) => index !== optionIndex),
					}
					: field
			)
		);
	};

	const handleCheckboxOptionChange = (
		fieldId: number | undefined,
		optionIndex: number,
		value: string
	) => {
		setFormFields((prev) =>
			prev.map((field) =>
				field.id === fieldId && field.type === "checkbox"
					? {
						...field,
						options: field.options?.map((opt, index) =>
							index === optionIndex ? value : opt
						),
					}
					: field
			)
		);
	};
	
	const handleSelectOptionChange = (
		fieldId: number | undefined,
		optionIndex: number,
		value: string
	) => {
		setFormFields((prev) =>
			prev.map((field) =>
				field.id === fieldId && field.type === "select"
					? {
						...field,
						options: field.options?.map((opt, index) =>
							index === optionIndex ? value : opt
						),
					}
					: field
			)
		);
	};
	
	const removeField = async (id?: number) => {
		if (id === undefined) {
			setError("Поле не может быть удалено: отсутствует ID.");
			return;
		}
		
		const fieldToRemove = formFields.find((field) => field.id === id);
	
		if(fieldToRemove) {
			try {
				if(form) {
					await deleteField(Number(form.id), id);
					setMessage(`Поле "${fieldToRemove.label}" успешно удалено.`);
				}
				setFormFields((prev) => prev.filter((field) => field.id !== id));
			} catch (error) {
				setError("Ошибка при удалении поля: " + (error instanceof Error ? error.message : "Неизвестная ошибка"));
				return;
			}
		}
	};
	
	const handleFieldChange = (
		key: string,
		valueOrEvent: string | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
		tempId?: string,
		id?: number
	) => {
		const value =
			typeof valueOrEvent === "object" && "target" in valueOrEvent
				? valueOrEvent.target.value
				: valueOrEvent;
	
		setFormFields((prev) =>
			prev.map((field) =>
				(field.tempId && field.tempId === tempId) || (field.id && field.id === id)
					? { ...field, [key]: value }
					: field
			)
		);
	};

	const handleMessageChange = (
		key: string,
		valueOrEvent: string | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const value =
			typeof valueOrEvent === "object" && "target" in valueOrEvent
				? valueOrEvent.target.value
				: valueOrEvent;
	
		setMessageValue((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	const handlePreview = () => {
		navigate(`/orders/${id}/preview`, {
			state: { name: values.name, descriprion: values.description },
		});
	};

	const handleCopyLink = () => {
		const link = `${window.location.origin}/forms/${id}/share`;
		navigator.clipboard
			.writeText(link)
			.then(() => {
				setMessage("Ссылка скопирована в буфер обмена!");
			})
			.catch(() => {
				setError("Не удалось скопировать ссылку.");
			});
	};

	function filterOutCaretDuplicates(answers: FormAnswer[]): FormAnswer[] {
		return answers.filter((answer) => {
			// Убедимся, что в ответе нет символа `^`
			if (Array.isArray(answer.answers)) {
				return !answer.answers.some((ans) => ans.includes("^"));
			}
			return !String(answer.answers).includes("^");
		});
	}

	const mapFieldPlaceholders = (fields: FormCaption[]): Record<number, string> => {
		const placeholders: Record<number, string> = {};
		fields.forEach((field) => {
			placeholders[field.id] = field.placeholder;
		});
		return placeholders;
	};
	
	const placeholders = form?.fields
		? mapFieldPlaceholders(
			  form.fields
				  .filter((field): field is Field & { id: number; placeholder: string } =>
					  typeof field.id === "number" && typeof field.placeholder === "string"
				  )
				  .map((field) => ({
					  id: field.id!,
					  placeholder: field.placeholder!,
				  }))
		  )
		: {};

	if (loading) {
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
	}

	if (!form) {
		return <div>Форма не найдена.</div>;
	}

	return (
		<>
			<Vendor className={cn({ [styles.active]: vendorActive })}>
                {message && <>{message}</>}
                {setError && <>{setError}</>}
            </Vendor>
			<div className={styles["settings"]}>
				<div className={styles["settings__top"]}>
					<div className={styles["settings__top-left"]}>
						<NavLink to="/orders" className={styles["back"]}>
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
						</NavLink>
						<Headling>Настройки формы</Headling>
					</div>
					<div className={styles['settings__top-right']}>
						<button className={cn(styles["small-btn"], styles["preview-btn"])} onClick={handlePreview}>
							Предпросмотр
						</button>
						<button className={cn(styles["small-btn"], styles["copy-btn"])} onClick={handleCopyLink}>
							Копировать ссылку
						</button>
					</div>
				</div>
				<div className={styles['settings__tabs']}>
					<Tabs
						tabs={["Общие данные", "Поля формы", "Сообщение после отправки", "Результаты"]}
						activeTab={activeTab}
						onTabClick={handleTabClick}
					/>
				</div>
				{activeTab === 0 && (
					<div className={styles["settings__body"]}>
						<div className={styles["settings__wrap"]}>
							<Headling appearance="small">Общие данные</Headling>
							<form className={styles["form"]}>
								<InputLabel
									label="Название формы"
									id="form-name"
									value={values.name}
									onChange={(valueOrEvent) => handleInputChange("name", valueOrEvent)}
								/>
								<TextareaLabel
									label="Описание формы"
									id="form-description"
									value={values.description}
									maxLength={320}
									onChange={(valueOrEvent) => handleInputChange("description", valueOrEvent)}
								/>
							</form>
						</div>
						<div className={styles["settings__bottom"]}>
							<Button className={styles["btn"]} onClick={handleSave} appearance="big">
								Сохранить
							</Button>
						</div>
					</div>
				)}
				
				{activeTab === 1 && (
					<div className={styles["settings__body"]}>
						<div className={styles['constructor']}>
							{formFields.map((field) => (
								<div key={field.id} className={styles["settings__wrap"]}>
									<div className={styles['settings__top']}>
										<div className={styles['settings__top-left']}>
											{/* <div className={styles['settings-current']}>{index + 1}</div> */}
											<Headling appearance="small">
												{field.type === "text" && "Текстовое поле"}
												{field.type === "textarea" && "Текстовое описание"}
												{field.type === "select" && "Поле выбора"}
												{field.type === "checkbox" && "Чекбокс"}
												{field.type === "button" && "Кнопка"}
											</Headling>
										</div>
										<button
											className={styles["remove-btn"]}
											onClick={() => removeField(field.id)}
											>
											<span>Удалить</span>
											<img src="/delete.svg" alt="" />
										</button>
									</div>
									<div className={styles['form']}>
										{field.type === "text" && (
											<>
												<InputLabel
													label={field.label}
													id={`input-${field.id}`}
													value={field.placeholder}
													onChange={(e) => handleFieldChange("placeholder", e, field.tempId, field.id)}
												/>
												<div className={styles['field-options']}>
													<label className={styles['checkbox']}>
														<input
															type="checkbox"
															checked={field.is_required}
															onChange={(e) =>
																handleFieldChange("is_required", e, field.tempId, field.id ?? undefined)
															}
														/>
														<div className={styles['checkbox__box']}>
															<span className={styles['checkbox__custom']}></span>
															Обязательное
														</div>
													</label>
												</div>
											</>
										)}
										{field.type === "textarea" && (
											<>
												<InputLabel
													label={field.label}
													id={`textarea-${field.id}`}
													value={field.placeholder}
													type="textarea"
													onChange={(value) => handleFieldChange("placeholder", value, field.tempId, field.id)}
												/>
												<div className={styles['field-options']}>
													<label className={styles['checkbox']}>
														<input
															type="checkbox"
															checked={field.is_required}
															onChange={(e) =>
																handleFieldChange("is_required", e, field.tempId, field.id ?? undefined)
															}
														/>
														<div className={styles['checkbox__box']}>
															<span className={styles['checkbox__custom']}></span>
															Обязательное
														</div>
													</label>
												</div>
											</> 
										)}
										{field.type === "checkbox" && (
											<>
												<InputLabel
													label={field.label}
													id={`checkbox-${field.tempId || field.id}`}
													value={field.placeholder}
													onChange={(e) => handleFieldChange("placeholder", e, field.tempId, field.id)}
												/>
												<div className={styles['options-list']}>
													{(field.options || []).map((option, index) => (
														<>
															<div key={index} className={styles['option-item']}>
																<span className={styles['option-number']}>{index + 1}.</span>
																<div className={styles['option-field']}>
																	<InputLabel
																		label={`Вариант ответа`}
																		id={`option-${field.id}-${index}`}
																		value={option}
																		onChange={(e) => {
																			const value = typeof e === "string" ? e : e.target.value;
																			handleCheckboxOptionChange(field.id, index, value);
																		}}
																	/>
																</div>
																<button
																	className={styles['remove-option-btn']}
																	onClick={() => removeOption(field.id, index)}
																>
																	<img src="/options-delete.svg" alt="" />
																</button>
															</div>
														</>
													))}
													<button
														className={styles['add-option-btn']}
														onClick={() => addOption(field.id || field.tempId)}
													>
														Добавить вариант <img src="/plus.svg" alt="" />
													</button>
												</div>
												<div className={styles['field-options']}>
													<label className={styles['checkbox']}>
														<input
															type="checkbox"
															checked={field.is_required}
															onChange={(e) =>
																handleFieldChange("is_required", e, field.tempId, field.id ?? undefined)
															}
														/>
														<div className={styles['checkbox__box']}>
															<span className={styles['checkbox__custom']}></span>
															Обязательное
														</div>
													</label>
												</div>
											</>
										)}
										{field.type === "select" && (
											<>
												<InputLabel
													label={field.label}
													id={`select-${field.tempId || field.id}`}
													value={field.placeholder}
													onChange={(e) => handleFieldChange("placeholder", e, field.tempId, field.id)}
												/>
												<div className={styles['options-list']}>
													{(field.options || []).map((option, index) => (
														<>
															<div key={index} className={styles['option-item']}>
																<span className={styles['option-number']}>{index + 1}.</span>
																<div className={styles['option-field']}>
																	<InputLabel
																		label={`Вариант ответа`}
																		id={`select-option-${field.id}-${index}`}
																		value={option}
																		onChange={(e) => {
																			const value = typeof e === "string" ? e : e.target.value;
																			handleSelectOptionChange(field.id, index, value);
																		}}
																	/>
																</div>
																<button
																	className={styles['remove-option-btn']}
																	onClick={() => removeOption(field.id, index)}
																>
																	<img src="/options-delete.svg" alt="" />
																</button>
															</div>
														</>
													))}
													<button
														className={styles['add-option-btn']}
														onClick={() => addOption(field.id || field.tempId)}
													>
														Добавить вариант <img src="/plus.svg" alt="" />
													</button>
												</div>
												<div className={styles['field-options']}>
													<label className={styles['checkbox']}>
														<input
															type="checkbox"
															checked={field.is_required}
															onChange={(e) =>
																handleFieldChange("is_required", e, field.tempId, field.id ?? undefined)
															}
														/>
														<div className={styles['checkbox__box']}>
															<span className={styles['checkbox__custom']}></span>
															Обязательное
														</div>
													</label>
												</div>
											</>
										)}
										{field.type === "button" && (
											<InputLabel
												label={field.label}
												id={`button-${field.tempId || field.id}`}
												value={field.placeholder}
												onChange={(e) => handleFieldChange("placeholder", e, field.tempId, field.id)}
											/>
										)}
									</div>
								</div>
							))}
						</div>
						<div className={cn(styles["settings__wrap"], styles["constructor-nav"])}>
							<Headling appearance="small">Поля формы:</Headling>
							<div className={styles['constructor-nav__buttons']}>
								<button className={styles['constructor-nav-btn']} onClick={addTextField}>
									<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M7.99967 3.33331V12.6666M3.33301 7.99998H12.6663" stroke="#A4ABBE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
									</svg>
									<span>Текстовое поле</span>
								</button>
								<button className={styles['constructor-nav-btn']} onClick={addTextareaField}>
									<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M7.99967 3.33331V12.6666M3.33301 7.99998H12.6663" stroke="#A4ABBE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
									</svg>
									<span>Текстовое описание</span>
								</button>
								<button className={styles['constructor-nav-btn']} onClick={addSelectField}>
									<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M7.99967 3.33331V12.6666M3.33301 7.99998H12.6663" stroke="#A4ABBE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
									<span>Поле выбора</span>
								</button>
								<button className={styles['constructor-nav-btn']} onClick={addCheckboxField}>
									<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M7.99967 3.33331V12.6666M3.33301 7.99998H12.6663" stroke="#A4ABBE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
									</svg>
									<span>Чекбокс</span>
								</button>
								<button className={styles['constructor-nav-btn']} onClick={addButtonField}>
									<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M7.99967 3.33331V12.6666M3.33301 7.99998H12.6663" stroke="#A4ABBE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
									</svg>
									<span>Кнопка</span>
								</button>
							</div>
						</div>
						<div className={styles["settings__bottom"]}>
							<Button className={styles["btn"]} onClick={handleSave} appearance="big">
								Сохранить
							</Button>
						</div>
					</div>
				)}

				{activeTab === 2 && (
					<div className={styles["settings__body"]}>
						<div className={styles["settings__wrap"]}>
							<Headling appearance="small">Показать сообщение</Headling>
							<form className={styles["form"]}>
								<InputLabel
									label="Название формы"
									id="form-name"
									value={messageValue.label}
									onChange={(valueOrEvent) => handleMessageChange("label", valueOrEvent)}
								/>
								<TextareaLabel
									label="Описание формы"
									id="form-description"
									value={messageValue.message}
									maxLength={320}
									onChange={(valueOrEvent) => handleMessageChange("message", valueOrEvent)}
								/>
							</form>
						</div>
						<div className={styles["settings__bottom"]}>
							<Button className={styles["btn"]} onClick={handleSave} appearance="big">
								Сохранить
							</Button>
						</div>
					</div>
				)}

				{activeTab === 3 && (
					<div className={styles["settings__body"]}>
						<Headling appearance="small">Результаты формы</Headling>
						{loadingAnswers ? (
							<div>Загрузка ответов...</div>
						) : (
							<div className={styles["answers"]}>
								<div className="answers__body">
									{formAnswers.length > 0 ? (
										<>
											<div className={styles["fields-list"]}>
											{Object.entries(placeholders)
												.filter(([fieldId]) => {
													// Предполагается, что у вас есть доступ к данным о типе поля
													const field = formFields.find((f) => f.id && f.id.toString() === fieldId);
													return field?.type !== "button"; // Исключаем тип `button`
												})
												.map(([fieldId, placeholder]) => (
													<div key={fieldId} className={styles["field-item"]}>
														{placeholder || "Неизвестное поле"}
													</div>
												))}

											</div>
											<div className="answers__wrap">
												<div className={styles["answers-list"]}>
													{filterOutCaretDuplicates(formAnswers).map((answer) => (
														<div key={answer.id} className={styles["answer-item"]}>
															{Array.isArray(answer.answers)
																? answer.answers.join(", ")
																: answer.answers}
														</div>
													))}
												</div>
											</div>
										</>
									) : (
										<div>Ответы не найдены.</div>
									)}
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</>
	);
};

export default OrdersSettings;