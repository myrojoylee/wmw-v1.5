import { useState, ChangeEvent } from "react";
import { cityInfoType, currentWeatherType } from "./types";
import Header from "./components/Header";
import { TIMEOUT } from "dns";

const App = (): JSX.Element => {
  const [input, setInput] = useState<string>("");
  const [cityInfo, setCityInfo] = useState<cityInfoType | any>("");
  const [currentWeather, setCurrentWeather] =
    useState<currentWeatherType | null>(null);
  const [verdict, setVerdict] = useState<string>("Loading...");
  const [placeholder, setPlaceholder] = useState<string>("Where you at?");
  const [temp, setTemp] = useState<number>();

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
      // console.log(todaysWeather);
    } catch (e) {
      console.error(e);
    }
    return currentWeather;
  };

  const handleVerdict = async (data: number) => {
    setVerdict("");

    try {
      console.log(data);
      if (data > 30 && data <= 50) {
        setVerdict("Pants and a jacket!");
      } else if (data > 50 && data < 70) {
        setVerdict("Light jacket, maybe shorts for some!");
      } else if (data > 70) {
        setVerdict("It's gonna be a warm one...");
      } else if (data < 30) {
        setVerdict("Time to bring out that heavy jacket or coat!");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // getting weather when you click button
  async function handleSubmit(input: string) {
    if (!input) {
      setPlaceholder(`Can't be blank, silly :)`);
      return;
    } else {
      try {
        const data = await getCoordinates(input);
        await getCurrentWeather(data[0]);
        const tempData = currentWeather?.main?.temp;
        setTemp(tempData);
      } catch (e) {
        console.error(e);
      }
    }
  }

  return (
    <main className="flex justify-center items-center w-full flex-col h-[100vh] space-y-10 bg-gradient-to-r from-cyan-500 to-blue-500">
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
          className="text-white bg-blue-900 border-black border-2 rounded-md hover:bg-slate-100 hover:text-black"
          onClick={() => handleSubmit(input)}
        >
          Click to see if it'll snow, rain, or be swelteringly hot!
        </button>
      </section>

      {currentWeather ? (
        <>
          <section className="flex flex-col w-1/2">
            <p>
              City:{" "}
              <span className="font-mono">
                {currentWeather?.name}, {currentWeather.sys.country}
              </span>
            </p>
            <p>
              Weather:{" "}
              <span className="font-mono">
                {currentWeather?.weather[0].description}
              </span>
            </p>
            <p>
              Temp:{" "}
              <span className="font-mono">{currentWeather?.main.temp}</span>
            </p>
          </section>
          <button
            onClick={() => handleVerdict(currentWeather?.main.temp)}
            className="text-white bg-blue-900 border-black border-2 rounded-md hover:bg-slate-100 hover:text-black px-1"
          >
            Click for a TL;DR
          </button>
          {verdict ? (
            <p>
              Verdict: <span className="font-mono">{verdict}</span>
            </p>
          ) : null}
        </>
      ) : (
        <>
          <section className="flex flex-col w-1/2">
            <p>
              City: <span className="font-mono">Loading...</span>
            </p>
            <p>
              Weather: <span className="font-mono">Loading...</span>
            </p>
            <p>
              Temp: <span className="font-mono">Loading...</span>
            </p>
          </section>
          <button className="text-white bg-blue-900 border-black border-2 rounded-md disabled:opacity-25 px-1 cursor-no-drop">
            Waiting for your weather...
          </button>
          {verdict ? (
            <p>
              Verdict: <span className="font-mono">{verdict}</span>
            </p>
          ) : (
            <p>
              <span className="font-mono">Verdict: </span>
            </p>
          )}
        </>
      )}
    </main>
  );
};

export default App;
