import { StrictMode, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./ErrorBoundary";

const Details = lazy(() => import("./Details"));
const SearchParams = lazy(() => import("./SearchParams"));

const App = () => {
  return (
      <StrictMode>
        <Suspense fallback={<h2>quantum jumping...</h2>}>
        <BrowserRouter>
          <header>
            <h1>Who survives the Universe of Rick and Morty?</h1>
          </header>
          <ErrorBoundary>
          <Routes>
            <Route path="/details/:id" element={<Details />} />
            <Route path="/" element={<SearchParams />} />
          </Routes>
          </ErrorBoundary>
        </BrowserRouter>
        </Suspense>
      </StrictMode>
  );
};

export default App;