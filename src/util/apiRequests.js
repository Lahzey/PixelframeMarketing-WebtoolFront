import axios from "axios";
import {getReasonPhrase} from "http-status-codes";

export function getImageUrl(imageId) {
    return "/api/img/" + imageId;
}

export function getToken() {
    return sessionStorage.getItem("token") ?? localStorage.getItem("token");
}

export function getUserIdFromToken(token) {
    const tokenParts = token.split('.');
    const payload = JSON.parse(atob(tokenParts[1]));
    return payload.sub;
}

export function autoCatch(validationHandler, createErrorMessage) {
    return (error) => {
        if (error.response) {
            if (validationHandler && error.response.status === 400 && error.response.data.errorMap) {
                validationHandler(error.response.data.errorMap);
            } else {
                let message = "";
                if (error.response.data.errorType) {
                    message = error.response.data.errorType + ": " + error.response.data.message;
                } else {
                    message = "An unexpected error occurred.";
                }
                createErrorMessage(error.response.status + " - " + getReasonPhrase(error.response.status) + "\n" + message)
            }
        } else {
            createErrorMessage("A network error occurred.\nPlease check your internet connection and try again.");
        }
    };
}

export function autoCatchLog(message, validationHandler = null) {
    return autoCatch(validationHandler, (reason) => {
        console.log(message + ": " + reason);
    });
}

export function autoCatchAlert(message, validationHandler = null) {
    return autoCatch(validationHandler, (reason) => {
        console.log(message + ": " + reason);
        // todo
    });
}

export function autoCatchModal(message, validationHandler = null) {
    return autoCatch(validationHandler, (reason) => {
        console.log(message + ": " + reason);
        // todo
    });
}

function createRequest(method, url, data, additions = {}) {
    const token = getToken();
    const config = {
        method: method,
        url: url,
        data: data,
        ...additions
    };
    if (!config.headers) config.headers = {};
    config.headers.Authorization = token ? `Bearer ${token}` : "";
    return axios(config);//.then(result => {console.log("then"); console.log(result);}).catch(result => {console.log("catch"); console.log(result);}).finally(() => {console.log("finally");});
}

function get(url, additions = {}) {
    return createRequest('get', url, undefined, additions);
}

function post(url, data, additions = {}) {
    return createRequest('post', url,  data, additions);
}

function put(url, data, additions = {}) {
    return createRequest('put', url,  data, additions);
}

export function uploadImage(image) {
    const formData = new FormData();
    formData.append("file", image);
    
    return post("/api/img", formData, { headers: {'Content-Type': 'multipart/form-data'} });
}

export function registerUser(user) {
    return post("/api/auth/register", user);
}

export function loginUser(user) {
    return post("/api/auth/login", user);
}

export function fetchUser(userId) {
    return get("/api/user/" + userId);
}

export function updateUser(user) {
    return put("/api/user/" + user.id, user);
}

export function fetchTags() {
    return get("/api/tags");
}

export function fetchProduct(id) {
    return get("/api/products/" + id);
}

export function createProduct(product) {
    return post("/api/products", product);
}

export function updateProduct(product) {
    return put("/api/products/" + product.id, product);
}

export function filterProducts({type, ownerId, title, page, size}) {
    return get("/api/products",  {
        params: {
            type: type, 
            ownerId: ownerId,
            title: title,
            page: page, 
            size: size
        }
    });
}