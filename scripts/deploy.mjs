#!/usr/bin/env node
/**
 * Copies the build output into the local Obsidian vault.
 *
 * The source of truth is the `dist` directory: everything that esbuild puts
 * there is copied verbatim into `<vault>/.obsidian/plugins/<plugin-id>/`.
 *
 * The vault location is read from `_for-dev/.env` (OBSIDIAN_VAULT_PATH) and can
 * be overridden with an environment variable of the same name. The file is
 * machine-specific and is never committed.
 */
import { cp, mkdir, readFile, readdir, rm, stat } from 'node:fs/promises';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const envFile = join(root, '_for-dev', '.env');
const distDir = join(root, 'dist');

function parseEnv(content) {
	const result = {};
	for (const line of String(content).split(/\r?\n/)) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith('#')) continue;
		const index = trimmed.indexOf('=');
		if (index === -1) continue;
		const key = trimmed.slice(0, index).trim();
		const value = trimmed.slice(index + 1).trim().replace(/^["']|["']$/g, '');
		result[key] = value;
	}
	return result;
}

function expandHome(input) {
	const home = homedir();
	if (input === '~') return home;
	if (input.startsWith('~/')) return join(home, input.slice(2));
	return input;
}

async function readVaultPath() {
	let fileEnv = {};
	try {
		fileEnv = parseEnv(await readFile(envFile, 'utf8'));
	} catch {
		fileEnv = {};
	}
	const raw = process.env.OBSIDIAN_VAULT_PATH || fileEnv.OBSIDIAN_VAULT_PATH;
	if (!raw) return null;
	return resolve(expandHome(raw.trim()));
}

async function readPluginId() {
	try {
		const manifest = JSON.parse(await readFile(join(root, 'manifest.json'), 'utf8'));
		return manifest.id || null;
	} catch {
		return null;
	}
}

/** Lists everything inside `dist`, files and folders alike. */
async function listDist() {
	try {
		const entries = await readdir(distDir, { withFileTypes: true });
		return entries.map((entry) => entry.name);
	} catch {
		return null;
	}
}

async function main() {
	const vaultPath = await readVaultPath();
	if (!vaultPath) {
		console.warn('[deploy] OBSIDIAN_VAULT_PATH is not configured. Set it in _for-dev/.env to enable vault deployment.');
		return;
	}

	const id = await readPluginId();
	if (!id) {
		console.warn('[deploy] Could not read the plugin id from manifest.json.');
		return;
	}

	const distEntries = await listDist();
	if (!distEntries || distEntries.length === 0) {
		console.warn('[deploy] The dist directory is empty or missing. Run the build first.');
		return;
	}

	const target = join(vaultPath, '.obsidian', 'plugins', id);
	await mkdir(target, { recursive: true });

	// The vault folder is a mirror of dist: stale files from earlier builds are
	// removed, so the plugin never mixes old and new artefacts.
	const targetEntries = await readdir(target).catch(() => []);
	for (const entry of targetEntries) {
		if (distEntries.includes(entry)) continue;
		await rm(join(target, entry), { recursive: true, force: true });
	}

	for (const entry of distEntries) {
		const from = join(distDir, entry);
		const to = join(target, entry);
		const info = await stat(from);
		if (info.isDirectory()) {
			await cp(from, to, { recursive: true });
		} else {
			await cp(from, to);
		}
	}

	console.log(`[deploy] Copied ${distEntries.length} item(s) from dist to ${target}`);
}

await main();
