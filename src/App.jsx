import { Route, Routes } from "react-router";
import Feed from "./Pages/Feed";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Feed/>}/>
      </Routes>
    </>
  );
}

export default App;
