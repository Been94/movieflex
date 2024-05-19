import "./App.css";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Routes/Home";
import Tv from "./Routes/Tv";
import Header from "./Components/Header";
import Search from "./Routes/Search";

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
            <Route
              path="latest/:id/:title/:releaseDate/:language/:popularity/:voteAverage/:voteCount/:posterPath/:adult"
              element={<Tv />}
            >
              <Route path="tv/airing_today/:id" element={<Tv />} />
              <Route path="tv/popular/:id" element={<Tv />} />
              <Route path="tv/top_rated/:id" element={<Tv />} />
            </Route>
          </Route>

          <Route path="/search" element={<Search />}>
            <Route
              path="latest/:id/:title/:releaseDate/:language/:popularity/:voteAverage/:voteCount/:posterPath/:adult"
              element={<Search />}
            >
              <Route path="search/movie/:id" element={<Search />} />
              <Route path="search/tv/:id" element={<Search />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
