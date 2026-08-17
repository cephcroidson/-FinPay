import apiRequest from "./apiClient";

export async function login(email, password) {
    return apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({
            email,
            password,
        }),
    });
}

export async function register(userData) {
    return apiRequest("/users/register", {
        method: "POST",
        body: JSON.stringify(userData),
    });
}
