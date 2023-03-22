import { fetchFromCache, insertIntoCache } from "./cache";
import {
  CacheOptions,
  CustomRequestInit,
  FetchTCParams,
  RetryOptions,
} from "./types";

async function fetchWithRetry(
  resource: RequestInfo | URL,
  options?: CustomRequestInit,
  retryOptions?: RetryOptions
): Promise<Response> {
  const retries = retryOptions?.retries ?? 0;

  try {
    const response = await fetch(resource, {
      ...options,
    });

    if (response.status >= 500 && response.status <= 599 && retries > 0)
      throw response;

    return response;
  } catch (error) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, retryOptions.delay ?? 0));

      const newRetryOptions: RetryOptions = {
        ...retryOptions,
        retries: retries - 1,
      };

      return await fetchWithRetry(resource, options, newRetryOptions);
    }

    throw error;
  }
}

async function fetchWithTimeout(
  resource: RequestInfo | URL,
  options?: CustomRequestInit,
  retryOptions?: RetryOptions
): Promise<Response> {
  const timeout = options?.timeout ?? 100000;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetchWithRetry(
    resource,
    {
      ...options,
      signal: controller.signal,
    },
    retryOptions
  );
  clearTimeout(id);
  return response;
}

async function fetchWithTimeoutAndCache(
  resource: RequestInfo | URL,
  options?: CustomRequestInit,
  cacheOptions?: CacheOptions,
  retryOptions?: RetryOptions
): Promise<Response> {
  const path = resource.toString();
  const responseInCache = await fetchFromCache(
    cacheOptions?.key,
    resource.toString()
  );

  if (responseInCache) {
    return responseInCache;
  }

  const response = await fetchWithTimeout(
    resource,
    {
      ...options,
    },
    retryOptions
  );

  if (cacheOptions && response.ok) {
    await insertIntoCache(cacheOptions.key, response, path, cacheOptions.ms);
  }

  return response;
}

export default async function customFetchTC(
  arg: FetchTCParams
): Promise<Response>;
export default async function customFetchTC(
  resource: RequestInfo | URL,
  options?: CustomRequestInit,
  cacheOptions?: CacheOptions,
  retryOptions?: RetryOptions
): Promise<Response>;
export default async function customFetchTC(
  arg: RequestInfo | URL | FetchTCParams,
  options?: CustomRequestInit,
  cacheOptions?: CacheOptions,
  retryOptions?: RetryOptions
): Promise<Response> {
  if (isFetchTCParams(arg)) {
    return fetchWithTimeoutAndCache(
      arg.resource,
      arg.options,
      arg.cacheOptions,
      arg.retryOptions
    );
  }

  return fetchWithTimeoutAndCache(arg, options, cacheOptions, retryOptions);
}

function isFetchTCParams(arg?: any): arg is FetchTCParams {
  return "resource" in arg;
}
