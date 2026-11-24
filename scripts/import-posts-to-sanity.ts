/**
 * One-off import of the posts in src/config/blog.ts into Sanity.
 *
 * Run it with Node 20.19+ after `npx sanity login`:
 *
 *   npm run sanity:import-posts -- --dry-run   show what would change
 *   npm run sanity:import-posts                write to the dataset
 *
 * Safe to run more than once. Posts are matched by slug and authors by
 * name: a match is updated in place, anything else is created, and Sanity
 * assigns the IDs. Documents are written as published, since these posts
 * are already live on the site. Drafts with the same slug are left alone.
 */

import { getCliClient } from "sanity/cli";

import { POSTS, type PostAuthor } from "../src/config/blog";
import { toPostFields } from "./lib/postToSanity";

const dryRun = process.argv.includes("--dry-run");
const client = getCliClient({ apiVersion: "2026-11-24" });

/** Published (not draft) documents only. */
const NOT_DRAFT = '!(_id in path("drafts.**"))';

async function upsertAuthor(author: PostAuthor): Promise<string> {
  const fields = {
    _type: "author" as const,
    name: author.name,
    ...(author.role ? { role: author.role } : {}),
    ...(author.url ? { url: author.url } : {}),
  };
  const existing = await client.fetch<{ _id: string } | null>(
    `*[_type == "author" && name == $name && ${NOT_DRAFT}][0]{_id}`,
    { name: author.name },
  );

  if (existing) {
    console.log(`  author "${author.name}": update ${existing._id}`);
    if (!dryRun) await client.patch(existing._id).set(fields).commit();
    return existing._id;
  }

  console.log(`  author "${author.name}": create`);
  if (dryRun) return "(new author)";
  const created = await client.create(fields);
  return created._id;
}

async function main() {
  const { projectId, dataset } = client.config();
  console.log(
    `${dryRun ? "Dry run: " : ""}importing ${POSTS.length} posts into ${projectId}/${dataset}`,
  );

  let created = 0;
  let updated = 0;

  for (const post of POSTS) {
    console.log(`- ${post.slug}`);
    const fields = toPostFields(post);
    const authorId = post.author ? await upsertAuthor(post.author) : undefined;
    const doc = {
      ...fields,
      ...(authorId ? { author: { _type: "reference" as const, _ref: authorId } } : {}),
    };

    const existing = await client.fetch<{ _id: string } | null>(
      `*[_type == "post" && slug.current == $slug && ${NOT_DRAFT}][0]{_id}`,
      { slug: post.slug },
    );

    if (existing) {
      console.log(`  post: update ${existing._id} (${fields.body.length} blocks)`);
      if (!dryRun) await client.patch(existing._id).set(doc).commit();
      updated++;
    } else {
      console.log(`  post: create (${fields.body.length} blocks)`);
      if (!dryRun) await client.create(doc);
      created++;
    }
  }

  console.log(
    `${dryRun ? "Would create" : "Created"} ${created}, ${dryRun ? "would update" : "updated"} ${updated}.`,
  );
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
