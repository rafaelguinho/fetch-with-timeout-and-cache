# fetch-with-timeout-and-cache

> Extending fetch api to include timeouts and a client side cache to avoid multiples requests.

[![NPM](https://img.shields.io/npm/v/fetch-with-timeout-and-cache.svg)](https://www.npmjs.com/package/fetch-with-timeout-and-cache)

# Table of Contents

- [Installation](#install)
- [Usage](#usage)
- [Properties](#properties)

## Install

```bash
npm install --save fetch-with-timeout-and-cache
```

## Usage

```tsx
import React, { useState, useEffect } from 'react';
import fetch from 'fetch-with-timeout-and-cache'

interface Post {
  id: number;
  title: string;
  body: string;
}

function App() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetchTC('https://jsonplaceholder.typicode.com/posts',
      {
        timeout: 1300,
      },
      {
        key: 'posts',
        ms: 30000,
      })
      .then(response => response.json())
      .then((data: Post[]) => setPosts(data));
  }, []);

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```

### Properties

| Name         | Description                                                                                                                         | Default   |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------- | --------- |
| resource     | This defines the resource that you wish to fetch                                                                                    |        |
| options      | An object containing any custom settings that you want to apply to the request. Use the property timeout to define a custom timeout | undefined |
| cacheOptions | Define the cache options if you want it                                                                                             | undefined |

## License

MIT © [rafaelguinho](https://github.com/rafaelguinho)
