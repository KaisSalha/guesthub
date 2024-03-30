import React from "react";
import { Suspense } from "react";

const App = () => {
  return (
    <Suspense fallback={null}>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://www.typescriptlang.org/" target="_blank">
          <img
            src="${typescriptLogo}"
            className="logo vanilla"
            alt="TypeScript logo"
          />
        </a>
      </div>
    </Suspense>
  );
};

export default App;
