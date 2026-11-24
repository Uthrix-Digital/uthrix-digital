/**
 * Sanity Studio: the editing app for blog posts.
 *
 * It runs on its own, not inside the Next.js site:
 *   npm run studio          local Studio at http://localhost:3333
 *   npm run studio:deploy   publish it to <name>.sanity.studio
 *
 * The Studio is built by the Sanity CLI, which only passes env vars that
 * start with SANITY_STUDIO_ to the browser. That is why it reads its own
 * variables instead of the NEXT_PUBLIC_ ones in src/sanity/env.ts.
 */

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

import {schema} from './src/sanity/schemaTypes'
import {structure} from './src/sanity/structure'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'
const apiVersion = process.env.SANITY_STUDIO_API_VERSION || '2026-11-24'

if (!projectId) {
  throw new Error('Missing environment variable: SANITY_STUDIO_PROJECT_ID')
}

export default defineConfig({
  name: 'uthrix',
  title: 'Uthrix Digital',
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({structure}),
    // Vision is for trying GROQ queries from inside the Studio.
    visionTool({defaultApiVersion: apiVersion}),
  ],
})
