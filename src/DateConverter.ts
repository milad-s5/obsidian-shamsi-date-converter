/**
 * DateConverter - Handles Gregorian to Shamsi date conversion
 */

export interface ShamsiDate {
    year: number;
    month: number;
    day: number;
}

export class DateConverter {
    /**
     * Converts a Gregorian date to Shamsi (Jalali) calendar
     * @param gregorianDate - The Gregorian date to convert
     * @returns ShamsiDate object with year, month, and day
     */
    static gregorianToShamsi(gregorianDate: Date): ShamsiDate {
        const gy = gregorianDate.getFullYear();
        const gm = gregorianDate.getMonth() + 1;
        const gd = gregorianDate.getDate();

        const g_d_n = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
        
        let jy: number;
        let gy2: number;
        let jm: number;
        let jd: number;

        if (gy > 1600) {
            jy = 979;
            gy = gy - 1600;
        } else {
            jy = 0;
            gy = gy - 979;
        }

        if (gm > 2) {
            gy2 = gy + 1;
        } else {
            gy2 = gy;
        }

        const days =
            365 * gy +
            Math.floor((gy2 + 3) / 4) -
            Math.floor((gy2 + 99) / 100) +
            Math.floor((gy2 + 399) / 400) -
            80 +
            gd +
            g_d_n[gm - 1];

        jy += 33 * Math.floor(days / 12053);
        let daysRemainder = days % 12053;

        jy += 4 * Math.floor(daysRemainder / 1461);
        daysRemainder = daysRemainder % 1461;

        if (daysRemainder > 365) {
            jy += Math.floor((daysRemainder - 1) / 365);
            daysRemainder = (daysRemainder - 1) % 365;
        }

        if (daysRemainder < 186) {
            jm = 1 + Math.floor(daysRemainder / 31);
            jd = 1 + (daysRemainder % 31);
        } else {
            jm = 7 + Math.floor((daysRemainder - 186) / 30);
            jd = 1 + ((daysRemainder - 186) % 30);
        }

        return { year: jy, month: jm, day: jd };
    }

    /**
     * Parses a date string to a Date object
     * @param dateString - The date string to parse
     * @returns Date object or null if parsing fails
     */
    static parseDate(dateString: string): Date | null {
        const cleanedString = dateString.replace(/['"]/g, '').trim();

        if (!cleanedString) {
            return null;
        }

        const date = new Date(cleanedString);

        if (isNaN(date.getTime())) {
            return null;
        }

        return date;
    }

    /**
     * Formats a Shamsi date according to the specified format
     * @param shamsiDate - The Shamsi date to format
     * @param format - The format string (e.g., 'YYYY/MM/DD')
     * @returns Formatted date string
     */
    static formatShamsiDate(shamsiDate: ShamsiDate, format: string): string {
        const { year, month, day } = shamsiDate;
        const paddedMonth = String(month).padStart(2, '0');
        const paddedDay = String(day).padStart(2, '0');

        return format
            .replace('YYYY', String(year))
            .replace('MM', paddedMonth)
            .replace('DD', paddedDay);
    }
}
