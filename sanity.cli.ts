/**
* This configuration file lets you run `$ sanity [command]` in this folder
* Go to https://www.sanity.io/docs/cli to learn more.
*
* Uses the same SANITY_STUDIO_* variables as the Studio (src/sanity/env.ts).
**/
import { defineCliConfig } from 'sanity/cli'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET

export default defineCliConfig({ api: { projectId, dataset } })
