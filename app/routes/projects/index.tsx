import { json } from "@remix-run/node"; // or cloudflare/deno
import { Link, useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/layouts/AppLayout";

// Import all your posts from the app/routes/posts directory. Since these are
// regular route modules, they will all be available for individual viewing
// at /posts/a, for example.
import * as postA from "./a.mdx";
import * as postB from "./b.md";
import * as postC from "./c.md";

function postFromModule(mod: typeof postA) {
  return {
    slug: mod.filename.replace(/\.mdx?$/, ""),
    ...mod.attributes.meta,
  };
}

export async function loader() {
  // Return metadata about each of the posts for display on the index page.
  // Referencing the posts here instead of in the Index component down below
  // lets us avoid bundling the actual posts themselves in the bundle for the
  // index page.
  return json([
    postFromModule(postA),
    postFromModule(postB),
    postFromModule(postC),
  ]);
}

export default function Index() {
  const posts = useLoaderData();

  return (
    <AppLayout>
      <ul>
        {posts.map((post: any) => (
          <li key={post.slug}>
            <Link to={post.slug}>{post.title}</Link>
            {post.description ? (
              <p>{post.description}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </AppLayout>
  );
}
