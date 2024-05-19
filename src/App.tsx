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
              path="movie/latest/:movieId/:original_title/:original_language/:overview/:poster_path/:backdrop_path/:release_date/:popularity/:vote_average/:vote_count/:adult"
              element={<Home />}
            >
              <Route path="movie/top_rated/:id" element={<Home />} />
              <Route path="movie/upcoming/:id" element={<Home />} />
            </Route>
          </Route>
          <Route path="/tv" element={<Tv />}>
            <Route
              path="latest/:id/:original_name/:original_language/:overview/:popularity/:poster_path/:first_air_date/:popularity/:vote_average/:vote_count/:adult"
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
