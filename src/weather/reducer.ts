import { useReducer } from "react";
import { WeatherState } from "./types";

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

export interface UpdateWeatherAction {
    type: "UPDATE_CURRENT_WEATHER",
    payload: any
}

export type ReducerAction = UpdateWeatherAction;

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
