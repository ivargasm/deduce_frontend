import { useEffect } from 'react';
import { useAuthStore } from '../store/Store';

export const useAuth = () => {
    const { user, userAuth, isLoading, userValid, logout } = useAuthStore();

    useEffect(() => {
        userValid();
    }, [userValid]);

    return { user, userAuth, isLoading, logout };
};
