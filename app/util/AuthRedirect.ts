import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface AuthRedirectProps {
  isAuthenticated: boolean;
  redirectToAuthenticated: string; // Path for authenticated users
  redirectToUnauthenticated: string; // Path for unauthenticated users
}
/**
 * useAuthRedirect is a React hook to handle redirection based on authentication status.
 * 
 * @param {AuthRedirectProps} props - The properties for the authentication redirect.
 * 
 * Usage:
 * 
 * 1. Import the hook in your component:
 *    import useAuthRedirect from '@/util/AuthRedirect';
 * 
 * 2. Call the hook in component and pass the `isAuthenticated` flag:
 *    useAuthRedirect({
 *      isAuthenticated: userIsAuthenticated, // boolean value indicating authentication status
 *      redirectToAuthenticated: "/dashboard", // optional, defaults to '/dashboard'
 *      redirectToUnauthenticated: "/login", // optional, defaults to '/login'
 *     });
 * 
 * 3. The hook will automatically redirect users to the appropriate page based on their authentication status:
 *    - If `isAuthenticated` is true, the user will be redirected to the `redirectToAuthenticated` path (default is '/dashboard').
 *    - If `isAuthenticated` is false, the user will be redirected to the `redirectToUnauthenticated` path (default is '/login').
 * 
 */
export default function useAuthRedirect({
    isAuthenticated,
    redirectToAuthenticated = '/dashboard',
    redirectToUnauthenticated = '/login',
}:  AuthRedirectProps) {
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
            router.push(redirectToAuthenticated);
        } else {
            router.push(redirectToUnauthenticated);
        }
    }, [isAuthenticated, redirectToAuthenticated, redirectToUnauthenticated, router]);
}