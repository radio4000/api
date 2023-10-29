# The big migration

Here's how we migrated our Firebase realtime database to a (Supabase) PostgreSQL database.

## 1. Export Firebase database

- Visit https://console.firebase.google.com/u/0/project/firebase-radio4000/database/radio4000/data and click "Export JSON" in the menu top right.

Save to `./lib/migration-script/input/firebase-export.json`.

## 2. Export Firebase auth users 

```
npm install --global firebase-tools
firebase login
firebase auth:export firebase-auth-users-export.json --project firebase-radio4000
```

Save to `./lib/migration-script/input/firebase-auth-users-export.json`.

Also see https://firebase.google.com/docs/cli/auth#auth-export.

## 3. Prepare fresh Postgres database 

- Create a fresh Supabase project
- Run the `radio4000.sql` schema on it
- Optionally disable confirmation emails during import

## 4. Env vars

Change the .env file in this repo to point to your new Supabase project.

## 5. Run the migration

Check the source code for how it works.

It's faster with bun, but should work in node as well.

```
bun ./lib/migration-script/index.mjs
```

