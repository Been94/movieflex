import "./App.css";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Routes/Home";
import Tv from "./Routes/Tv";
import Search from "./Routes/Search";
import Header from "./Components/Header";

function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />}>
            <Route
              path="movie/latest/:id/:title/:releaseDate/:language/:popularity/:voteAverage/:voteCount/:posterPath/:adult"
              element={<Home />}
            >
              <Route path="movie/top_rated/:id" element={<Home />} />
              <Route path="movie/upcoming/:id" element={<Home />} />
            </Route>
          </Route>
          <Route path="/tv" element={<Tv />}>
            <Route path="tv/:id" element={<Home />} />
          </Route>
          <Route path="/search" element={<Search />}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
