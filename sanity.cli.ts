/**
 * Config for the Sanity CLI (`npx sanity <command>`), used by
 * `npm run studio` and `npm run studio:deploy`.
 * https://www.sanity.io/docs/cli
 */
import {defineCliConfig} from 'sanity/cli'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

export default defineCliConfig({
  api: {projectId, dataset},
  // After the first `npm run studio:deploy`, set `studioHost` to the name
  // you chose (the part before .sanity.studio) so later deploys don't ask.
})
