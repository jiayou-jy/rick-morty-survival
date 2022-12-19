import { StrictMode, lazy, Suspense } from "react";
import ErrorBoundary from "./ErrorBoundary";

const SearchParams = lazy(() => import("./SearchParams"));

const App = () => {
  return (
      <StrictMode>
        <Suspense fallback={<h2>quantum jumping...</h2>}>
          <header>
            <h1>Who survives the Universe of Rick and Morty?</h1>
          </header>
          <ErrorBoundary>
            <SearchParams/>
          </ErrorBoundary>
        </Suspense>
      </StrictMode>
  );
};

export default App;