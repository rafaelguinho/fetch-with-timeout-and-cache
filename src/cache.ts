export const fetchFromCache = async (
  path: string
): Promise<Response | undefined> => {
  try {
    if ("caches" in window) {
      const response = await window.caches.match(path);

      if (response) {
        const expiration = response.headers.get("cache-expires");

        const expirationDate = expiration ? Date.parse(expiration) : new Date();
        const now = new Date();
        
        if (expirationDate > now) {
          return response;
        }
      }
    } else {
      console.warn("Cache is not supported in this browser");
    }
  } catch (error) {
    console.error("Error triyng to retrieve data from cache", error);
  }
};

export const insertIntoCache = async (
  cacheKey: string,
  response: Response,
  path: string,
  cacheDuration: number
) => {
  try {
    if ("caches" in window) {
      const cache = await window.caches.open(cacheKey);

      const expires = new Date();
      expires.setMilliseconds(expires.getMilliseconds() + cacheDuration);

      const myHeaders = new Headers();
      myHeaders.set("cache-expires", expires.toUTCString());

      const clonedResponse = response.clone();
      const jsonData = await clonedResponse.json();

      const responseData = new Response(JSON.stringify(jsonData), {
        headers: myHeaders,
      });

      cache.put(path, responseData);
    } else {
      console.warn("Cache is not supported in this browser");
    }
  } catch (error) {
    console.error("Error triyng to insert data in cache", error);
  }
};
