import { DateConverter } from './DateConverter';
import { ShamsiDateConverterSettings } from './PluginSettings';

export interface DatePairUpdate {
    needsUpdate: boolean;
    action?: 'update' | 'insert';
    targetLine?: number;
    insertAfter?: number;
    newValue?: string;
}

export class FileProcessor {
    static processFrontmatter(content: string, settings: ShamsiDateConverterSettings): string | null {
        if (!content.startsWith('---\n')) {
            return null;
        }

        const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
        const match = content.match(frontmatterRegex);

        if (!match) {
            return null;
        }

        const frontmatter = match[1];
        const hasRelevantProperty = settings.datePairs.some(pair =>
            frontmatter.includes(`${pair.source}:`) || frontmatter.includes(`${pair.target}:`)
        );

        if (!hasRelevantProperty) {
            return null;
        }

        const lines = frontmatter.split('\n');
        let needsUpdate = false;
        const updates: DatePairUpdate[] = [];

        for (const pair of settings.datePairs) {
            const result = FileProcessor.procesDatePair(
                lines,
                pair.source,
                pair.target,
                settings.dateFormat
            );

            if (result.needsUpdate) {
                needsUpdate = true;
                updates.push(result);
            }
        }

        if (!needsUpdate) {
            return null;
        }

        const sortedUpdates = updates.slice().sort((a, b) => {
            const aIndex = a.action === 'insert' ? a.insertAfter ?? -1 : a.targetLine ?? -1;
            const bIndex = b.action === 'insert' ? b.insertAfter ?? -1 : b.targetLine ?? -1;
            return bIndex - aIndex;
        });

        for (const update of sortedUpdates) {
            if (update.action === 'update' && update.targetLine !== undefined && update.newValue !== undefined) {
                lines[update.targetLine] = update.newValue;
            } else if (update.action === 'insert' && update.insertAfter !== undefined && update.newValue) {
                lines.splice(update.insertAfter + 1, 0, update.newValue);
            }
        }

        const newFrontmatter = lines.join('\n');
        return content.replace(frontmatterRegex, `---\n${newFrontmatter}\n---`);
    }

    static procesDatePair(
        lines: string[],
        sourceProperty: string,
        targetProperty: string,
        dateFormat: string
    ): DatePairUpdate {
        let sourceDate: Date | null = null;
        let sourcePropertyLine = -1;
        let targetPropertyLine = -1;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            if (line.startsWith(`${sourceProperty}:`)) {
                sourcePropertyLine = i;
                const sourceMatch = line.match(new RegExp(`^${sourceProperty}:\\s*(.+)$`));
                if (sourceMatch) {
                    sourceDate = DateConverter.parseDate(sourceMatch[1].trim());
                }
            }

            if (line.startsWith(`${targetProperty}:`)) {
                targetPropertyLine = i;
            }
        }

        const blankShamsiLine = `${targetProperty}:`;

        if (sourcePropertyLine === -1) {
            if (targetPropertyLine !== -1) {
                if (lines[targetPropertyLine] !== blankShamsiLine) {
                    return {
                        needsUpdate: true,
                        action: 'update',
                        targetLine: targetPropertyLine,
                        newValue: blankShamsiLine
                    };
                }
            }
            return { needsUpdate: false };
        }

        if (!sourceDate) {
            if (targetPropertyLine !== -1) {
                if (lines[targetPropertyLine] !== blankShamsiLine) {
                    return {
                        needsUpdate: true,
                        action: 'update',
                        targetLine: targetPropertyLine,
                        newValue: blankShamsiLine
                    };
                }
                return { needsUpdate: false };
            }
            return {
                needsUpdate: true,
                action: 'insert',
                insertAfter: sourcePropertyLine,
                newValue: blankShamsiLine
            };
        }

        const shamsiDate = DateConverter.gregorianToShamsi(sourceDate);
        const shamsiString = DateConverter.formatShamsiDate(shamsiDate, dateFormat);
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
}
