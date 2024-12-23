import { useSelector } from "react-redux";
import { RootState } from "../store/store";

export const useUserRole = () => {
    return useSelector((state: RootState) => state.auth.userRole);
};