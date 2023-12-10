import { Dispatch, SetStateAction, useState, ChangeEvent } from "react";

export const InputForm = ({ setCitySearched, placeholder }: { setCitySearched: Dispatch<SetStateAction<string>>, placeholder: string }) => {
    const [input, setInput] = useState<string>("");
    const handleInput = (e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)

    return (
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
                onClick={() => setCitySearched(input)}
            >
                Click to see if it'll snow, rain, or be swelteringly hot!
            </button>
        </section>
    )
}
