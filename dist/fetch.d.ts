import { CacheOptions, CustomRequestInit } from "./types";
export default function fetch(resource: RequestInfo | URL, options?: CustomRequestInit, cacheOptions?: CacheOptions): Promise<Response>;
