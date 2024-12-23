import { NavLink, useParams } from "react-router-dom";
import styles from "./Settings.module.css";
import Headling from "../../../components/Headling/Headling";
import Button from "../../../components/Button/Button";
import Tabs from "../../../components/Tabs/Tabs";
import Vendor from "../../../components/Vendor/Vendor";
import cn from "classnames";
import CourseModal from "../../../components/Courses/CourseModal/CourseModal";
import Lessons from "../../../components/Courses/Lessons/Lessons";
import LessonForm from "../../../components/Courses/LessonForm/LessonForm";
import NewLessonForm from "../../../components/Courses/NewLessonForm/NewLessonForm";
import StudentModal from "../../../components/Courses/StudentModal/StudentModal";

import useCourseData from "../../../hooks/useCourseData";
import useTabs from "../../../hooks/useTabs";
import useNotifications from "../../../hooks/useNotifications";
import useForm from "../../../hooks/useForm";
import InputLabel from "../../../components/InputLabel/InputLabel";
import TextareaLabel from "../../../components/TextareaLabel/TextareaLabel";
import { useState, useEffect } from "react";
import {
  deleteStudentFromCourse,
  getCourseStudents,
  updateCourse,
} from "../../../helpers/API";
import { Lesson } from "../../../helpers/API";
import { useCourseActions } from "../../../hooks/useCourseActions";
import OffersList from "../../../components/Courses/OffersList/OffersList";

interface Student {
  id: number;
  fullName: string;
  phone: string;
}

export function Settings() {
  const { id } = useParams<{ id: string }>();
  const { courseData, loading, error } = useCourseData(id);
  const { activeTab, handleTabClick } = useTabs();
  const { message, setMessage, vendorActive, setError } = useNotifications();
  const { values, handleInputChange, setValues } = useForm({
    title: "",
    description: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalSudentOpen, setIsModalStudentOpen] = useState(false);
  const [isCreatingLesson, setIsCreatingLesson] = useState(false);
  const [isCreatingOfferModale, setIsCreatingOfferModale] = useState(false);
  const [isEditingLesson, setIsEditingLesson] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const userRole = localStorage.getItem("role");

  useEffect(() => {
    if (courseData) {
      setValues({
        title: courseData.name || "",
        description: courseData.description || "",
      });
    }
  }, [courseData, setValues]);

  useEffect(() => {
    const fetchStudents = async () => {
      if (activeTab === 2 && id) {
        setLoadingStudents(true);
        try {
          const studentList = await getCourseStudents(id);
          setStudents(studentList);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Ошибка при загрузке студентов"
          );
        } finally {
          setLoadingStudents(false);
        }
      }
    };

    fetchStudents();
  }, [activeTab, id, setError]);

  const handleSave = async () => {
    if (!id) return;

    try {
      await updateCourse(id, values.title, values.description);
      setMessage("Данные успешно обновлены!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка при сохранении");
    }
  };

  const handleEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setIsEditingLesson(true);
  };

  const handleCloseLessonForm = () => {
    setEditingLesson(null);
    setIsEditingLesson(false);
  };

  const handleNewLessonCreated = () => {
    setIsCreatingLesson(false);
  };

  const { handleCourseUpdate, loading: updateLoading } = useCourseActions(
    setMessage,
    setError
  );

  const handleStudentAdded = async () => {
    if (id) {
      const studentList = await getCourseStudents(id);
      setStudents(studentList);
    }
    setIsModalStudentOpen(false);
  };

  const handleDeleteStudent = async (studentId: number) => {
    if (!id) return;

    try {
      await deleteStudentFromCourse(id, studentId);
      setMessage("Студент успешно удалён!");

      const updatedStudent = students.filter(
        (student) => student.id !== studentId
      );
      setStudents(updatedStudent);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ошибка при удалении студента"
      );
    }
  };

  if (loading) {
    return (
      <div className={styles["loading"]}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="120"
          height="30"
          viewBox="0 0 120 30"
          fill="#0050ff"
        >
          <circle cx="15" cy="15" r="12">
            <animate
              attributeName="r"
              from="12"
              to="12"
              begin="0s"
              dur="0.8s"
              values="12;9;12"
              calcMode="linear"
              repeatCount="indefinite"
            />
            <animate
              attributeName="fill-opacity"
              from="1"
              to="1"
              begin="0s"
              dur="0.8s"
              values="1;.5;1"
              calcMode="linear"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="60" cy="15" r="9" fill-opacity="0.5">
            <animate
              attributeName="r"
              from="9"
              to="9"
              begin="0.2s"
              dur="0.8s"
              values="9;12;9"
              calcMode="linear"
              repeatCount="indefinite"
            />
            <animate
              attributeName="fill-opacity"
              from="0.5"
              to="0.5"
              begin="0.2s"
              dur="0.8s"
              values=".5;1;.5"
              calcMode="linear"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="105" cy="15" r="9" fill-opacity="0.5">
            <animate
              attributeName="r"
              from="9"
              to="9"
              begin="0.4s"
              dur="0.8s"
              values="9;12;9"
              calcMode="linear"
              repeatCount="indefinite"
            />
            <animate
              attributeName="fill-opacity"
              from="0.5"
              to="0.5"
              begin="0.4s"
              dur="0.8s"
              values=".5;1;.5"
              calcMode="linear"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </div>
    );
  }

  if (!courseData) {
    return <div>Нет данных для отображения.</div>;
  }

  if (userRole === "student") {
    return (
      <div className={styles["settings"]}>
        <div className={styles["settings__top"]}>
          <div className={styles["settings__top-left"]}>
            <NavLink to={"/"} className={styles["back"]}>
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
            <Headling>Список уроков</Headling>
          </div>
        </div>
        <div className={styles["courses-list__wrap"]}>
          <Lessons courseId={id || ""} onEditLesson={handleEditLesson} />
        </div>
      </div>
    );
  }

  return (
    <>
      <Vendor className={cn({ [styles.active]: vendorActive })}>
        {message && <>{message}</>}
        {error && <>{error}</>}
      </Vendor>

      {isCreatingLesson ? (
        <NewLessonForm
          courseId={id || ""}
          onClose={() => setIsCreatingLesson(false)}
          onLessonCreated={handleNewLessonCreated}
        />
      ) : isEditingLesson ? (
        <LessonForm
          lesson={editingLesson}
          courseId={id || ""}
          onClose={handleCloseLessonForm}
          setError={setError}
          setMessage={setMessage}
        />
      ) : (
        <div className={styles["settings"]}>
          <div className={styles["settings__top"]}>
            <div className={styles["settings__top-left"]}>
              <NavLink to={"/"} className={styles["back"]}>
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
              <Headling>Настройки курса</Headling>
            </div>
            <Button
              appearance="big"
              className={styles["settings-btn"]}
              onClick={() => setIsModalOpen(true)}
            >
              Создать курс
            </Button>
          </div>

          <div className={styles["settings__top"]}>
            <Tabs
              tabs={["Общие данные", "Уроки", "Студенты", "Предложения"]}
              activeTab={activeTab}
              onTabClick={handleTabClick}
            />
            <div className={styles["settings__nav"]}>
              {activeTab === 0 && (
                <>
                  {courseData?.status !== "В архиве" && (
                    <button
                      className={cn(styles["settings-btn"], styles["archive"])}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!id) {
                          setError("Некорректный идентификатор курса.");
                          return;
                        }
                        handleCourseUpdate(Number(id), 3, values.title);
                      }}
                      disabled={updateLoading}
                    >
                      <span>В архив</span>
                      <img src="/settings/icons-archive.svg" alt="" />
                    </button>
                  )}
                  <button
                    className={cn(styles["settings-btn"], styles["delete"])}
                    onClick={() => {
                      if (!id) {
                        setError("Некорректный идентификатор курса.");
                        return;
                      }
                      handleCourseUpdate(Number(id), 4, values.title);
                    }}
                    disabled={updateLoading}
                  >
                    <span>Удалить курс</span>
                    <img src="/settings/icons-delete.svg" alt="" />
                  </button>
                </>
              )}
              {activeTab === 1 && (
                <button
                  className={cn(styles["settings-btn"], styles["add-lesson"])}
                  onClick={() => setIsCreatingLesson(true)}
                >
                  <span>Добавить урок</span>
                  <img src="/settings/add-lesson.svg" alt="" />
                </button>
              )}
              {activeTab === 2 && (
                <button
                  className={cn(styles["settings-btn"], styles["add-student"])}
                  onClick={() => setIsModalStudentOpen(true)}
                >
                  <span>Добавить студента</span>
                  <img src="/settings/add-lesson.svg" alt="" />
                </button>
              )}
              {activeTab === 3 && (
                <button
                  className={cn(styles["settings-btn"], styles["add-suggest"])}
                  onClick={() => setIsCreatingOfferModale(true)}
                >
                  <span>Добавить предложение</span>
                  <img src="/settings/add-lesson.svg" alt="" />
                </button>
              )}
            </div>
          </div>

          <div className={styles["settings__body"]}>
            {activeTab === 0 && (
              <>
                <div className={styles["settings__wrap"]}>
                  <Headling appearance="small">Настройки курса </Headling>
                  <form className={styles["form"]}>
                    <div className={styles["form__box"]}>
                      <InputLabel
                        label="Название курса"
                        id="course-name"
                        value={values.title}
                        onChange={(valueOrEvent) =>
                          handleInputChange("title", valueOrEvent)
                        }
                      />
                      <TextareaLabel
                        label="Описание курса"
                        id="course-description"
                        value={values.description}
                        maxLength={320}
                        onChange={(valueOrEvent) =>
                          handleInputChange("description", valueOrEvent)
                        }
                      />
                    </div>
                  </form>
                </div>
                <div className={styles["settings__bottom"]}>
                  <Button
                    onClick={handleSave}
                    className={styles["btn"]}
                    appearance="big"
                  >
                    Сохранить
                  </Button>
                </div>
              </>
            )}
            {activeTab === 1 && (
              <div className={styles["courses-list__wrap"]}>
                <Lessons courseId={id || ""} onEditLesson={handleEditLesson} />
              </div>
            )}
            {activeTab === 2 && (
              <div className={styles["lessons"]}>
                <div className={styles["lessons__top"]}>
                  <div className={styles["lessons__first"]}>
                    <div
                      className={cn(
                        styles["lessons__method"],
                        styles["caption"]
                      )}
                    >
                      ID
                    </div>
                    {/* <div className={cn(styles['lessons__title'], styles['caption'])}>ФИО</div> */}
                  </div>
                  <div className={styles["lessons__last"]}>
                    <div
                      className={cn(
                        styles["lessons__phone"],
                        styles["caption"]
                      )}
                    >
                      Телефон
                    </div>
                    {/* <div className={cn(styles['lessons__phone'], styles['caption'])}>Email</div> */}
                  </div>
                </div>
                <div className={styles["lessons__body"]}>
                  {loadingStudents ? (
                    <div>Загрузка студентов...</div>
                  ) : students.length > 0 ? (
                    students.map((student) => (
                      <div className={styles["card-lesson"]} key={student.id}>
                        <div className={styles["card-lesson__first"]}>
                          <div className={styles["method"]}>{student.id}</div>
                          <div className={styles["title"]}>
                            {student.fullName}
                          </div>
                        </div>
                        <div className={styles["card-lesson__last"]}>
                          <div className={styles["date"]}>+{student.phone}</div>
                          <button
                            className={styles["student-delete"]}
                            onClick={() => handleDeleteStudent(student.id)}
                          >
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M10.0003 1.0415C5.05277 1.0415 1.04199 5.05229 1.04199 9.99984C1.04199 14.9474 5.05277 18.9582 10.0003 18.9582C14.9479 18.9582 18.9587 14.9474 18.9587 9.99984C18.9587 5.05229 14.9479 1.0415 10.0003 1.0415ZM2.29199 9.99984C2.29199 5.74264 5.74313 2.2915 10.0003 2.2915C11.9041 2.2915 13.6467 2.98165 14.9915 4.12539C14.9859 4.13055 14.9805 4.13583 14.9751 4.14123L4.14173 14.9743C4.1363 14.9798 4.13098 14.9853 4.12579 14.9909C2.9821 13.6461 2.29199 11.9036 2.29199 9.99984ZM5.00907 15.8742C6.35392 17.018 8.09652 17.7082 10.0003 17.7082C14.2575 17.7082 17.7087 14.257 17.7087 9.99984C17.7087 8.09609 17.0185 6.35352 15.8747 5.00869C15.8696 5.01424 15.8643 5.01972 15.8589 5.02512L5.02561 15.8583C5.02017 15.8637 5.01466 15.869 5.00907 15.8742Z"
                                fill="#A4ABBE"
                              ></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div>Нет студентов в курсе</div>
                  )}
                </div>
              </div>
            )}
            {activeTab === 3 && (
              <div className={styles["courses-list__wrap"]}>
                <OffersList setState={setIsCreatingOfferModale} state={isCreatingOfferModale}/>
              </div>
            )}
          </div>
        </div>
      )}

      <CourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        setCourses={() => {}}
      />
      <StudentModal
        isOpen={isModalSudentOpen}
        onClose={() => setIsModalStudentOpen(false)}
        courseId={id || ""}
        onStudentAdded={handleStudentAdded}
      />
    </>
  );
}

export default Settings;
