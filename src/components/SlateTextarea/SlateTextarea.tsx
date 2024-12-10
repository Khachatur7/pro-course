import { forwardRef, useRef, useState, useImperativeHandle, useEffect } from "react";
import ReactQuill from "react-quill";
import { Quill } from "quill";
import cn from "classnames";
import "react-quill/dist/quill.snow.css"; // Подключение стилей Quill
import styles from "./SlateTextarea.module.css";
import { SlateTextareaProps } from "./SlateTextarea.props";

const SlateTextarea = forwardRef<Quill | null, SlateTextareaProps>(
  ({ label, id, onChange, className, value: controlledValue }, ref) => {
    const quillRef = useRef<ReactQuill>(null); // Ссылка на ReactQuill
    const [value, setValue] = useState<string>(typeof controlledValue === "string" ? controlledValue : ""); // Убедимся, что состояние - строка
    const [isFocused, setIsFocused] = useState(false);
    const [isFilled, setIsFilled] = useState(false);

    // Обновление состояния заполненности
    useEffect(() => {
      setIsFilled(value !== "");
    }, [value]);

    // Синхронизация value из props
    useEffect(() => {
		const cleanedValue =
		  typeof controlledValue === "string" && controlledValue.trim() === "<p><br></p>"
			? ""
			: controlledValue;
		setValue(typeof cleanedValue === "string" ? cleanedValue : "");
	}, [controlledValue]);

    // Передача экземпляра Quill через ref
    useImperativeHandle(ref, () => (quillRef.current?.getEditor() as Quill));

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

	const handleCleanContent = (content: string) => {
		if (content.trim() === "<p><br></p>") return ""; // Убираем пустое содержимое
		return content;
	};

	const handleChange = (content: string) => {
		const cleanedContent = handleCleanContent(content);
		setValue(cleanedContent);
		if (onChange) {
			onChange(cleanedContent);
		}
	};

    return (
		<div className={styles.field}>
			<label
			htmlFor={id}
			className={cn(styles.field__label, { [styles.active]: isFocused || isFilled })}
			>
			{label}
			</label>
			<ReactQuill
			value={typeof value === "string" ? value : ""}
			ref={quillRef}
			className={cn(className, styles.textarea)}
			onFocus={handleFocus}
			onBlur={handleBlur}
			onChange={handleChange}
			modules={{
				toolbar: [
				[{ header: [1, 2, 3, false] }], // Заголовки
				["bold", "italic", "underline"], // Форматирование текста
				[{ list: "ordered" }, { list: "bullet" }], // Списки
				["link"], // Ссылки
				["clean"], // Очистить форматирование
				],
				clipboard: {
					matchVisual: false, // Отключает авто-добавление <p><br></p>
				},
			}}
			formats={["header", "bold", "italic", "underline", "list", "bullet", "link"]}
			/>
		</div>
		);
	}
);

export default SlateTextarea;
