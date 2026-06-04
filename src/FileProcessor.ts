/**
 * FileProcessor - Handles reading, parsing, and updating markdown files
 */

import { DateConverter } from './DateConverter';
import { ShamsiDateConverterSettings, DatePairMapping } from './PluginSettings';

export interface DatePairUpdate {
    needsUpdate: boolean;
    action?: 'update' | 'insert';
    targetLine?: number;
    insertAfter?: number;
    newValue?: string;
}

export class FileProcessor {
    /**
     * Processes a markdown file and converts dates according to settings
     * @param content - The file content
     * @param settings - The plugin settings
     * @returns Updated content or null if no changes needed
     */
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

        // Check if frontmatter has any relevant properties
        const hasRelevantProperty = settings.datePairs.some(pair =>
            frontmatter.includes(`${pair.source}:`)
        );

        if (!hasRelevantProperty) {
            return null;
        }

        const lines = frontmatter.split('\n');
        let needsUpdate = false;
        const updates: DatePairUpdate[] = [];

        // Process each date pair mapping
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

        // Apply updates in reverse order to maintain line indices
        for (let i = updates.length - 1; i >= 0; i--) {
            const update = updates[i];
            if (update.action === 'update' && update.targetLine !== undefined && update.newValue) {
                lines[update.targetLine] = update.newValue;
            } else if (update.action === 'insert' && update.insertAfter !== undefined && update.newValue) {
                lines.splice(update.insertAfter + 1, 0, update.newValue);
            }
        }

        const newFrontmatter = lines.join('\n');
        return content.replace(frontmatterRegex, `---\n${newFrontmatter}\n---`);
    }

    /**
     * Processes a date pair and returns update instructions
     */
    static procesDatePair(
        lines: string[],
        sourceProperty: string,
        targetProperty: string,
        dateFormat: string
    ): DatePairUpdate {
        let sourceDate: Date | null = null;
        let sourcePropertyLine = -1;
        let targetPropertyLine = -1;

        // Find source and target property lines
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

        if (!sourceDate || sourcePropertyLine === -1) {
            return { needsUpdate: false };
        }

        // Convert Gregorian to Shamsi
        const shamsiDate = DateConverter.gregorianToShamsi(sourceDate);
        const shamsiString = DateConverter.formatShamsiDate(shamsiDate, dateFormat);
        const shamsiLine = `${targetProperty}: ${shamsiString}`;

        // Return update instruction
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
