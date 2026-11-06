import {
	Plugin
} from 'obsidian';
import {
	DEFAULT_SETTINGS,
	Settings
} from './settings';


export default class Plugin_AxisMembershipGraph extends Plugin {
	settings!: Settings;

	async onload() {
		await this.loadSettings();
		// Write code here
	}

	onunload() { }

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<Settings>,
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
