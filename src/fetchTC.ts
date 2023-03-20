import { fetchFromCache, insertIntoCache } from "./cache";
import { CacheOptions, CustomRequestInit } from "./types";

async function fetchWithTimeout(
  resource: RequestInfo | URL,
  options?: CustomRequestInit
): Promise<Response> {
  const timeout = options?.timeout ?? 10000;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal,
  });
  clearTimeout(id);
  return response;
}

async function fetchWithTimeoutAndCache(
  resource: RequestInfo | URL,
  options?: CustomRequestInit,
  cacheOptions?: CacheOptions
): Promise<Response> {
  const path = resource.toString();
  const responseInCache = await fetchFromCache(resource.toString(), cacheOptions?.key);

  if (responseInCache) {
    return responseInCache;
  }

  const response = await fetchWithTimeout(resource, {
    ...options,
  });

  if (cacheOptions && response.ok) {
    await insertIntoCache(cacheOptions.key, response, path, cacheOptions.ms);
  }

  return response;
}

export default async function customFetchTC(
  resource: RequestInfo | URL,
  options?: CustomRequestInit,
  cacheOptions?: CacheOptions
): Promise<Response> {
  return fetchWithTimeoutAndCache(resource, options, cacheOptions);
}
