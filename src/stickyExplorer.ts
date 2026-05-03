import { App, Plugin } from "obsidian";
import {
	getStickyHeaderStyle,
	normalizeDepth,
	shouldEnhanceFolder,
} from "./stickyExplorerCore.mjs";

const FILE_EXPLORER_SELECTOR = '.workspace-leaf-content[data-type="file-explorer"] .nav-files-container';
const FOLDER_SELECTOR = ".nav-folder";
const FOLDER_TITLE_SELECTOR = ":scope > .nav-folder-title";
const ENHANCED_CLASS = "better-explorer-sticky-title";
const CONTAINER_CLASS = "better-explorer-sticky-container";

interface StickyCoreModule {
	getStickyHeaderStyle(options: { depth: number; headerHeight: number }): { top: string; zIndex: string };
	normalizeDepth(rawDepth: number): number;
	shouldEnhanceFolder(options: { isRoot: boolean; isCollapsed: boolean; hasTitle: boolean }): boolean;
}

const stickyCore = {
	getStickyHeaderStyle,
	normalizeDepth,
	shouldEnhanceFolder,
} as StickyCoreModule;

export class StickyExplorerController {
	private readonly app: App;
	private readonly plugin: Plugin;
	private observer: MutationObserver | null = null;

	constructor(app: App, plugin: Plugin) {
		this.app = app;
		this.plugin = plugin;
	}

	start(): void {
		this.refresh();

		this.plugin.registerEvent(
			this.app.workspace.on("layout-change", () => this.refresh())
		);
		this.plugin.registerEvent(
			this.app.workspace.on("file-menu", () => window.setTimeout(() => this.refresh(), 0))
		);
		this.plugin.registerEvent(
			this.app.vault.on("rename", () => this.refresh())
		);
		this.plugin.registerEvent(
			this.app.vault.on("create", () => this.refresh())
		);
		this.plugin.registerEvent(
			this.app.vault.on("delete", () => this.refresh())
		);
		this.plugin.registerDomEvent(document, "click", (event: MouseEvent) => {
			const target = event.target;
			if (target instanceof Element && target.closest(".nav-folder-title")) {
				window.setTimeout(() => this.refresh(), 0);
			}
		});

		this.observer = new MutationObserver(() => this.refresh());
		this.observer.observe(document.body, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ["class", "aria-expanded"],
		});
		this.plugin.register(() => this.stop());
	}

	stop(): void {
		this.observer?.disconnect();
		this.observer = null;
		this.clearAll();
	}

	refresh(): void {
		const containers = Array.from(document.querySelectorAll<HTMLElement>(FILE_EXPLORER_SELECTOR));
		for (const container of containers) {
			this.enhanceContainer(container);
		}
	}

	private enhanceContainer(container: HTMLElement): void {
		container.classList.add(CONTAINER_CLASS);
		const folders = Array.from(container.querySelectorAll<HTMLElement>(FOLDER_SELECTOR));

		for (const folder of folders) {
			const title = folder.querySelector<HTMLElement>(FOLDER_TITLE_SELECTOR);
			const isRoot = folder.classList.contains("mod-root");
			const isCollapsed = folder.classList.contains("is-collapsed") || title?.getAttribute("aria-expanded") === "false";

			if (!stickyCore.shouldEnhanceFolder({ isRoot, isCollapsed, hasTitle: title !== null })) {
				this.clearTitle(title);
				continue;
			}

			if (!title) {
				continue;
			}

			const depth = stickyCore.normalizeDepth(this.getRawFolderDepth(folder));
			const headerHeight = this.getHeaderHeight(title);
			const style = stickyCore.getStickyHeaderStyle({ depth, headerHeight });

			title.classList.add(ENHANCED_CLASS);
			title.style.setProperty("--better-explorer-sticky-top", style.top);
			title.style.setProperty("--better-explorer-sticky-z-index", style.zIndex);
			title.style.setProperty("--better-explorer-sticky-depth", `${depth}`);
		}
	}

	private getRawFolderDepth(folder: HTMLElement): number {
		let depth = 0;
		let current: Element | null = folder;

		while (current) {
			if (current.classList.contains("nav-folder") && !current.classList.contains("mod-root")) {
				depth += 1;
			}
			current = current.parentElement?.closest(".nav-folder") ?? null;
		}

		return depth;
	}

	private getHeaderHeight(title: HTMLElement): number {
		const height = title.getBoundingClientRect().height;
		if (Number.isFinite(height) && height > 0) {
			return Math.ceil(height);
		}
		return 24;
	}

	private clearAll(): void {
		for (const container of Array.from(document.querySelectorAll<HTMLElement>(`.${CONTAINER_CLASS}`))) {
			container.classList.remove(CONTAINER_CLASS);
		}
		for (const title of Array.from(document.querySelectorAll<HTMLElement>(`.${ENHANCED_CLASS}`))) {
			this.clearTitle(title);
		}
	}

	private clearTitle(title: HTMLElement | null): void {
		if (!title) {
			return;
		}
		title.classList.remove(ENHANCED_CLASS);
		title.style.removeProperty("--better-explorer-sticky-top");
		title.style.removeProperty("--better-explorer-sticky-z-index");
		title.style.removeProperty("--better-explorer-sticky-depth");
	}
}
