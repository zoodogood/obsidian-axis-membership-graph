import { App, PluginSettingTab } from 'obsidian';
import Plugin from './main';

export type Settings = {
	[key: string]: unknown;
};

export const DEFAULT_SETTINGS: Settings = {};

export class SettingTab extends PluginSettingTab {
	plugin: Plugin;

	constructor(app: App, plugin: Plugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {

	}
}
