"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertIntoCache = exports.fetchFromCache = void 0;
const fetchFromCache = (path) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if ("caches" in window) {
            const response = yield window.caches.match(path);
            if (response) {
                const expiration = response.headers.get("cache-expires");
                const expirationDate = expiration ? Date.parse(expiration) : new Date();
                const now = new Date();
                if (expirationDate > now) {
                    return response;
                }
            }
        }
        else {
            console.warn("Cache is not supported in this browser");
        }
    }
    catch (error) {
        console.error("Error triyng to retrieve data from cache", error);
    }
});
exports.fetchFromCache = fetchFromCache;
const insertIntoCache = (cacheKey, response, path, cacheDuration) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if ("caches" in window) {
            const cache = yield window.caches.open(cacheKey);
            const expires = new Date();
            expires.setMilliseconds(expires.getMilliseconds() + cacheDuration);
            const myHeaders = new Headers();
            myHeaders.set("cache-expires", expires.toUTCString());
            const clonedResponse = response.clone();
            const jsonData = yield clonedResponse.json();
            const responseData = new Response(JSON.stringify(jsonData), {
                headers: myHeaders,
            });
            cache.put(path, responseData);
        }
        else {
            console.warn("Cache is not supported in this browser");
        }
    }
    catch (error) {
        console.error("Error triyng to insert data in cache", error);
    }
});
exports.insertIntoCache = insertIntoCache;
