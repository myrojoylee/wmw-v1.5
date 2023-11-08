import { useState, ChangeEvent } from "react";
import { cityInfoType, currentWeatherType } from "./types";

const App = (): JSX.Element => {
  const [input, setInput] = useState<string>("");
  const [cityInfo, setCityInfo] = useState<cityInfoType | any>("");
  const [currentWeather, setCurrentWeather] =
    useState<currentWeatherType | null>(null);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trimStart();
    setInput(value);
    if (value === "") {
      setCityInfo("");
    }
    return input;
  };

  // get coordinates
  async function getCoordinates(input: string) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${input}&appid=021e75b0e3380e236b4ff6031ae2dde4`
      );
      const data = await response.json();
      return data;
    } catch (e) {
      console.error(e);
    }
  }

  // get current weather
  const getCurrentWeather = async (cityInfo: cityInfoType) => {
    try {
      const data = await getCoordinates(input);
      setCityInfo(data[0]);

      const responseCurrent = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${cityInfo.lat}&lon=${cityInfo.lon}&appid=021e75b0e3380e236b4ff6031ae2dde4&units=Imperial`
      );
      const todaysWeather = await responseCurrent.json();
      setCurrentWeather(todaysWeather);
      console.log(todaysWeather);
      return currentWeather;
    } catch (e) {
      console.error(e);
    }
  };

  // getting weather when you click button
  async function handleSubmit(input: string) {
    try {
      const data = await getCoordinates(input);
      await getCurrentWeather(data[0]);
    } catch (e) {
      console.error(e);
    }

    return;
  }

  return (
    <main className="flex justify-center items-center w-full flex-col h-[100vh] space-y-10">
      <h1 className="flex text-center font-mono text-xl font-bold">
        Tell me if it's hot or cold
      </h1>
      <section className="flex flex-col w-1/2 space-y-2">
        <input
          type="text"
          value={input}
          className="border-2 border-black p-1"
          placeholder="Where you at"
          onChange={handleInput}
        />
        <button
          className="border-black border-2"
          onClick={() => handleSubmit(input)}
        >
          Click to see if it'll snow, rain, or be swelteringly hot!
        </button>
      </section>

      <section className="flex flex-col w-1/2">
        <p>City: {currentWeather?.name}</p>
        <p>Weather: {currentWeather?.weather[0].description}</p>
        <p>Temp: {currentWeather?.main.temp}</p>
        <p>Verdict:</p>
      </section>
    </main>
  );
};

export default App;
