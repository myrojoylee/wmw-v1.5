import { useReducer } from "react";

interface WeatherState {
    conditions: WeatherConditionsType | null,
    cityInfo: any;
}

type CityInfoType = {
    country: string;
    lat: number;
    lon: number;
    name: string;
    state: string;
};

type WeatherConditionsType = {
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

const initialWeatherState = {
    conditions: null,
    cityInfo: {
        country: "",
        lat: 0,
        lon: 0,
        name: "",
        state: ""
    }
};

interface UpdateWeatherAction {
    type: "UPDATE_CURRENT_WEATHER",
    payload: any
}

type ReducerAction = UpdateWeatherAction;

export function weatherReducer(state: WeatherState, action: ReducerAction) {
    switch (action.type) {
        case "UPDATE_CURRENT_WEATHER":
            return {
                ...state,
                conditions: action.payload.conditions,
                cityInfo: action.payload.cityInfo
            }
        default:
            return state
    }
}

export const useWeatherReducer = () => useReducer(weatherReducer, initialWeatherState);
