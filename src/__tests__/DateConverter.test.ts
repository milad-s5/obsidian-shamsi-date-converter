/**
 * Unit tests for DateConverter module
 */

import { DateConverter, ShamsiDate } from '../DateConverter';

describe('DateConverter', () => {
    describe('parseDate', () => {
        it('should parse valid ISO date strings', () => {
            const date = DateConverter.parseDate('2025-09-30');
            expect(date).toBeInstanceOf(Date);
            expect(date?.getFullYear()).toBe(2025);
            expect(date?.getMonth()).toBe(8); // 0-indexed
            expect(date?.getDate()).toBe(30);
        });

        it('should parse dates with quotes', () => {
            const date = DateConverter.parseDate('"2025-09-30"');
            expect(date).toBeInstanceOf(Date);
            expect(date?.getFullYear()).toBe(2025);
        });

        it('should handle whitespace', () => {
            const date = DateConverter.parseDate('  2025-09-30  ');
            expect(date).toBeInstanceOf(Date);
            expect(date?.getFullYear()).toBe(2025);
        });

        it('should return null for invalid dates', () => {
            expect(DateConverter.parseDate('invalid-date')).toBeNull();
            expect(DateConverter.parseDate('')).toBeNull();
            expect(DateConverter.parseDate('   ')).toBeNull();
        });

        it('should parse common date formats', () => {
            const date1 = DateConverter.parseDate('2025/09/30');
            const date2 = DateConverter.parseDate('09/30/2025');
            const date3 = DateConverter.parseDate('September 30, 2025');

            expect(date1).toBeInstanceOf(Date);
            expect(date2).toBeInstanceOf(Date);
            expect(date3).toBeInstanceOf(Date);
        });
    });

    describe('gregorianToShamsi', () => {
        it('should convert Gregorian dates to Shamsi correctly', () => {
            // Test case: 2025-09-30 should be 1404/07/08
            const gregorianDate = new Date(2025, 8, 30); // Month is 0-indexed
            const shamsiDate = DateConverter.gregorianToShamsi(gregorianDate);

            expect(shamsiDate.year).toBe(1404);
            expect(shamsiDate.month).toBe(7);
            expect(shamsiDate.day).toBe(8);
        });

        it('should convert dates from different years', () => {
            // Test: 2020-03-20 should be 1399/01/01
            const gregorianDate = new Date(2020, 2, 20);
            const shamsiDate = DateConverter.gregorianToShamsi(gregorianDate);

            expect(shamsiDate.year).toBe(1399);
            expect(shamsiDate.month).toBe(1);
            expect(shamsiDate.day).toBe(1);
        });

        it('should handle leap years correctly', () => {
            // 2024 is a leap year
            const gregorianDate = new Date(2024, 1, 29); // Feb 29
            const shamsiDate = DateConverter.gregorianToShamsi(gregorianDate);

            // Should convert without errors
            expect(shamsiDate.year).toBeGreaterThan(0);
            expect(shamsiDate.month).toBeGreaterThan(0);
            expect(shamsiDate.day).toBeGreaterThan(0);
        });

        it('should return object with year, month, day properties', () => {
            const gregorianDate = new Date(2025, 8, 30);
            const shamsiDate = DateConverter.gregorianToShamsi(gregorianDate);

            expect(shamsiDate).toHaveProperty('year');
            expect(shamsiDate).toHaveProperty('month');
            expect(shamsiDate).toHaveProperty('day');
            expect(typeof shamsiDate.year).toBe('number');
            expect(typeof shamsiDate.month).toBe('number');
            expect(typeof shamsiDate.day).toBe('number');
        });
    });

    describe('formatShamsiDate', () => {
        const testDate: ShamsiDate = { year: 1404, month: 7, day: 8 };

        it('should format with YYYY/MM/DD pattern', () => {
            const formatted = DateConverter.formatShamsiDate(testDate, 'YYYY/MM/DD');
            expect(formatted).toBe('1404/07/08');
        });

        it('should format with YYYY-MM-DD pattern', () => {
            const formatted = DateConverter.formatShamsiDate(testDate, 'YYYY-MM-DD');
            expect(formatted).toBe('1404-07-08');
        });

        it('should pad single-digit months and days', () => {
            const date: ShamsiDate = { year: 1404, month: 1, day: 1 };
            const formatted = DateConverter.formatShamsiDate(date, 'YYYY/MM/DD');
            expect(formatted).toBe('1404/01/01');
        });

        it('should handle custom format patterns', () => {
            const formatted = DateConverter.formatShamsiDate(testDate, 'DD/MM/YYYY');
            expect(formatted).toBe('08/07/1404');
        });

        it('should not pad year even if custom', () => {
            const formatted = DateConverter.formatShamsiDate(testDate, 'YYYY');
            expect(formatted).toBe('1404');
        });
    });

    describe('integration tests', () => {
        it('should parse a date and convert it to Shamsi in one flow', () => {
            const dateString = '2025-09-30';
            const parsed = DateConverter.parseDate(dateString);
            
            expect(parsed).not.toBeNull();
            
            if (parsed) {
                const shamsi = DateConverter.gregorianToShamsi(parsed);
                const formatted = DateConverter.formatShamsiDate(shamsi, 'YYYY/MM/DD');
                
                expect(formatted).toBe('1404/07/08');
            }
        });

        it('should handle invalid date gracefully in full flow', () => {
            const dateString = 'invalid';
            const parsed = DateConverter.parseDate(dateString);
            
            expect(parsed).toBeNull();
        });
    });
});
