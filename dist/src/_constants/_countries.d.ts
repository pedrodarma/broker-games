interface Country {
    name: string;
    native: string;
    phone: number[];
    continent: string;
    capital: string;
    currency: string[];
    languages: string[];
    continents?: string[];
}
export declare const countries: Record<string, Country>;
export {};
