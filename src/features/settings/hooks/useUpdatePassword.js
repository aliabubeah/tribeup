import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../../contexts/AuthContext";
import { changePasswordAPI } from "../../../services/auth";

export default function useUpdatePassword() {
    const { accessToken } = useAuth();

    return useMutation({
        mutationFn: ({ currentPassword, newPassword, confirmPassword }) =>
            changePasswordAPI({
                currentPassword,
                newPassword,
                confirmNewPassword: confirmPassword,
                accessToken,
            }),
    });
}
