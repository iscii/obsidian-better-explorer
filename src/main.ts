import { Plugin } from "obsidian";
import { StickyExplorerController } from "./stickyExplorer";

export default class BetterExplorerPlugin extends Plugin {
	private controller: StickyExplorerController | null = null;

	onload(): void {
		this.controller = new StickyExplorerController(this.app, this);
		this.controller.start();
	}

	onunload(): void {
		this.controller?.stop();
		this.controller = null;
	}
}
