import React, { useMemo, useState } from "react";
import { Slate, Editable, withReact } from "slate-react";
import { createEditor, Descendant } from "slate";
import cn from "classnames";
import styles from "./SlateTextarea.module.css";
import { SlateTextareaProps } from "./SlateTextarea.props";

const SlateTextarea: React.FC<SlateTextareaProps> = ({ label, id, onChange, className, maxLength }) => {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState<Descendant[]>([
    {
      type: "paragraph",
      children: [{ text: "" }],
    },
  ]);

  const handleChange = (newValue: Descendant[]) => {
    setValue(newValue);
    const plainText = newValue.map((node) => {
      if ("children" in node) {
        return node.children.map((child) => ("text" in child ? child.text : "")).join("");
      }
      return "";
    }).join("\n");

    if (!maxLength || plainText.length <= maxLength) {
      if (onChange) {
        onChange(plainText);
      }
    }
  };

  const getPlainTextLength = (): number => {
    return value.map((node) => {
      if ("children" in node) {
        return node.children.map((child) => ("text" in child ? child.text : "")).join("").length;
      }
      return 0;
    }).reduce((a, b) => a + b, 0);
  };

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={cn(styles.field__label)}>
        {label}
      </label>
      <Slate editor={editor} initialValue={value} onChange={handleChange}>
        <Editable
          id={id}
          className={cn(className, styles.textarea)}
          placeholder="Введите текст..."
        />
      </Slate>
      {maxLength && (
        <div className={styles.counter}>
          {getPlainTextLength()} / {maxLength}
        </div>
      )}
    </div>
  );
};

export default SlateTextarea;
