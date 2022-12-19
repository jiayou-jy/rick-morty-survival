import { FunctionComponent, useState } from "react";
import { Status } from "./APIResponsesTypes";

interface FormProps {
  requestCharacters: Function
}

const STATUS: Status[] = ["any", "alive", "dead", "unknown"];

const Form: FunctionComponent = () => {
  const [name, setName] = useState("all");
  const [status, setStatus] = useState("alive");
  
  return (
      <form>
        <label htmlFor="name">
          Name
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value.toLocaleLowerCase())}
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
        <button>Get Schwifty!</button>
      </form>
  );
};

export default Form;
