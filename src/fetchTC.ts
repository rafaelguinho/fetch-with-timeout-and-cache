import { fetchFromCache, insertIntoCache } from "./cache";
import { CacheOptions, CustomRequestInit } from "./types";

async function fetchWithTimeout(
  resource: RequestInfo | URL,
  options?: CustomRequestInit
): Promise<Response> {
  const timeout = options?.timeout ?? 100000;

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
  const responseInCache = await fetchFromCache(
    resource.toString(),
    cacheOptions?.key
  );

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

export async function customFetchTC(
  resource: RequestInfo | URL,
  cacheOptions: CacheOptions
): Promise<Response>;
export default async function customFetchTC(
  resource: RequestInfo | URL,
  options?: CustomRequestInit | CacheOptions,
  cacheOptions?: CacheOptions
): Promise<Response> {
  if (isCustomRequestInit(options)) {
    return fetchWithTimeoutAndCache(
      resource,
      options as CustomRequestInit,
      cacheOptions
    );
  } else if (isCacheOptions(options)) {
    fetchWithTimeoutAndCache(resource, undefined, options as CacheOptions);
  }
}

function isCustomRequestInit(
  options?: CustomRequestInit | CacheOptions
): options is CustomRequestInit {
  return "timeout" in options;
}

function isCacheOptions(
  options?: CustomRequestInit | CacheOptions
): options is CacheOptions {
  return "ms" in options;
}
