import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/auth/authSlice';
import coursesReducer from "../store/coursesSlice";

const store = configureStore({
	reducer: {
		auth: authReducer,
		courses: coursesReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

