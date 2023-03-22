import React, { useState, useEffect } from "react";
import fetchTC from "../../src/index";

interface Post {
  id: number;
  title: string;
  body: string;
}

function App() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetchTC({
      resource: "https://jsonplaceholder.typicode.com/posts",
      cacheOptions: {
        key: "mocks",
        ms: 30000,
      },
      retryOptions: {
        delay: 2000,
        retries: 1,
      },
    })
      .then((response) => response.json())
      .then((data: Post[]) => setPosts(data));
  }, []);

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts.map((post) => (
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
