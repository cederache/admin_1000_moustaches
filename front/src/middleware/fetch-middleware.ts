function fetchWithAuth(url: string, options: RequestInit): Promise<Response> {
    let token = sessionStorage.getItem("Auth Token");

    if (token === null || token === undefined) {
        console.warn("No token, redirect to /login");
        window.location.href = "/login";
        return Promise.reject("No token");
    }
    options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`
    }
    return fetch(url, options)
        .then((response) => {
            if (response.status === 401) {
                console.warn("Token expired, logging out");
                sessionStorage.removeItem("Auth Token");
                window.location.href = "/login";
                window.location.reload();
            }
            return response;
        })
}

export default fetchWithAuth;