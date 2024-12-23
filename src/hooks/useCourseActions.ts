import { useState } from "react";
import { updateCourseStatus } from "../helpers/API";

export const useCourseActions = (
  setMessage: (msg: string) => void,
  setError: (err: string) => void
) => {
  const [loading, setLoading] = useState(false);

  const handleCourseUpdate = async (
    courseId: number,
    newStatus: number,
    title: string
  ) => {
    setLoading(true);
    try {
      await updateCourseStatus(courseId, newStatus, title);

      setMessage(
        newStatus === 3
          ? `Курс "${title}" успешно перенесён в архив.`
          : `Курс "${title}" успешно удалён.`
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Неизвестная ошибка.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { handleCourseUpdate, loading };
};
