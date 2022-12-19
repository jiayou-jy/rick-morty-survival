import { FunctionComponent, useState, useEffect } from "react";
import Chart from "./Chart";
import { APIResponse, Character, Status } from "./APIResponsesTypes";

interface Cache {
  [key: string]: Character[];
}

const localCache = {} as Cache;
const STATUS: Status[] = ["any", "alive", "dead", "unknown"];

const SearchParams: FunctionComponent = () => {
  const [name, setName] = useState("all");
  const [status, setStatus] = useState("alive");
  const [characters, setCharacters] = useState<Character[]>([]);
  const [category, setCategory] = useState("species");
  const [loading, setLoading] = useState(true);
  const cacheKey = `${name}_${status}`;

  useEffect(() => {
    if (localCache[cacheKey]) {
      setCharacters(localCache[cacheKey]);
    } else {
      requestCharacters();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function requestCharacters() {
    let url = "https://rickandmortyapi.com/api/character/";
    let results = [] as Character[];
    let lastResInfo;
    if (name !== "all") {
      url += `?name=${name}`;
    }

    if (status !== "any") {
      url += (name === "all")? `?status=${status}` : `&status=${status}`;
    }
    do {
      const res = await fetch(url);
      const json = (await res.json()) as APIResponse;
      results = results.concat(json.results);
      lastResInfo = json.info;
      url = lastResInfo.next;
    } while (lastResInfo.next);
    
    localCache[cacheKey] = results || [];
    console.log(localCache);
    setCharacters(results);
    setLoading(false);
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
              <option 
              key={status} 
              value={status}
              onChange={(e) => setStatus(status)}
              onBlur={(e) => setStatus(status)}
              >
                {status}
              </option>
            ))}
          </select>
        </label>
        <button>WUBBA LUBBA DUB-DUB</button>
      </form>
      {/* <div className="categories">
        {CATEGORY.map((category) => (
          <button 
            key={category} 
            value={category}
            onClick = {(e) => setCategory(category)}>
              {category}
            </button>
          ))}
      </div> */}
      <Chart data={characters} loading={loading} category={category}/>
    </div>
  );
};

export default SearchParams;
