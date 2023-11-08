import { useState, ChangeEvent } from "react";

const App = (): JSX.Element => {
  const [input, setInput] = useState<string>("");

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trimStart();
    setInput(value);

    return input;
  };
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
        <button className="border-black border-2">
          Click to see if it'll snow, rain, or be swelteringly hot!
        </button>
      </section>

      <section className="flex flex-col w-1/2">
        <p>render data here</p>
      </section>
    </main>
  );
};

export default App;
