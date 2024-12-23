import { useEffect, useState } from "react";
import Button from "../../components/Button/Button";
import Headling from "../../components/Headling/Headling";
import Info from "../../components/Info/Info";
import InputLabel from "../../components/InputLabel/InputLabel";
import styles from "./SchoolSettings.module.css";
import { NavLink } from "react-router-dom";
import { updateSchollSettings, getSchoolSettings } from "../../helpers/API";
import Vendor from "../../components/Vendor/Vendor";
import cn from "classnames";

const BASE_STORAGE_URL = "https://ce18026.tw1.ru/storage/";

export const SchoolSettings = () => {
	const [data, setData] = useState<{
		name: string;
		surname: string;
		phone: string;
		email: string;
		image: string | File;
	}>({
		name: "",
		surname: "",
		phone: "",
		email: "",
		image: ""
	});
	const [schoolName, setSchoolName] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [logoPreview, setLogoPreview] = useState<string | File | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [message, setMessage] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [vendorActive, setVendorActive] = useState(false);
	const userRole = localStorage.getItem("role");

	useEffect(() => {
        if (message || error) {
            setVendorActive(true);
            const timer = setTimeout(() => setVendorActive(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [message, error]);

	useEffect(() => {
		const fetchSettings = async () => {
			try {
				setLoading(true);
				const fetchedData = await getSchoolSettings();
				if(userRole === "student") {
					setData({
						name: fetchedData.name || "",
						surname: fetchedData.surname || "",
						phone: fetchedData.phone || "",
						email: fetchedData.email || "",
						image: fetchedData.image || "",
					});
				} else {
					setData((prevData) => ({
						...prevData,
						phone: fetchedData.phone || "",
					}));
					setSchoolName(fetchedData.school_name || "");
					setEmail(fetchedData.email || "");
					setLogoPreview(fetchedData.image || null);
				}
			} catch (error) {
				console.error("Ошибка при загрузке настроек:", error);
			} finally {
				setLoading(false);
			}
		};
	
		fetchSettings();
	}, [userRole]);

	const handleImageUpload = (file: File, updateState: (file: File) => void) => {
		if(!["image/jpeg", "image/png", "image/jpg", "image/gif"].includes(file.type)) {
			setError("Загрузите файл в формате JPEG, PNG, JPG или GIF.");
			return;
		}
		updateState(file);
		console.log("Файл успешно загружен:", file.name);
	}

	const handleSave = async () => {
		const formData = new FormData();

		if(userRole === "student") {
			formData.append("name", data.name);
			formData.append("surname", data.surname);
			formData.append("email", data.email);
			if (data.image instanceof File) {
				formData.append("image", data.image);
				console.log("Отправляемое изображение (student):", data.image.name);
			} else {
				console.log("Изображение не обновлено (student).");
			}
		} else {
			formData.append("school_name", schoolName);
			formData.append("email", email);
			if (logoPreview && logoPreview instanceof File) {
				formData.append("image", logoPreview);
				console.log("Отправляемое изображение (school):", logoPreview.name);
			} else {
				console.log("Изображение не обновлено (school).");
			}
		}

		formData.forEach((value, key) => {
			if (key === "image" && value instanceof File) {
				console.log("Отправляется изображение:", value.name); // Отладка
			} else {
				console.log(`${key}:`, value);
			}
		});
		
	
		try {
			const response = await updateSchollSettings(formData);
			
			setError(null);
			setMessage(response.message || "Настройки успешно сохранены!");

			if (response.image) {
				if (userRole === "student") {
					setData({ ...data, image: response.image});
				} else {
					setLogoPreview(response.image);
				}
			}
		} catch (error) {
			setMessage(null);
			const errorMessage =
                typeof error === "object" && error !== null
                    ? Object.entries(error)
                          .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
                          .join("\n")
                    : "Не удалось сохранить настройки. Проверьте подключение к интернету.";
            setError(errorMessage);
		}
	};

	const handleInputChange = (
		valueOrEvent: string | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
			onChange: (value: string) => void
		) => {
		if (typeof valueOrEvent === "string") {
			onChange(valueOrEvent);
		} else {
			onChange(valueOrEvent.target.value);
		}	
	};

	if (loading) {
		return <div className={styles['loading']}>
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
		</div>;
	}

	return (
		<div className={styles['school-settings']}>
			<Vendor className={cn({ [styles.active]: vendorActive })}>
                {message && <p>{message}</p>}
                {error && <p>{error}</p>}
            </Vendor>
			<Headling>{userRole === "student" ? "Настройки пользователя" : "Настройки школы"}</Headling>
			<div  className={styles['school-settings__body']}>
				<div className={styles['school-settings__wrap']}>
					<div className={styles['school-settings__box']}>
						<label className={styles['logo']}>
							<div  className={styles['logo-img']}>
								{userRole === "student" ? (
									data.image && data.image !== BASE_STORAGE_URL ? (
                                        typeof data.image === "string" ? (
                                            <img src={data.image} alt="Логотип" />
                                        ) : (
                                            <img src={URL.createObjectURL(data.image)} alt="Превью загруженного изображения" />
                                        )
                                    ) : (
                                        <img src="/avatar.svg" alt="Логотип" />
                                    )
								) : (
									logoPreview  && logoPreview !== BASE_STORAGE_URL ? (
                                        typeof logoPreview === "string" ? (
                                            <img src={logoPreview} alt="Логотип" />
                                        ) : (
                                            <img src={URL.createObjectURL(logoPreview)} alt="Превью загруженного изображения" />
                                        )
                                    ) : (
                                        <img src="/avatar.svg" alt="Логотип" />
                                    )
								)}
							</div>
							<div className={styles['logo-change']}>
								<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M11.2632 1.23386C11.573 0.924049 11.9932 0.75 12.4313 0.75C12.6483 0.75 12.8631 0.79273 13.0635 0.87575C13.264 0.958771 13.4461 1.08046 13.5995 1.23386C13.7529 1.38726 13.8746 1.56937 13.9576 1.7698C14.0406 1.97023 14.0833 2.18505 14.0833 2.40199C14.0833 2.61893 14.0406 2.83375 13.9576 3.03418C13.8746 3.23461 13.7529 3.41672 13.5995 3.57013L4.51788 12.6517C4.09069 13.0789 3.55542 13.382 2.96931 13.5285L0.75 14.0833L1.30483 11.864C1.45136 11.2779 1.75442 10.7426 2.18161 10.3155L11.2632 1.23386Z" stroke="#233566" stroke-opacity="0.4" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
									<path d="M9.08496 3.25L11.585 5.75" stroke="#233566" stroke-opacity="0.4" stroke-width="1.2" stroke-linejoin="round" />
								</svg>
								<input 
									type="file" 
									accept="image/*"
									id='logo-upload'
									onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            if (userRole === "student") {
                                                handleImageUpload(file, (image) => setData({ ...data, image }));
												console.log("Загружено изображение (student):", file.name);
                                            } else {
                                                handleImageUpload(file, (image) => setLogoPreview(image));
												console.log("Загружено изображение (school):", file.name);
                                            }
                                        }
                                    }}
									className={styles['logo-field']}
								/>
							</div>
						</label>
						{userRole === "student" ? (
							<>
								<InputLabel
									label="Имя"
									type="text"
									id="name"
									value={data.name}
									onChange={(valueOrEvent) => handleInputChange(valueOrEvent, (value) => setData({ ...data, name: value}))}
								/>
								<InputLabel
									label="Фамилия"
									type="text"
									id="surname"
									value={data.surname}
									onChange={(valueOrEvent) => handleInputChange(valueOrEvent, (value) => setData({ ...data, surname: value}))}
								/>
							</>
						) : (
							<>
								<div className={styles['school-settings__box']}>
									<InputLabel
										label="Название школы"
										type="text"
										id="name-school"
										value={schoolName}
										onChange={(valueOrEvent) => handleInputChange(valueOrEvent, setSchoolName)}
									/>
								</div>
								<div className={styles['info-box']}>
									<Info
										description="Внимательно указывайте контактные данные - все важные уведомления будут приходить на них"
									/>
								</div>
							</>
						)}
						<InputLabel
							label="Электронная почта"
							type="text"
							id="fetchedData?.email "
							value={userRole === "student" ? data.email : email}
                            onChange={(valueOrEvent) =>
                                userRole === "student"
                                    ? handleInputChange(valueOrEvent, (value) => setData({ ...data, email: value }))
                                    : handleInputChange(valueOrEvent, setEmail)
                            }
						/>
						<div className={styles['phone']}>
							<div className={styles['desc']}>Телефон можно изменить через службу поддержки</div>
							<InputLabel
								label="Номер телефона"
								type="text"
								id="phone"
								value={`+${data.phone}`}
								disabled={true}
								onChange={(valueOrEvent) => handleInputChange(valueOrEvent, (value) => setData({ ...data, phone: value}))}
							/>
						</div>
					</div>
				</div>
			</div>
			<div className={styles['school-settings__nav']}>
				<Button appearance="big" onClick={handleSave}>Сохранить</Button>
				<NavLink className={styles['btn-item']} to={'/'} >На главную</NavLink>
			</div>
		</div>
	);
}