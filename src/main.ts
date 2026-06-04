/**
 * Shamsi Date Converter Plugin
 * Automatically converts Gregorian dates to Shamsi (Jalali/Persian) dates
 */

import { Plugin, TFile } from 'obsidian';
import { ShamsiDateConverterSettings, DEFAULT_SETTINGS } from './PluginSettings';
import { FileProcessor } from './FileProcessor';
import { ShamsiDateSettingTab } from './SettingsUI';

export default class ShamsiDateConverterPlugin extends Plugin {
    settings: ShamsiDateConverterSettings = DEFAULT_SETTINGS;

    async onload(): Promise<void> {
        console.log('Loading Shamsi Date Converter Plugin');

        // Load settings
        await this.loadSettings();

        // Add settings tab
        this.addSettingTab(new ShamsiDateSettingTab(this.app, this));

        // Register file modify event
        this.registerEvent(
            this.app.vault.on('modify', (file) => {
                this.handleFileModify(file);
            })
        );

        // Add command: Convert current file
        this.addCommand({
            id: 'convert-to-shamsi',
            name: 'Convert all date pairs to Shamsi',
            callback: () => {
                const activeFile = this.app.workspace.getActiveFile();
                if (activeFile) {
                    this.convertDateInFile(activeFile);
                }
            }
        });
    }

    onunload(): void {
        console.log('Unloading Shamsi Date Converter Plugin');
    }

    /**
     * Loads settings from plugin data
     */
    private async loadSettings(): Promise<void> {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    /**
     * Saves current settings to plugin data
     */
    async saveSettings(): Promise<void> {
        await this.saveData(this.settings);
    }

    /**
     * Handles file modification events
     */
    private async handleFileModify(file: unknown): Promise<void> {
        if (!this.settings.autoConvert) return;

        if (!(file instanceof TFile) || file.extension !== 'md') {
            return;
        }

        await this.convertDateInFile(file);
    }

    /**
     * Converts dates in a specific file
     */
    private async convertDateInFile(file: TFile): Promise<void> {
        const content = await this.app.vault.read(file);
        const updatedContent = FileProcessor.processFrontmatter(content, this.settings);

        if (updatedContent && updatedContent !== content) {
            await this.app.vault.modify(file, updatedContent);
        }
    }
}
