/**
 * PluginSettings - Manages plugin settings structure and defaults
 */

export interface DatePairMapping {
    source: string;
    target: string;
}

export interface ShamsiDateConverterSettings {
    autoConvert: boolean;
    datePairs: DatePairMapping[];
    dateFormat: string;
}

export const DEFAULT_SETTINGS: ShamsiDateConverterSettings = {
    autoConvert: true,
    datePairs: [
        { source: 'Watched on start', target: 'Shamsi start' },
        { source: 'Watched on end', target: 'Shamsi end' }
    ],
    dateFormat: 'YYYY/MM/DD'
};
