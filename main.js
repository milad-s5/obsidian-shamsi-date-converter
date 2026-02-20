const { Plugin, PluginSettingTab, Setting } = require('obsidian');

module.exports = class ShamsiDateConverterPlugin extends Plugin {
    async onload() {
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

    async loadSettings() {
        this.settings = Object.assign({
            autoConvert: true,
            datePairs: [
                { source: 'Watched on start', target: 'Shamsi start' },
                { source: 'Watched on end', target: 'Shamsi end' }
            ],
            dateFormat: 'YYYY/MM/DD'
        }, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    async handleFileModify(file) {
        if (!this.settings.autoConvert) return;
        if (!file || file.extension !== 'md') return;

        await this.convertDateInFile(file);
    }

    async convertDateInFile(file) {
        const content = await this.app.vault.read(file);
        
        if (!content.startsWith('---\n')) return;

        const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
        const match = content.match(frontmatterRegex);
        if (!match) return;

        const frontmatter = match[1];
        
        const hasRelevantProperty = this.settings.datePairs.some(pair => 
            frontmatter.includes(`${pair.source}:`)
        );
        
        if (!hasRelevantProperty) return;

        const lines = frontmatter.split('\n');
        let needsUpdate = false;
        const updates = [];

        for (const pair of this.settings.datePairs) {
            const result = this.procesDatePair(lines, pair.source, pair.target);
            if (result.needsUpdate) {
                needsUpdate = true;
                updates.push(result);
            }
        }

        if (needsUpdate) {
            for (const update of updates) {
                if (update.action === 'update') {
                    lines[update.targetLine] = update.newValue;
                } else if (update.action === 'insert') {
                    lines.splice(update.insertAfter + 1, 0, update.newValue);
                }
            }

            const newFrontmatter = lines.join('\n');
            const newContent = content.replace(frontmatterRegex, `---\n${newFrontmatter}\n---`);
            
            await this.app.vault.modify(file, newContent);
        }
    }

    procesDatePair(lines, sourceProperty, targetProperty) {
        let sourceDate = null;
        let sourcePropertyLine = -1;
        let targetPropertyLine = -1;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            if (line.startsWith(`${sourceProperty}:`)) {
                sourcePropertyLine = i;
                const sourceMatch = line.match(new RegExp(`^${sourceProperty}:\\s*(.+)$`));
                if (sourceMatch) {
                    sourceDate = this.parseDate(sourceMatch[1].trim());
                }
            }

            if (line.startsWith(`${targetProperty}:`)) {
                targetPropertyLine = i;
            }
        }

        if (!sourceDate || sourcePropertyLine === -1) {
            return { needsUpdate: false };
        }

        const shamsiDate = this.gregorianToShamsi(sourceDate);
        const shamsiString = this.formatShamsiDate(shamsiDate);
        const shamsiLine = `${targetProperty}: ${shamsiString}`;

        if (targetPropertyLine !== -1) {
            if (lines[targetPropertyLine] !== shamsiLine) {
                return {
                    needsUpdate: true,
                    action: 'update',
                    targetLine: targetPropertyLine,
                    newValue: shamsiLine
                };
            }
            return { needsUpdate: false };
        }

        return {
            needsUpdate: true,
            action: 'insert',
            insertAfter: sourcePropertyLine,
            newValue: shamsiLine
        };
    }

    parseDate(dateString) {
        dateString = dateString.replace(/['"]/g, '').trim();        
        if (!dateString || dateString === '') return null;
        
        const date = new Date(dateString);
        
        if (isNaN(date.getTime())) {
            return null;
        }
        
        return date;
    }

    gregorianToShamsi(gDate) {
        var gy = gDate.getFullYear();
        var gm = gDate.getMonth() + 1;
        var gd = gDate.getDate();
        var g_d_n = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
        var jy;
        var gy2;
        var jm;
        var jd;
        
        if (gy > 1600) {
            jy = 979;
            gy -= 1600;
        } else {
            jy = 0;
            gy -= 979;
        }
        
        if (gm > 2) {
            gy2 = gy + 1;
        } else {
            gy2 = gy;
        }
        
        var days = (365 * gy) + (Math.floor((gy2 + 3) / 4)) - (Math.floor((gy2 + 99) / 100)) + (Math.floor((gy2 + 399) / 400)) - 80 + gd + g_d_n[gm - 1];
        jy += 33 * Math.floor(days / 12053);
        days %= 12053;
        jy += 4 * Math.floor(days / 1461);
        days %= 1461;
        
        if (days > 365) {
            jy += Math.floor((days - 1) / 365);
            days = (days - 1) % 365;
        }
        
        if (days < 186) {
            jm = 1 + Math.floor(days / 31);
            jd = 1 + (days % 31);
        } else {
            jm = 7 + Math.floor((days - 186) / 30);
            jd = 1 + ((days - 186) % 30);
        }
        
        return {
            year: jy,
            month: jm,
            day: jd
        };
    }

    formatShamsiDate(shamsiDate) {
        const { year, month, day } = shamsiDate;
        const paddedMonth = String(month).padStart(2, '0');
        const paddedDay = String(day).padStart(2, '0');
        
        return this.settings.dateFormat
            .replace('YYYY', year)
            .replace('MM', paddedMonth)
            .replace('DD', paddedDay);
    }

    onunload() {
        console.log('Unloading Shamsi Date Converter Plugin');
    }
};

class ShamsiDateSettingTab extends PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display() {
        const { containerEl } = this;
        containerEl.empty();
        
        containerEl.createEl('h2', { text: 'Shamsi Date Converter Settings' });

        new Setting(containerEl)
            .setName('Auto-convert')
            .setDesc('Automatically convert dates when file is modified')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.autoConvert)
                .onChange(async (value) => {
                    this.plugin.settings.autoConvert = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Date format')
            .setDesc('Format for Shamsi date (YYYY/MM/DD or YYYY-MM-DD)')
            .addText(text => text
                .setPlaceholder('YYYY/MM/DD')
                .setValue(this.plugin.settings.dateFormat)
                .onChange(async (value) => {
                    this.plugin.settings.dateFormat = value;
                    await this.plugin.saveSettings();
                }));

        containerEl.createEl('h3', { text: 'Date Pair Mappings' });
        containerEl.createEl('p', { 
            text: 'Configure which Gregorian date properties should be converted to Shamsi dates.',
            cls: 'setting-item-description'
        });

        this.plugin.settings.datePairs.forEach((pair, index) => {
            new Setting(containerEl)
                .setName(`Pair ${index + 1}`)
                .setDesc(`Convert "${pair.source}" to "${pair.target}"`)
                .addButton(button => button
                    .setButtonText('Edit')
                    .onClick(() => {
                        this.editDatePair(index);
                    }))
                .addButton(button => button
                    .setButtonText('Delete')
                    .setWarning()
                    .onClick(async () => {
                        this.plugin.settings.datePairs.splice(index, 1);
                        await this.plugin.saveSettings();
                        this.display();
                    }));
        });

        new Setting(containerEl)
            .addButton(button => button
                .setButtonText('Add Date Pair')
                .setCta()
                .onClick(() => {
                    this.addDatePair();
                }));
    }

    addDatePair() {
        const { containerEl } = this;
        containerEl.empty();
        
        containerEl.createEl('h2', { text: 'Add New Date Pair' });

        let sourceValue = '';
        let targetValue = '';

        new Setting(containerEl)
            .setName('Source property name')
            .setDesc('The property containing the Gregorian date (e.g., "Watched on start")')
            .addText(text => text
                .setPlaceholder('Watched on start')
                .onChange((value) => {
                    sourceValue = value;
                }));

        new Setting(containerEl)
            .setName('Target property name')
            .setDesc('The property to store the Shamsi date (e.g., "Shamsi start")')
            .addText(text => text
                .setPlaceholder('Shamsi start')
                .onChange((value) => {
                    targetValue = value;
                }));

        new Setting(containerEl)
            .addButton(button => button
                .setButtonText('Save')
                .setCta()
                .onClick(async () => {
                    if (sourceValue && targetValue) {
                        this.plugin.settings.datePairs.push({
                            source: sourceValue,
                            target: targetValue
                        });
                        await this.plugin.saveSettings();
                        this.display();
                    }
                }))
            .addButton(button => button
                .setButtonText('Cancel')
                .onClick(() => {
                    this.display();
                }));
    }

    editDatePair(index) {
        const { containerEl } = this;
        containerEl.empty();
        
        containerEl.createEl('h2', { text: `Edit Date Pair ${index + 1}` });

        const pair = this.plugin.settings.datePairs[index];
        let sourceValue = pair.source;
        let targetValue = pair.target;

        new Setting(containerEl)
            .setName('Source property name')
            .setDesc('The property containing the Gregorian date')
            .addText(text => text
                .setPlaceholder('Watched on start')
                .setValue(sourceValue)
                .onChange((value) => {
                    sourceValue = value;
                }));

        new Setting(containerEl)
            .setName('Target property name')
            .setDesc('The property to store the Shamsi date')
            .addText(text => text
                .setPlaceholder('Shamsi start')
                .setValue(targetValue)
                .onChange((value) => {
                    targetValue = value;
                }));

        new Setting(containerEl)
            .addButton(button => button
                .setButtonText('Save')
                .setCta()
                .onClick(async () => {
                    if (sourceValue && targetValue) {
                        this.plugin.settings.datePairs[index] = {
                            source: sourceValue,
                            target: targetValue
                        };
                        await this.plugin.saveSettings();
                        this.display();
                    }
                }))
            .addButton(button => button
                .setButtonText('Cancel')
                .onClick(() => {
                    this.display();
                }));
    }
}
