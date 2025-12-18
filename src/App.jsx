// src/App.jsx
import { Suspense } from "react";
import PageLoader from "./components/Layout/PageLoader";
import AppRoutes from "./AppRoutes"; // Import the new file

function App() {
  return (
    <div className="App">
      {/* Suspense handles the loading state for any lazy component inside AppRoutes */}
      <Suspense fallback={<PageLoader showLoader={true} />}>
        <AppRoutes />
      </Suspense>
    </div>
  );
}

export default App;
