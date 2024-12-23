import { useEffect, useState } from "react";

export interface Course {
	id: number;
	name: string;
	title: string;
	description: string;
	status: string | number;
	isArchived: boolean;
}

const STORAGE_KEY = "courses";

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const storedCourses = localStorage.getItem(STORAGE_KEY);
    if (storedCourses) {
      setCourses(JSON.parse(storedCourses));
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
    }
  }, [courses, isInitialized]);

  const addCourse = (newCourse: Omit<Course, "id">) => {
    const courseWithId = { ...newCourse, id: Date.now() }; // Генерация ID
    setCourses((prev) => [...prev, courseWithId]);
  };

  const deleteCourse = (id: number) => {
    setCourses((prev) => prev.filter((course) => course.id !== id));
  };

  const getActiveCourse = () => {
    return courses.filter((course) => !course.isArchived);
  };

  const getArchivedCourse = () => {
    return courses.filter((course) => course.isArchived);
  };

  return {
    courses,
    addCourse,
    deleteCourse,
    getActiveCourse,
    getArchivedCourse,
  };
}
