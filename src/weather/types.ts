export enum Verdict {
    Freezing = "Time to bring out that heavy jacket or coat!",
    Cold = "Pants and a jacket!",
    Moderate = "Light jacket, maybe shorts for some!",
    Warm = "It's gonna be a warm one..."
}

export interface WeatherState {
    conditions: WeatherConditionsType | null,
    cityInfo: any;
}

export type WeatherConditionsType = {
    dt: number;
    name: string;
    main: {
        humidity: number;
        temp: number;
    };
    sys: {
        country: string;
    };
    weather: {
        0: {
            description: string;
            icon: string;
        };
    };
    wind: {
        speed: number;
    };
};

