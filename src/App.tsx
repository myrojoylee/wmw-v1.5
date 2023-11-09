import { useState, ChangeEvent } from "react";
import { cityInfoType, currentWeatherType } from "./types";
import Header from "./components/Header";

const App = (): JSX.Element => {
  const [input, setInput] = useState<string>("");
  const [cityInfo, setCityInfo] = useState<cityInfoType | any>("");
  const [currentWeather, setCurrentWeather] =
    useState<currentWeatherType | null>(null);
  const [verdict, setVerdict] = useState<string>("Loading...");
  const [placeholder, setPlaceholder] = useState<string>("Where you at?");
  const [temp, setTemp] = useState<number>();
  const [conversion, setConversion] = useState<boolean>(true);
  const [convertMessage, setConvertMessage] = useState<string>("");
  const [degreeUnit, setDegreeUnit] = useState<string>(" deg F");

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

  // To get temperature in metric units
  const getCurrentWeatherMetric = async (cityInfo: cityInfoType) => {
    try {
      const data = await getCoordinates(input);
      setCityInfo(data[0]);

      const responseCurrent = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${cityInfo.lat}&lon=${cityInfo.lon}&appid=021e75b0e3380e236b4ff6031ae2dde4&units=Metric`
      );
      const todaysWeather = await responseCurrent.json();
      setCurrentWeather(todaysWeather);
    } catch (e) {
      console.error(e);
    }
    return currentWeather;
  };

  // tl;dr message based on temp
  // msg stays the same even after conversion
  const handleVerdict = async (data: number) => {
    setVerdict("");
    if (conversion) {
      if (data > 32 && data <= 50) {
        setVerdict("Pants and a jacket!");
      } else if (data > 50 && data < 70) {
        setVerdict("Light jacket, maybe shorts for some!");
      } else if (data > 70) {
        setVerdict("It's gonna be a warm one...");
      } else if (data < 32) {
        setVerdict("Time to bring out that heavy jacket or coat!");
      }
    } else {
      if (data > 0 && data <= 10) {
        setVerdict("Pants and a jacket!");
      } else if (data > 10 && data < 21.1) {
        setVerdict("Light jacket, maybe shorts for some!");
      } else if (data > 21.1) {
        setVerdict("It's gonna be a warm one...");
      } else if (data < 0) {
        setVerdict("Time to bring out that heavy jacket or coat!");
      }
    }
  };

  // unit conversion
  const handleUnits = async () => {
    if (conversion == true) {
      const data = await getCoordinates(input);
      await getCurrentWeatherMetric(data[0]);

      setVerdict("Loading...");
      setConvertMessage("convert to F");
      setDegreeUnit(" deg C");
      setConversion(false);
    } else {
      const data = await getCoordinates(input);
      await getCurrentWeather(data[0]);
      setConvertMessage("convert to C");
      setDegreeUnit(" deg F");
      setConversion(true);
    }
  };

  // getting weather when you click button
  async function handleSubmit(input: string) {
    if (!input) {
      setPlaceholder(`Can't be blank, silly :)`);
      return;
    } else {
      try {
        setVerdict("Loading...");
        setDegreeUnit(" deg F");
        setConvertMessage("convert to C");
        setConversion(true);
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

      {currentWeather ? (
        <>
          <section className="flex flex-col w-3/4">
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
            <div className="flex items-center justify-between">
              <p>
                Temp:{" "}
                <span className="font-mono">
                  {currentWeather?.main.temp}
                  {degreeUnit}
                </span>
              </p>
              <button
                className="border-2 border-grey rounded-md px-1"
                onClick={handleUnits}
              >
                {convertMessage}
              </button>
            </div>
          </section>
          <button
            onClick={() => handleVerdict(currentWeather?.main.temp)}
            className="text-white bg-sky-900 border-black border-2 rounded-md hover:bg-slate-100 hover:text-black px-1"
          >
            Click for a TL;DR
          </button>
          {verdict ? (
            <p className="flex flex-col w-3/4">
              Verdict: <span className="font-mono">{verdict}</span>
            </p>
          ) : null}
        </>
      ) : (
        <>
          <section className="flex flex-col w-3/4">
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
          <button className="text-white bg-sky-900 border-black border-2 rounded-md disabled:opacity-25 px-1 cursor-no-drop">
            Waiting for your weather...
          </button>
          {verdict ? (
            <section className="flex flex-col w-3/4">
              <p>Verdict:</p>
              <p>
                <span className="font-mono">{verdict}</span>
              </p>
            </section>
          ) : (
            <section className="flex flex-col w-3/4">
              <p>Verdict:</p>
              <p>
                <span className="font-mono">Loading...</span>
              </p>
            </section>
          )}
        </>
      )}
    </main>
  );
};

export default App;
