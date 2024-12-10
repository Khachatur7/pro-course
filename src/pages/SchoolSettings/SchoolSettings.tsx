import { useEffect, useState } from "react";
import Button from "../../components/Button/Button";
import Headling from "../../components/Headling/Headling";
import Info from "../../components/Info/Info";
import InputLabel from "../../components/InputLabel/InputLabel";
import styles from "./SchoolSettings.module.css";
import { NavLink } from "react-router-dom";
import { updateSchollSettings, getSchoolSettings } from "../../helpers/API";

export const SchoolSettings = () => {
	const [schoolName, setSchoolName] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [logoPreview, setLogoPreview] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const fetchSettings = async () => {
			try {
				setLoading(true);
				const data = await getSchoolSettings();
				setSchoolName(data.school_name || "");
				setEmail(data.email || "");
				setLogoPreview(data.image || null);
			} catch (error) {
				console.error("Ошибка при загрузке настроек:", error);
			} finally {
				setLoading(false);
			}
		};
	
		fetchSettings();
	}, []);

	const handleSave = async () => {
		const formData = new FormData();
		formData.append("school_name", schoolName);
		formData.append("email", email);
	
		try {
			await updateSchollSettings(formData);
			alert("Настройки успешно сохранены!");
		} catch (error) {
			console.error("Ошибка при сохранении настроек:", error);
			alert("Не удалось сохранить настройки.");
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
		return <div>Загрузка...</div>;
	}

	return (
		<div className={styles['school-settings']}>
			<Headling>Настройки школы</Headling>
			<div  className={styles['school-settings__body']}>
				<div className={styles['school-settings__wrap']}>
					<div className={styles['school-settings__box']}>
						<div className={styles['logo']}>
							<div  className={styles['logo-img']}>
								<img src={logoPreview  || "/develop.svg"} alt="" />
							</div>
							<label className={styles['logo-change']}>
								<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M11.2632 1.23386C11.573 0.924049 11.9932 0.75 12.4313 0.75C12.6483 0.75 12.8631 0.79273 13.0635 0.87575C13.264 0.958771 13.4461 1.08046 13.5995 1.23386C13.7529 1.38726 13.8746 1.56937 13.9576 1.7698C14.0406 1.97023 14.0833 2.18505 14.0833 2.40199C14.0833 2.61893 14.0406 2.83375 13.9576 3.03418C13.8746 3.23461 13.7529 3.41672 13.5995 3.57013L4.51788 12.6517C4.09069 13.0789 3.55542 13.382 2.96931 13.5285L0.75 14.0833L1.30483 11.864C1.45136 11.2779 1.75442 10.7426 2.18161 10.3155L11.2632 1.23386Z" stroke="#233566" stroke-opacity="0.4" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
									<path d="M9.08496 3.25L11.585 5.75" stroke="#233566" stroke-opacity="0.4" stroke-width="1.2" stroke-linejoin="round" />
								</svg>
								<input 
									type="file" 
									id='logo-upload'
									className={styles['logo-field']}
								/>
							</label>
						</div>
						<InputLabel
							label="Название школы"
							type="text"
							id="name-school"
							value={schoolName}
							onChange={(valueOrEvent) => handleInputChange(valueOrEvent, setSchoolName)}
						/>
					</div>
					<div className={styles['school-settings__box']}>
						<div className={styles['info-box']}>
							<Info
								description="Внимательно указывайте контактные данные - все важные уведомления будут приходить на них"
							/>
						</div>
						<InputLabel
							label="Электронная почта"
							type="text"
							id="fetchedData?.email "
							value={email}
							onChange={(valueOrEvent) => handleInputChange(valueOrEvent, setEmail)}
						/>
						{/* <InputLabel
							label="Контактный телефон"
							type="input"
							id="phone"
							mask="+7 (999) 999-99-99"
							value={phone}
							onChange={(valueOrEvent) => handleInputChange(valueOrEvent, setPhone)}
						/> */}
					</div>
					{/* <div className={styles['school-settings__box']}>
						<Button appearance="item">Изменить пароль</Button>
					</div> */}
				</div>
			</div>
			<div className={styles['school-settings__nav']}>
				<Button appearance="big" onClick={handleSave}>Сохранить</Button>
				<NavLink className={styles['btn-item']} to={'/'} >Отменить изменения</NavLink>
			</div>
		</div>
	)
}