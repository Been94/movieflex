import { ISearchResult, getSearchMovie, getSearchTv } from "../api";
import styled from "styled-components";
import { makeImgPath, searchStatus } from "./Util";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMatch, PathMatch } from "react-router-dom";

const Wrapper = styled.div`
  background-color: black;
  height: 40vh;
`;

const Loader = styled.div`
  height: 20vh;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

const SearchTvSlider = styled.div`
  position: relative;
`;

const SearchMovieSlider = styled.div`
  position: relative;
`;

const SearchTvRow = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  bottom: 30px;
  width: 100%;
`;

const SearchMovieRow = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  width: 100%;
  position: absolute;
  top: 5px;
`;

const LeftBtn = styled(motion.div)`
  position: absolute;
  left: 0;
  width: 40px;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  font-size: 40px;
  cursor: pointer;
  span {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
  }
`;

const RightBtn = styled(motion.div)`
  position: absolute;
  right: 0;
  width: 40px;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  font-size: 40px;
  cursor: pointer;
  span {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
  }
`;
const Box2 = styled(motion.div)`
  background-color: white;
  height: 200px;
  color: red;
  font-size: 66px;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  height: 200px;
  color: ${(props) => props.theme.white.lighter};
  font-size: 66px;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0px;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0px;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: fixed;
  background-color: rgba(0, 0, 0, 0.9);
  border-radius: 10px;
  width: 60vw;
  height: 70vh;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
`;

const DetailMovie = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 60% 30%;
  height: 100%;
  width: 100%;
`;

const IsAdult = styled(motion.div)`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: flex-end;
  align-items: center;
  padding-right: 20px;
`;

const IsAdultDetail = styled(motion.div)<{ isadult: boolean }>`
  border-radius: 10px;
  background-color: ${(props) => (props.isadult ? `green` : `tomato`)};
  width: 80px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DetailMovieBottom = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
`;

const DetailMovieTitle = styled.div`
  font-size: xx-large;
`;

const NowPlaying = styled.div`
  margin: 10px;
  font-weight: bold;
`;

const SliderBackground = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const SearchTvRowVariants = {
  hidden: {
    x: window.outerWidth,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth,
  },
};

const SearchMovieRowVariants = {
  hidden: {
    x: window.outerWidth,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth,
  },
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    zIndex: 99,
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 0.7 },
  exit: { opacity: 0 },
};

export default function Search() {
  const navigate = useNavigate();
  const moviePathMatch: PathMatch<string> | null = useMatch(
    "/movie/latest/:id/:title/:releaseDate/:language/:popularity/:voteAverage/:voteCount/:posterPath/:adult"
  );
  console.log(moviePathMatch);

  const [searchParams, _] = useSearchParams();
  const keyword = searchParams.get("keyword");
  const [maxIndex, setMaxIndex] = useState(0);
  const [searchOffSet, setSearchOffSet] = useState(6);

  const [searchTvIndex, setSearchTvIndex] = useState(0);
  const [searchMovieIndex, setSearchMovieIndex] = useState(0);

  const [searchTvLeaving, setSearchTvLeaving] = useState(false);
  const [searchMovieLeaving, setSearchMovieLeaving] = useState(false);

  const searchTvToggleLeving = () => setSearchTvLeaving((current) => !current);
  const searchMovieToggleLeving = () =>
    setSearchMovieLeaving((current) => !current);

  const useGetSearchQuery = () => {
    const searchTv = useQuery<ISearchResult>({
      queryKey: ["search", "tv"],
      queryFn: async () => {
        const response = await getSearchTv(keyword!);
        console.log(response);
        return response;
      },
    });
    const searchMovie = useQuery<ISearchResult>({
      queryKey: ["search", "movie"],
      queryFn: async () => {
        const response = await getSearchMovie(keyword!);
        console.log(response);
        return response;
      },
    });

    return [searchTv, searchMovie];
  };

  const [
    { isLoading: loadingSearchTv, data: searchTvData },
    { isLoading: loadingSearchMovie, data: searchMovieData },
  ] = useGetSearchQuery();

  const onOverlayClick = () => navigate(-1);

  const onBoxClicked = (
    movieId: number,
    adult: boolean,
    title: string,
    language: string,
    popularity?: number,
    releaseDate?: string,
    voteAverage?: number,
    voteCount?: number,
    posterPath?: string
  ) => {
    navigate(
      `/latest/movie/${movieId}/${title}/${releaseDate}/${language}/${popularity}/${voteAverage}/${voteCount}/${posterPath?.replace(
        "/",
        ""
      )}/${adult}`
    );
  };

  const leftIndex = (index: number, value: string, data: any) => {
    if (data) {
      if (value === searchStatus.searchTv) {
        searchTvToggleLeving();
      }
      if (value === searchStatus.searchMovie) {
        searchMovieToggleLeving();
      }
      const totalMovies = data.results.length;
      const maxIndex = Math.floor(totalMovies / searchOffSet) - 1;
      setMaxIndex(maxIndex);
      if (index === 0) {
        return;
      } else if (index > 0) {
        if (value === searchStatus.searchTv) {
          return setSearchTvIndex((current) => current - 1);
        }
        if (value === searchStatus.searchMovie) {
          return setSearchMovieIndex((current) => current - 1);
        }
      } else if (index === maxIndex) {
        if (value === searchStatus.searchTv) {
          return setSearchTvIndex(0);
        }
        if (value === searchStatus.searchMovie) {
          return setSearchMovieIndex(0);
        }
      }
    }
  };

  const rightIndex = (index: number, value: string, data: any) => {
    if (data) {
      if (value === searchStatus.searchTv) {
        searchTvToggleLeving();
      }
      if (value === searchStatus.searchMovie) {
        searchMovieToggleLeving();
      }
      const totalMovies = data.results.length;
      const maxIndex = Math.floor(totalMovies / searchOffSet) - 1;
      setMaxIndex(maxIndex);
      console.log(maxIndex);

      if (index >= 0) {
        if (value === searchStatus.searchTv) {
          return setSearchTvIndex((current) => current + 1);
        }
        if (value === searchStatus.searchMovie) {
          return setSearchMovieIndex((current) => current + 1);
        }
      } else if (index === maxIndex) {
        if (value === searchStatus.searchTv) {
          return setSearchTvIndex(0);
        }
        if (value === searchStatus.searchMovie) {
          return setSearchMovieIndex(0);
        }
      }
    }
  };

  return (
    <>
      <Wrapper>
        {loadingSearchTv && loadingSearchMovie ? (
          <>
            <Loader>
              <span>로딩중...</span>
            </Loader>
          </>
        ) : (
          <>
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  width: "100%",
                  bottom: -100,
                  paddingBottom: "20px",
                  display: "flex",
                  flexDirection: "column",
                  left: 10,
                }}
              >
                <SearchTvSlider>
                  <AnimatePresence
                    initial={false}
                    onExitComplete={searchTvToggleLeving}
                  >
                    <span style={{ position: "absolute", top: "-260px" }}>
                      LatestMovie
                    </span>
                    <SearchTvRow
                      variants={SearchTvRowVariants}
                      initial={searchTvIndex > 0 ? "hidden" : "exit"}
                      animate="visible"
                      exit={searchTvIndex < maxIndex ? "exit" : "hidden"}
                      transition={{ type: "tween", duration: 1 }}
                      key={searchTvIndex}
                    >
                      {searchTvIndex > 0 ? (
                        <LeftBtn
                          onClick={() =>
                            leftIndex(
                              searchTvIndex,
                              searchStatus.searchTv,
                              searchTvData
                            )
                          }
                        >
                          <span>{"<"}</span>
                        </LeftBtn>
                      ) : null}

                      {searchTvData?.results
                        .slice(
                          searchOffSet * searchTvIndex,
                          searchOffSet * searchTvIndex + searchOffSet
                        )
                        .map((tv) => (
                          <Box
                            layoutId={String(tv.id)}
                            key={tv.id}
                            // onClick={() =>
                            //   onBoxClicked(
                            //     tv.id,
                            //     tv.adult,
                            //     tv.original_language,
                            //     tv.popularity,
                            //     tv.vote_average,
                            //     tv.vote_count,
                            //     tv.poster_path
                            //   )
                            // }
                            initial="normal"
                            whileHover="hover"
                            transition={{ type: "tween" }}
                            variants={boxVariants}
                            bgphoto={makeImgPath(
                              tv.backdrop_path || "",
                              "w500"
                            )}
                          >
                            <img />
                            <Info variants={infoVariants}>
                              <h4>{tv.original_name}</h4>
                            </Info>
                          </Box>
                        ))}

                      {searchTvIndex === maxIndex ? null : (
                        <RightBtn
                          onClick={() =>
                            rightIndex(
                              searchTvIndex,
                              searchStatus.searchTv,
                              searchTvData
                            )
                          }
                        >
                          <span>{">"}</span>
                        </RightBtn>
                      )}
                    </SearchTvRow>
                  </AnimatePresence>
                </SearchTvSlider>

                <SearchMovieSlider>
                  <AnimatePresence
                    initial={false}
                    onExitComplete={searchMovieToggleLeving}
                  >
                    <span style={{ position: "absolute", bottom: "5px" }}>
                      SearchMovie
                    </span>
                    <SearchMovieRow
                      variants={SearchMovieRowVariants}
                      initial={searchMovieIndex > 0 ? "hidden" : "exit"}
                      animate="visible"
                      exit={searchMovieIndex < maxIndex ? "exit" : "hidden"}
                      transition={{ type: "tween", duration: 1 }}
                      key={searchMovieIndex}
                    >
                      {searchMovieIndex > 0 ? (
                        <LeftBtn
                          onClick={() =>
                            leftIndex(
                              searchMovieIndex,
                              searchStatus.searchMovie,
                              searchMovieData
                            )
                          }
                        >
                          <span>{"<"}</span>
                        </LeftBtn>
                      ) : null}

                      {searchMovieData?.results
                        .slice(
                          searchOffSet * searchMovieIndex,
                          searchOffSet * searchMovieIndex + searchOffSet
                        )
                        .map((tv) => (
                          <Box
                            layoutId={String(tv.id)}
                            key={tv.id}
                            // onClick={() =>
                            //   onBoxClicked(
                            //     movie.id,
                            //     movie.adult,
                            //     movie.title,
                            //     movie.original_language,
                            //     movie.popularity,
                            //     movie.release_date,
                            //     movie.vote_average,
                            //     movie.vote_count,
                            //     movie.poster_path
                            //   )
                            // }
                            initial="normal"
                            whileHover="hover"
                            transition={{ type: "tween" }}
                            variants={boxVariants}
                            bgphoto={makeImgPath(
                              tv.backdrop_path || "",
                              "w500"
                            )}
                          >
                            <img />
                            <Info variants={infoVariants}>
                              <h4>{tv.original_title}</h4>
                            </Info>
                          </Box>
                        ))}

                      {searchMovieIndex === maxIndex ? null : (
                        <RightBtn
                          onClick={() =>
                            rightIndex(
                              searchMovieIndex,
                              searchStatus.searchMovie,
                              searchMovieData
                            )
                          }
                        >
                          <span>{">"}</span>
                        </RightBtn>
                      )}
                    </SearchMovieRow>
                  </AnimatePresence>
                </SearchMovieSlider>

                <AnimatePresence>
                  {moviePathMatch ? (
                    <>
                      <Overlay
                        variants={overlayVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={onOverlayClick}
                      />
                      <BigMovie layoutId={moviePathMatch.params.id}>
                        <DetailMovie>
                          <IsAdult>
                            <IsAdultDetail
                              isadult={Boolean(moviePathMatch.params.adult)}
                            >
                              {Boolean(moviePathMatch.params.adult) ? (
                                <span>No Adult</span>
                              ) : (
                                <span>Adult</span>
                              )}
                            </IsAdultDetail>
                          </IsAdult>
                          <div
                            style={{
                              backgroundImage: `url(${makeImgPath(
                                "/" + moviePathMatch.params.posterPath!
                              )})`,
                              backgroundSize: `contain`,
                              backgroundRepeat: `no-repeat`,
                              backgroundPosition: "center",
                            }}
                          />
                          <DetailMovieBottom>
                            <DetailMovieTitle>
                              {decodeURIComponent(
                                moviePathMatch.params.title || "error - 1"
                              )}
                            </DetailMovieTitle>
                          </DetailMovieBottom>
                        </DetailMovie>
                      </BigMovie>
                    </>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>
          </>
        )}
      </Wrapper>
    </>
  );
}
