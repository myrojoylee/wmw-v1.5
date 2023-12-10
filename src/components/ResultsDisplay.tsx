import { useState } from "react";
import { Verdict } from "../weather/types";

export const ResultsDisplay = ({ conditions, cityInfo }: any) => {
    const [verdict, setVerdict] = useState("")
    const [unitState, setUnitState] = useState("F");

    // tl;dr message based on temp
    const displayVerdict = async () => {
        const { temp } = conditions.main;
        if (temp > 32 && temp <= 50) {
            setVerdict(Verdict.Cold);
        } else if (temp > 50 && temp < 70) {
            setVerdict(Verdict.Moderate);
        } else if (temp > 70) {
            setVerdict(Verdict.Warm);
        } else {
            setVerdict(Verdict.Freezing);
        }

    };

    // unit conversion
    const toggleUnit = () => {
        if (unitState === "F") setUnitState("C")
        else setUnitState("F")
    };

    const displayByUnit = () => {
        const { temp } = conditions.main;

        // formula converts from Fahrenheit to Celsius
        function convertToC() {
            return (temp - 32) * (5 / 9)
        }

        return unitState === "C" ? `${convertToC().toFixed(2)} °C` : `${temp} °F`
    }

    return (
        <>
            <section className="flex flex-col w-3/4">
                <p>
                    City:{" "}
                    <span className="font-mono">
                        {cityInfo.name}, {cityInfo.state && cityInfo.state + ", "} {cityInfo.country}
                    </span>
                </p>
                <p>
                    Weather:{" "}
                    <span className="font-mono">
                        {conditions.weather[0].description}
                    </span>
                </p>
                <div className="flex items-center justify-between">
                    <p>
                        Temp:{" "}
                        <span className="font-mono">
                            {displayByUnit()}
                        </span>
                    </p>
                    <button
                        className="border-2 border-grey rounded-md px-1"
                        onClick={toggleUnit}
                    >
                        {unitState === "F" ? "Convert to Celsius" : "Convert to Fahrenheit"}
                    </button>
                </div>
            </section>
            <p className="flex flex-col w-3/4">
                {verdict ||
                    <button
                        onClick={() => displayVerdict()}
                        className="text-white bg-sky-900 border-black border-2 rounded-md hover:bg-slate-100 hover:text-black px-1"
                    >
                        Click for a TL;DR
                    </button>
                }
            </p>
        </>
    )


}
