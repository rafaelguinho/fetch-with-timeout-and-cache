export interface CustomRequestInit extends RequestInit {
  timeout?: number;
}

export interface CacheOptions {
  key: string;
  ms: number;
}

export interface RetryOptions {
  retries: number;
  delay: number
}

export interface FetchTCParams {
  resource: RequestInfo | URL,
  options?: CustomRequestInit,
  cacheOptions?: CacheOptions,
  retryOptions?: RetryOptions
}