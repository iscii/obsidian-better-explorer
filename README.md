# Better Explorer

Better Explorer improves Obsidian's built-in file explorer with VS Code-style sticky folder headers.

When you scroll inside the file explorer, every open ancestor folder sticks to the top of the pane. Nested folders stack below their parents, so you keep the current folder path visible while browsing large vaults.

## Features

- Sticky headers for expanded folders in the core file explorer.
- Nested stacking: parent, grandparent, and deeper open folders remain visible together.
- No vault scans, network calls, or data collection.
- Works by enhancing Obsidian's existing explorer DOM; it does not replace the file explorer view.

## Install for local testing

1. Run `npm install`.
2. Run `npm run build`.
3. Copy `main.js`, `manifest.json`, and `styles.css` into `<Vault>/.obsidian/plugins/obsidian-better-explorer/`.
4. Reload Obsidian and enable **Better Explorer** in **Settings → Community plugins**.

## Development

- `npm test` runs the small core behavior tests.
- `npm run build` type-checks and bundles the plugin.
- `npm run dev` watches and rebuilds during development.
