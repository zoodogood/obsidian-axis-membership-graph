# Axis-membership graph

Select two reference notes — the view will display the intermediate notes — and uses membership markers-symbols

## Development plan

This section is the working plan for the plugin. It is kept here so that both a human
reader and an AI agent can understand the intent of the project.

Ну надеюсь то на этот раз я понял, что мне надо: я хочу брать от двух до одиннадцати опорных заметок — и видеть граф связей между ними

🥞, это же гениальный плагин! Для каждой оси своя характеристика — три оттенка цвета, форма квадрат-круг, обводка, узор-контраст «половина», размер, цифра 0-9 и «X, Y, Z»-преобразования — одиннадцать градиентных визуальных символов-маркеров для того, чтобы воспринимать принадлежность отдельных элементов 

## Plugin metadata

| Field | Value |
| --- | --- |
| Name | Axis-membership graph |
| Id | `axis-membership-graph` |
| Short description | Displays intermediate notes with membership markers-symbols |
| Author | zoodogood |
| Repository | https://github.com/zoodogood/obsidian-axis-membership-graph |

## Local development

```bash
pnpm install
pnpm dev     # watch build
pnpm build   # production build
pnpm deploy  # copy dist/ into the vault
```

The build writes every runtime artefact into `dist/`: `main.js`, `manifest.json` and
`styles.css`. The whole content of `dist/` is copied into your Obsidian vault after
every build, so the vault folder always mirrors the build output.

The vault location is stored in `_for-dev/.env` (`OBSIDIAN_VAULT_PATH`) and is never committed.

## Project layout

```
dist/             # build output (main.js, manifest.json, styles.css)
manifest.json     # plugin manifest (source)
src/              # plugin source code
scripts/          # deploy helper
_for-dev/         # local development environment
```

> Current local vault target: `/home/zoodogood/Documents/.obsidian.md/obsidian-knows`

## Releasing

1. Bump the version in `manifest.json` and `package.json`.
2. Add the new version to `versions.json`.
3. Run `pnpm build` to refresh `dist/`.
4. Create a GitHub release and attach `dist/manifest.json`, `dist/main.js` and `dist/styles.css`.

