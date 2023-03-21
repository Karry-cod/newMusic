import Cookies from "js-cookie";

export function getCookie(key: string) {
    return Cookies.get(key);
}

export const setCookie = (key: string, value: any) => {
    value = typeof value == "object" ? JSON.stringify(value) : value;
    console.log(typeof value, value);
    Cookies.set(key, value);
}


export function cleanCookie(key: string) {
    Cookies.remove(key);
}