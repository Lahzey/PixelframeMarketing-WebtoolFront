import axios from "axios";
import {getReasonPhrase} from "http-status-codes";
import {spawnAlert, spawnOkModal} from "./Dialogs";

const DOMAIN = "https://pixelframe-marketing-backend-7a2d8d71a8ed.herokuapp.com";
// const DOMAIN = "http://localhost:8080";

export function getImageUrl(imageId) {
    return DOMAIN + "/api/img/" + imageId;
}

export function getToken() {
    return sessionStorage.getItem("token") ?? localStorage.getItem("token");
}

export function getUserIdFromToken(token) {
    const tokenParts = token.split('.');
    const payload = JSON.parse(atob(tokenParts[1]));
    return payload.sub;
}

function createRequest(method, url, data, additions = {}) {
    const token = getToken();
    const config = {
        method: method,
        url: DOMAIN + url,
        data: data,
        ...additions
    };
    if (!config.headers) config.headers = {};
    config.headers.Authorization = token ? `Bearer ${token}` : "";
    console.log("Creating " + method + " request to " + url + ":");
    console.log(config);
    return axios(config);
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

export function autoCatch(validationHandler, createErrorMessage) {
    return (error) => {
        console.log("auto caught error:");
        console.log(error);
        if (error.response) {
            if (validationHandler && error.response.status === 400 && error.response.data.errorMapping) {
                validationHandler(error.response.data.errorMapping);
            } else {
                let message = error.response.data.message ?? error.response.status + " - " + getReasonPhrase(error.response.status);
                createErrorMessage(message)
            }
        } else {
            createErrorMessage("A network error occurred.\nPlease check your internet connection and try again.");
        }
    };
}

export function autoCatchLog(title, validationHandler = null) {
    return autoCatch(validationHandler, (reason) => {
        console.log(title + ": " + reason);
    });
}

export function autoCatchAlert(title, validationHandler = null) {
    return autoCatch(validationHandler, (reason) => {
        spawnAlert({title: title,  content: reason, status: "error"});
    });
}

export function autoCatchModal(title, validationHandler = null) {
    return autoCatch(validationHandler, (reason) => {
        spawnOkModal({title: title,  content: reason, status: "error"});
    });
}

export function uploadImage(image) {
    const formData = new FormData();
    formData.append("upload", image);
    
    return post("/api/img", formData, { headers: {'Content-Type': 'multipart/form-data'} });
}

export function getImageUploadAdapter() {
    const token = getToken();
    return {
        uploadUrl: DOMAIN + "/api/img",
        headers: {
            Authorization: token ? `Bearer ${token}` : ""
        }
    }
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