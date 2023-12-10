import { useState, useEffect } from "react";
import { useWeatherReducer } from "./weather/reducer";
import Header from "./components/Header";
import { InputForm } from "./components/InputForm";
import { ResultsDisplay } from "./components/ResultsDisplay";

const App = (): JSX.Element => {
  const [weatherState, weatherDispatch] = useWeatherReducer();
  const [placeholder, setPlaceholder] = useState<string>("Type a city");
  const [loading, setLoading] = useState(true)
  const [citySearched, setCitySearched] = useState("");

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
      const cityInfo = await getCityInfo(citySearched.trim());

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
  // getting weather when you click button
  async function handleSubmit(input: string) {
    if (!input) {
      setPlaceholder("Can't be blank, silly :)");
      return;
    } else {
      setPlaceholder("Type a city ... ")
      try {
        setLoading(true)

        await getCurrentWeather();

        setLoading(false)
      } catch (e) {
        console.error(e);
      }
    }
  }

  useEffect(() => { handleSubmit(citySearched) }, [citySearched])

  const { conditions, cityInfo } = weatherState;

  return (
    <main className="flex  items-center w-full flex-col h-[100vh] space-y-10 bg-gradient-to-r  from-cyan-200 to-sky-400">
      <Header />
      <InputForm setCitySearched={setCitySearched} placeholder={placeholder} />
      {!loading && <ResultsDisplay conditions={conditions} cityInfo={cityInfo} />}
    </main>
  );
};

export default App;
