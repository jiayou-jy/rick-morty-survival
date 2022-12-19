import { StrictMode } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import SearchParams from "./SearchParams";
import Details from "./Details";

const App = () => {
  return (
      <StrictMode>
        <BrowserRouter>
          <header>
            <h1>The Universe of Rick and Morty</h1>
          </header>
          <Routes>
            <Route path="/details/:id" element={<Details />} />
            <Route path="/" element={<SearchParams />} />
          </Routes>
        </BrowserRouter>
      </StrictMode>
  );
};

export default App;