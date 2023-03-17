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
const cache_1 = require("./cache");
function fetch(resource, options, cacheOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        return fetchWithTimeoutAndCache(resource, options, cacheOptions);
    });
}
exports.default = fetch;
function fetchWithTimeout(resource, options) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const timeout = (_a = options === null || options === void 0 ? void 0 : options.timeout) !== null && _a !== void 0 ? _a : 10000;
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        const response = yield fetch(resource, Object.assign(Object.assign({}, options), { signal: controller.signal }));
        clearTimeout(id);
        return response;
    });
}
function fetchWithTimeoutAndCache(resource, options, cacheOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        const path = resource.toString();
        const responseInCache = yield (0, cache_1.fetchFromCache)(resource.toString());
        if (responseInCache) {
            return responseInCache;
        }
        const response = yield fetchWithTimeout(resource, Object.assign({}, options));
        if (cacheOptions && response.ok) {
            yield (0, cache_1.insertIntoCache)(cacheOptions.key, response, path, cacheOptions.ms);
        }
        return response;
    });
}
