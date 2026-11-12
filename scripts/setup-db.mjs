/**
 * Creates the `bookings` table. Safe to run more than once.
 *
 *   npm run db:setup
 *
 * Reads the connection string from the environment, or from .env.local:
 * UTHRIX_DATABASE_URL (set by the Vercel ↔ Neon integration) or DATABASE_URL.
 */

import { readFileSync, existsSync } from "node:fs"
import { neon } from "@neondatabase/serverless"

function fromEnvFile(name) {
  if (!existsSync(".env.local")) return ""
  const line = readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .find((l) => l.startsWith(`${name}=`))
  return line ? line.slice(name.length + 1).trim().replace(/^["']|["']$/g, "") : ""
}

const url =
  process.env.UTHRIX_DATABASE_URL ||
  process.env.DATABASE_URL ||
  fromEnvFile("UTHRIX_DATABASE_URL") ||
  fromEnvFile("DATABASE_URL")

if (!url) {
  console.error(
    "No connection string found. Set UTHRIX_DATABASE_URL (or DATABASE_URL) in .env.local."
  )
  process.exit(1)
}

const sql = neon(url)

await sql`
  create table if not exists bookings (
    id                   uuid primary key,
    slot                 timestamptz not null,
    time_zone            text not null,
    name                 text not null,
    email                text not null,
    phone                text not null,
    website              text not null default '',
    hear_about_us        text not null,
    message              text not null default '',
    guests               text[] not null default '{}',
    status               text not null default 'confirmed'
                           check (status in ('confirmed', 'cancelled')),
    team_email_sent_at   timestamptz,
    client_email_sent_at timestamptz,
    created_at           timestamptz not null default now()
  )
`

// Columns added after the first release — safe on an existing table.
await sql`alter table bookings add column if not exists business_type text not null default ''`
await sql`alter table bookings add column if not exists stage text not null default ''`

// One confirmed booking per slot. Cancelled rows don't block the slot.
await sql`
  create unique index if not exists bookings_slot_confirmed_key
    on bookings (slot) where status = 'confirmed'
`

const [{ count }] = await sql`select count(*)::int as count from bookings`
const host = new URL(url).hostname
console.log(`bookings table is ready on ${host} (${count} row${count === 1 ? "" : "s"}).`)
