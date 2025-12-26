import { signIn, signUp, signOut, getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

export const authService = {
    // Sign up new user
    async register(email, password) {
        try {
            const { userId } = await signUp({
                username: email,
                password,
                options: {
                    userAttributes: {
                        email
                    }
                }
            });
            return { success: true, userId };
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, error: error.message };
        }
    },

    // Sign in existing user
    async login(email, password) {
        try {
            const { isSignedIn } = await signIn({ username: email, password });
            if (isSignedIn) {
                const user = await getCurrentUser();
                return { success: true, user };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    },

    // Sign out
    async logout() {
        try {
            await signOut();
            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            return { success: false, error: error.message };
        }
    },

    // Get current authenticated user
    async getCurrentUser() {
        try {
            const user = await getCurrentUser();
            return { success: true, user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Get auth token for API calls
    async getAuthToken() {
        try {
            const session = await fetchAuthSession();
            const token = session.tokens?.idToken?.toString();
            return token;
        } catch (error) {
            console.error('Get token error:', error);
            return null;
        }
    }
};
