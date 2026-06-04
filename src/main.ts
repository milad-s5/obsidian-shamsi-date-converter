import { Plugin, TFile } from 'obsidian';
import { ShamsiDateConverterSettings, DEFAULT_SETTINGS } from './PluginSettings';
import { FileProcessor } from './FileProcessor';
import { ShamsiDateSettingTab } from './SettingsUI';

export default class ShamsiDateConverterPlugin extends Plugin {
    settings: ShamsiDateConverterSettings = DEFAULT_SETTINGS;

    async onload(): Promise<void> {
        console.log('Loading Shamsi Date Converter Plugin');

        await this.loadSettings();
        this.addSettingTab(new ShamsiDateSettingTab(this.app, this));

        this.registerEvent(
            this.app.vault.on('modify', (file) => {
                this.handleFileModify(file);
            })
        );

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

    private async loadSettings(): Promise<void> {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings(): Promise<void> {
        await this.saveData(this.settings);
    }

    private async handleFileModify(file: unknown): Promise<void> {
        if (!this.settings.autoConvert) return;

        if (!(file instanceof TFile) || file.extension !== 'md') {
            return;
        }

        await this.convertDateInFile(file);
    }

    private async convertDateInFile(file: TFile): Promise<void> {
        const content = await this.app.vault.read(file);
        const updatedContent = FileProcessor.processFrontmatter(content, this.settings);

        if (updatedContent && updatedContent !== content) {
            await this.app.vault.modify(file, updatedContent);
        }
    }
}
