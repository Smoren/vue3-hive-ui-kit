import axios, { AxiosError } from "axios";
import { HttpClient } from "@/examples/api/http-client";

export const coreURL =
    `${import.meta.env.VITE_SERVER_PROTOCOL ?? window.location.protocol}://` +
    `${import.meta.env.VITE_SERVER_HOST ?? window.location.hostname}:` +
    `${import.meta.env.VITE_SERVER_PORT}${import.meta.env.VITE_SERVER_PATH}`;

const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
};

const auth: string | null = localStorage.getItem("auth") ?? import.meta.env.HEADERS_AUTHORIZATION ?? null;

if (auth) {
    headers.Authorization = auth;
}

export const $axios = axios.create({
    baseURL: coreURL,
    headers,
    withCredentials: false,
});

$axios.interceptors.response.use(null, (error: AxiosError) => {

    let path = "";

    const codePathMap = {
        401: "/error_401",
        403: "/error_403",
    };

    if (codePathMap.hasOwnProperty(error.response?.status ?? 0)) {
        path = codePathMap[error.response?.status as keyof typeof codePathMap];
    }

    // if (path) {
    //     router.push(path);
    //     return;
    // }

    return Promise.reject(error);
});

export const http: HttpClient = new HttpClient($axios);
