export declare const fetchFromCache: (path: string) => Promise<Response | undefined>;
export declare const insertIntoCache: (cacheKey: string, response: Response, path: string, cacheDuration: number) => Promise<void>;
