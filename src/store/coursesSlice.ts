import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Course } from "../hooks/useFormModal";
import { getCourses } from '../helpers/API';

export interface CoursesState {
	courses: Course[];
	loading: boolean;
	error: string | null;
}

const initialState: CoursesState = {
	courses: [],
	loading: false,
	error: null,
};

export const fetchCourses = createAsyncThunk('courses/fetchCourses', async () => {
	const courses = await getCourses();
	return courses;
});

const coursesSlice = createSlice({
	name: 'courses',
	initialState,
	reducers: {
		addCourse(state, action: PayloadAction<Course>) {
			state.courses.push(action.payload);
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchCourses.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchCourses.fulfilled, (state, action: PayloadAction<Course[]>) => {
				state.courses = action.payload;
				state.loading = false;
			})
			.addCase(fetchCourses.rejected, (state, action) => {
				state.error = action.error.message || 'Ошибка загрузки курсов';
				state.loading = false;
			});
	},
});

// const initialState: CoursesState = {
// 	courses: (() => {
// 		try {
// 			const storedCourses = JSON.parse(localStorage.getItem("courses") || "[]");
// 			console.log("Loaded courses from localStorage:", storedCourses);
// 			return Array.isArray(storedCourses) ? storedCourses : [];
// 		} catch (error) {
// 			console.error("Failed to parse courses from localStorage", error);
// 			return [];
// 		}
// 	})(),
// };

// export const addCourseAsync = createAsyncThunk(
// 	"courses/addCourseAsync",
// 	async (course: Course) => {
// 		const response = await fetch("/api/add-course", {
// 			method: "POST",
// 			body: JSON.stringify(course),
// 			headers: { "Content-Type": "application/json" },
// 		});
	
// 		if (!response.ok) {
// 			throw new Error("Failed to add course");
// 		}
	
// 		return await response.json();
// 	}
// );

// const coursesSlice = createSlice({
// 	name: "courses",
// 	initialState,
// 	reducers: {
// 		addCourse(state, action: PayloadAction<Course>) {
// 			state.courses.push(action.payload);
// 			localStorage.setItem("courses", JSON.stringify(state.courses));
// 		},
// 		setCourses(state, action: PayloadAction<Course[]>) {
// 			state.courses = action.payload;
// 			localStorage.setItem("courses", JSON.stringify(state.courses));
// 		},
// 	},
// 	extraReducers: (builder) => {
// 		builder.addCase(addCourseAsync.fulfilled, (state, action) => {
// 			state.courses.push(action.payload);
// 		});
// 	},
// });

export const { addCourse } = coursesSlice.actions;
export default coursesSlice.reducer;
