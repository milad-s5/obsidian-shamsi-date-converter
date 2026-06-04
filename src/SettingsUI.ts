/**
 * SettingsUI - Handles the plugin settings tab UI
 */

import { App, PluginSettingTab, Setting } from 'obsidian';
import ShamsiDateConverterPlugin from './main';

export class ShamsiDateSettingTab extends PluginSettingTab {
    plugin: ShamsiDateConverterPlugin;
    private isAddingPair = false;
    private isEditingIndex = -1;

    constructor(app: App, plugin: ShamsiDateConverterPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: 'Shamsi Date Converter Settings' });

        this.addAutoConvertToggle();
        this.addDateFormatSetting();
        this.addDatePairMappings();
    }

    private addAutoConvertToggle(): void {
        const { containerEl } = this;

        new Setting(containerEl)
            .setName('Auto-convert')
            .setDesc('Automatically convert dates when file is modified')
            .addToggle(toggle =>
                toggle
                    .setValue(this.plugin.settings.autoConvert)
                    .onChange(async (value) => {
                        this.plugin.settings.autoConvert = value;
                        await this.plugin.saveSettings();
                    })
            );
    }

    private addDateFormatSetting(): void {
        const { containerEl } = this;

        new Setting(containerEl)
            .setName('Date format')
            .setDesc('Format for Shamsi date (YYYY/MM/DD or YYYY-MM-DD)')
            .addText(text =>
                text
                    .setPlaceholder('YYYY/MM/DD')
                    .setValue(this.plugin.settings.dateFormat)
                    .onChange(async (value) => {
                        this.plugin.settings.dateFormat = value;
                        await this.plugin.saveSettings();
                    })
            );
    }

    private addDatePairMappings(): void {
        const { containerEl } = this;

        if (this.isAddingPair) {
            this.showAddPairForm();
            return;
        }

        if (this.isEditingIndex >= 0) {
            this.showEditPairForm(this.isEditingIndex);
            return;
        }

        containerEl.createEl('h3', { text: 'Date Pair Mappings' });
        containerEl.createEl('p', {
            text: 'Configure which Gregorian date properties should be converted to Shamsi dates.',
            cls: 'setting-item-description'
        });

        this.plugin.settings.datePairs.forEach((pair, index) => {
            new Setting(containerEl)
                .setName(`Pair ${index + 1}`)
                .setDesc(`Convert "${pair.source}" to "${pair.target}"`)
                .addButton(button =>
                    button
                        .setButtonText('Edit')
                        .onClick(() => {
                            this.isEditingIndex = index;
                            this.display();
                        })
                )
                .addButton(button =>
                    button
                        .setButtonText('Delete')
                        .setWarning()
                        .onClick(async () => {
                            this.plugin.settings.datePairs.splice(index, 1);
                            await this.plugin.saveSettings();
                            this.display();
                        })
                );
        });

        new Setting(containerEl)
            .addButton(button =>
                button
                    .setButtonText('Add Date Pair')
                    .setCta()
                    .onClick(() => {
                        this.isAddingPair = true;
                        this.display();
                    })
            );
    }

    private showAddPairForm(): void {
        const { containerEl } = this;

        containerEl.createEl('h2', { text: 'Add New Date Pair' });

        let sourceValue = '';
        let targetValue = '';

        new Setting(containerEl)
            .setName('Source property name')
            .setDesc('The property containing the Gregorian date (e.g., "Watched on start")')
            .addText(text =>
                text
                    .setPlaceholder('Watched on start')
                    .onChange((value) => {
                        sourceValue = value;
                    })
            );

        new Setting(containerEl)
            .setName('Target property name')
            .setDesc('The property to store the Shamsi date (e.g., "Shamsi start")')
            .addText(text =>
                text
                    .setPlaceholder('Shamsi start')
                    .onChange((value) => {
                        targetValue = value;
                    })
            );

        new Setting(containerEl)
            .addButton(button =>
                button
                    .setButtonText('Save')
                    .setCta()
                    .onClick(async () => {
                        if (sourceValue && targetValue) {
                            this.plugin.settings.datePairs.push({
                                source: sourceValue,
                                target: targetValue
                            });
                            await this.plugin.saveSettings();
                            this.isAddingPair = false;
                            this.display();
                        }
                    })
            )
            .addButton(button =>
                button
                    .setButtonText('Cancel')
                    .onClick(() => {
                        this.isAddingPair = false;
                        this.display();
                    })
            );
    }

    private showEditPairForm(index: number): void {
        const { containerEl } = this;
        const pair = this.plugin.settings.datePairs[index];

        containerEl.createEl('h2', { text: `Edit Date Pair ${index + 1}` });

        let sourceValue = pair.source;
        let targetValue = pair.target;

        new Setting(containerEl)
            .setName('Source property name')
            .setDesc('The property containing the Gregorian date')
            .addText(text =>
                text
                    .setValue(sourceValue)
                    .onChange((value) => {
                        sourceValue = value;
                    })
            );

        new Setting(containerEl)
            .setName('Target property name')
            .setDesc('The property to store the Shamsi date')
            .addText(text =>
                text
                    .setValue(targetValue)
                    .onChange((value) => {
                        targetValue = value;
                    })
            );

        new Setting(containerEl)
            .addButton(button =>
                button
                    .setButtonText('Save')
                    .setCta()
                    .onClick(async () => {
                        if (sourceValue && targetValue) {
                            this.plugin.settings.datePairs[index] = {
                                source: sourceValue,
                                target: targetValue
                            };
                            await this.plugin.saveSettings();
                            this.isEditingIndex = -1;
                            this.display();
                        }
                    })
            )
            .addButton(button =>
                button
                    .setButtonText('Cancel')
                    .onClick(() => {
                        this.isEditingIndex = -1;
                        this.display();
                    })
            );
    }
}
