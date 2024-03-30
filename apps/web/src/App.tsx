import React from "react";
import { Suspense } from "react";

const App = () => {
  return (
    <Suspense fallback={null}>
      <div>
        <h1>Welcome to my app</h1>
      </div>
    </Suspense>
  );
};

export default App;
