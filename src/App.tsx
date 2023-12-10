import { useState, ChangeEvent, useReducer } from "react";
import Header from "./components/Header";
import { useWeatherReducer } from "./reducers/weather";

enum Verdict {
  Freezing = "Time to bring out that heavy jacket or coat!",
  Cold = "Pants and a jacket!",
  Moderate = "Light jacket, maybe shorts for some!",
  Warm = "It's gonna be a warm one..."
}

const App = (): JSX.Element => {
  const [weatherState, weatherDispatch] = useWeatherReducer();
  const [input, setInput] = useState<string>("");
  const [placeholder, setPlaceholder] = useState<string>("Type a city");
  const [loading, setLoading] = useState(true)
  const [verdict, setVerdict] = useState("")
  const [unitState, setUnitState] = useState("F");

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)

  // get coordinates
  async function getCityInfo(input: string) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${input}&appid=021e75b0e3380e236b4ff6031ae2dde4`
      );
      const data = await response.json();

      return data[0]
    } catch (e) {
      console.error(e);
    }
  }

  // get current weather
  const getCurrentWeather = async () => {
    try {
      const cityInfo = await getCityInfo(input.trim());

      const responseCurrent = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${cityInfo.lat}&lon=${cityInfo.lon}&appid=021e75b0e3380e236b4ff6031ae2dde4&units=Imperial`
      );
      const todaysWeather = await responseCurrent.json();

      const updatePayload = { conditions: todaysWeather, cityInfo: cityInfo };

      weatherDispatch({ type: "UPDATE_CURRENT_WEATHER", payload: updatePayload });
    } catch (e) {
      console.error(e);
    }
  };

  // tl;dr message based on temp
  const displayVerdict = async () => {
    const { temp } = weatherState.conditions.main;
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
    const { temp } = weatherState.conditions.main;

    // formula converts from Fahrenheit to Celsius
    function convertToC() {
      return (temp - 32) * (5 / 9)
    }

    return unitState === "C" ? `${convertToC().toFixed(2)} °C` : `${temp} °F`
  }

  // getting weather when you click button
  async function handleSubmit(input: string) {
    if (!input) {
      setPlaceholder(`Can't be blank, silly :)`);
      return;
    } else {
      try {

        await getCurrentWeather();

        setLoading(false)
      } catch (e) {
        console.error(e);
      }
    }
  }

  const { conditions, cityInfo } = weatherState;

  return (
    <main className="flex justify-center items-center w-full flex-col h-[100vh] space-y-10 bg-gradient-to-r from-cyan-200 to-sky-400">
      <Header />
      <section className="flex flex-col w-1/2 space-y-2">
        <input
          type="text"
          value={input}
          className="border-2 border-grey p-1"
          placeholder={placeholder}
          onChange={handleInput}
        />
        <button
          className="text-white bg-sky-900 border-black border-2 rounded-md hover:bg-slate-100 hover:text-black"
          onClick={() => handleSubmit(input)}
        >
          Click to see if it'll snow, rain, or be swelteringly hot!
        </button>
      </section>

      {!loading && (
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
      )}
    </main>
  );
};

export default App;
