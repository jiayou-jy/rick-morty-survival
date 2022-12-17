import { FunctionComponent, useState, useEffect } from "react";
import Results from "./Results";
import { APIResponse, Character, Status } from "./APIResponsesTypes";

const STATUS: Status[] = ["any", "alive", "dead"];

const SearchParams: FunctionComponent = () => {
  const [name, setName] = useState("rick");
  const [status, setStatus] = useState("alive");
  const [characters, setCharacters] = useState<Character[]>([]);

  useEffect(() => {
    requestCharacters();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function requestCharacters() {
    const res = await fetch(
      `https://rickandmortyapi.com/api/character/?name=${name}&status=${status}`
    );
    const json = (await res.json()) as APIResponse;

    setCharacters(json.results);
    console.log(json.results);
  }

  return (
    <div className="search-params">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          requestCharacters();
        }}
      >
        <label htmlFor="name">
          Name
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="name"
          />
        </label>
        <label htmlFor="status">
          Status
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            onBlur={(e) => setStatus(e.target.value)}
          >
            {STATUS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <button>Submit</button>
      </form>
      <Results characters={characters} />
    </div>
  );
};

export default SearchParams;
