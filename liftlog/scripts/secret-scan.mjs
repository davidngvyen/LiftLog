#!/usr/bin/env node
import { execFileSync } from 'node:child_process'

const patterns = [
  // OpenAI-style keys per your PRD
  { name: 'OpenAI API key', regex: /\bsk-[a-zA-Z0-9]{48}\b/ },
  // Common env var leaks
  { name: 'OPENAI_API_KEY assignment', regex: /\bOPENAI_API_KEY\s*=\s*['"]?sk-[^\s'"\n]+/ },
  { name: 'Upstash REST token assignment', regex: /\bUPSTASH_REDIS_REST_TOKEN\s*=\s*['"][^'"]+['"]/ },
  { name: 'NextAuth secret assignment', regex: /\bNEXTAUTH_SECRET\s*=\s*['"][^'"]+['"]/ },
]

function runGit(args) {
  return execFileSync('git', args, { encoding: 'utf8' })
}

function fail(message) {
  console.error(`\n[secret-scan] ${message}`)
  console.error('[secret-scan] Commit blocked. Remove the secret or add it to .env.local.')
  process.exit(1)
}

try {
  runGit(['rev-parse', '--is-inside-work-tree'])
} catch {
  // Not a git repo yet; nothing to enforce.
  process.exit(0)
}

const diff = runGit(['diff', '--cached', '--unified=0'])

for (const { name, regex } of patterns) {
  if (regex.test(diff)) {
    fail(`Detected ${name} in staged changes.`)
  }
}

process.exit(0)
