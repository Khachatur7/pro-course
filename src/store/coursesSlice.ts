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

export const { addCourse } = coursesSlice.actions;
export default coursesSlice.reducer;
