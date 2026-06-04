import { FileProcessor } from '../FileProcessor';
import { ShamsiDateConverterSettings } from '../PluginSettings';

describe('FileProcessor', () => {
    const mockSettings: ShamsiDateConverterSettings = {
        autoConvert: true,
        datePairs: [
            { source: 'Watched on start', target: 'Shamsi start' },
            { source: 'Watched on end', target: 'Shamsi end' }
        ],
        dateFormat: 'YYYY/MM/DD'
    };

    describe('processFrontmatter', () => {
        it('should return null if content does not start with frontmatter', () => {
            const content = 'No frontmatter here\n---\n';
            const result = FileProcessor.processFrontmatter(content, mockSettings);
            expect(result).toBeNull();
        });

        it('should return null if no relevant properties found', () => {
            const content = '---\nsome: value\n---\n# Content';
            const result = FileProcessor.processFrontmatter(content, mockSettings);
            expect(result).toBeNull();
        });

        it('should process frontmatter with source date and add target date', () => {
            const content = '---\nWatched on start: 2025-09-30\n---\n# Content';
            const result = FileProcessor.processFrontmatter(content, mockSettings);

            expect(result).not.toBeNull();
            expect(result).toContain('Watched on start: 2025-09-30');
            expect(result).toContain('Shamsi start: 1404/07/08');
        });

        it('should update existing Shamsi date if changed', () => {
            const content = '---\nWatched on start: 2025-09-30\nShamsi start: 1403/01/01\n---\n';
            const result = FileProcessor.processFrontmatter(content, mockSettings);

            expect(result).not.toBeNull();
            expect(result).toContain('Shamsi start: 1404/07/08');
            expect(result).not.toContain('Shamsi start: 1403/01/01');
        });

        it('should handle multiple date pair mappings', () => {
            const content = `---
Watched on start: 2025-09-30
Watched on end: 2026-02-17
---
`;
            const result = FileProcessor.processFrontmatter(content, mockSettings);

            expect(result).not.toBeNull();
            expect(result).toContain('Shamsi start: 1404/07/08');
            expect(result).toContain('Shamsi end: 1404/11/28');
        });

        it('should preserve other frontmatter properties', () => {
            const content = `---
title: My Movie
Watched on start: 2025-09-30
rating: 8/10
---
`;
            const result = FileProcessor.processFrontmatter(content, mockSettings);

            expect(result).not.toBeNull();
            expect(result).toContain('title: My Movie');
            expect(result).toContain('rating: 8/10');
            expect(result).toContain('Shamsi start: 1404/07/08');
        });

        it('should clear stale target date when source is cleared', () => {
            const content = `---
Watched on start:
Shamsi start: 1404/07/08
---
`;
            const result = FileProcessor.processFrontmatter(content, mockSettings);

            expect(result).not.toBeNull();
            expect(result).toContain('Shamsi start:');
            expect(result).not.toContain('Shamsi start: 1404/07/08');
            expect(result).toContain('Watched on start:');
        });

        it('should handle different date formats', () => {
            const content = `---
Watched on start: 2025/09/30
---
`;
            const result = FileProcessor.processFrontmatter(content, mockSettings);

            expect(result).not.toBeNull();
            expect(result).toContain('Shamsi start: 1404/07/08');
        });
    });

    describe('procesDatePair', () => {
        it('should return needsUpdate false if source date not found and target absent', () => {
            const lines = ['title: Movie', 'rating: 8'];
            const result = FileProcessor.procesDatePair(
                lines,
                'Watched on start',
                'Shamsi start',
                'YYYY/MM/DD'
            );

            expect(result.needsUpdate).toBe(false);
        });

        it('should return update action clearing value if source date is cleared and target exists', () => {
            const lines = ['Watched on start:', 'Shamsi start: 1404/07/08'];
            const result = FileProcessor.procesDatePair(
                lines,
                'Watched on start',
                'Shamsi start',
                'YYYY/MM/DD'
            );

            expect(result.needsUpdate).toBe(true);
            expect(result.action).toBe('update');
            expect(result.targetLine).toBe(1);
            expect(result.newValue).toBe('Shamsi start:');
        });

        it('should return update action clearing value if source is missing and target exists', () => {
            const lines = ['Shamsi start: 1404/07/08'];
            const result = FileProcessor.procesDatePair(
                lines,
                'Watched on start',
                'Shamsi start',
                'YYYY/MM/DD'
            );

            expect(result.needsUpdate).toBe(true);
            expect(result.action).toBe('update');
            expect(result.targetLine).toBe(0);
            expect(result.newValue).toBe('Shamsi start:');
        });

        it('should return insert action if target does not exist', () => {
            const lines = ['Watched on start: 2025-09-30'];
            const result = FileProcessor.procesDatePair(
                lines,
                'Watched on start',
                'Shamsi start',
                'YYYY/MM/DD'
            );

            expect(result.needsUpdate).toBe(true);
            expect(result.action).toBe('insert');
            expect(result.newValue).toBe('Shamsi start: 1404/07/08');
        });

        it('should return update action if target exists and changed', () => {
            const lines = [
                'Watched on start: 2025-09-30',
                'Shamsi start: 1403/01/01'
            ];
            const result = FileProcessor.procesDatePair(
                lines,
                'Watched on start',
                'Shamsi start',
                'YYYY/MM/DD'
            );

            expect(result.needsUpdate).toBe(true);
            expect(result.action).toBe('update');
            expect(result.targetLine).toBe(1);
        });

        it('should return needsUpdate false if target matches', () => {
            const lines = [
                'Watched on start: 2025-09-30',
                'Shamsi start: 1404/07/08'
            ];
            const result = FileProcessor.procesDatePair(
                lines,
                'Watched on start',
                'Shamsi start',
                'YYYY/MM/DD'
            );

            expect(result.needsUpdate).toBe(false);
        });

        it('should insert blank target if source date is invalid and target does not exist', () => {
            const lines = ['Watched on start: invalid-date'];
            const result = FileProcessor.procesDatePair(
                lines,
                'Watched on start',
                'Shamsi start',
                'YYYY/MM/DD'
            );

            expect(result.needsUpdate).toBe(true);
            expect(result.action).toBe('insert');
            expect(result.newValue).toBe('Shamsi start:');
        });
    });
});
