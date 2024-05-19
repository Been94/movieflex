import {
  IGetMoviesResult,
  getMovies,
  getMoviesTopRated,
  getMoviesUpcoming,
  getSearchMovie,
} from "../api";
import styled from "styled-components";
import { movieStatus, bgArrayRandom, makeImgPath } from "./Util";
import { useQuery } from "@tanstack/react-query";
import { useLayoutEffect, useState } from "react";
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

const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

const LatestSlider = styled.div`
  position: relative;
`;

const TopRatedSlider = styled.div`
  position: relative;
`;

const UpcommingSlider = styled.div`
  position: relative;
`;

const LatestRow = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  bottom: 30px;
  width: 100%;
`;

const TopRatedRow = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  width: 100%;
  position: absolute;
  top: 5px;
`;

const UpcommingRow = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  top: 250px;

  //position: absolute;

  width: 100%;
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

const latestRowVariants = {
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

const TopRatedRowVariants = {
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

const UpcommingRowVariants = {
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

const offset = 6;

export default function Search() {
  const navigate = useNavigate();
  const moviePathMatch: PathMatch<string> | null = useMatch(
    "/movie/latest/:id/:title/:releaseDate/:language/:popularity/:voteAverage/:voteCount/:posterPath/:adult"
  );
  console.log(moviePathMatch);

  const [searchParams, _] = useSearchParams();
  const keyword = searchParams.get("keyword");

  const [randomNumber, setRandomNumber] = useState(0);
  const [latestIndex, setLatestIndex] = useState(0);
  const [topRatedIndex, setTopRatedIndex] = useState(0);
  const [upCommingIndex, setUpCommingIndex] = useState(0);

  const [maxIndex, setMaxIndex] = useState(0);
  const [latestLeaving, setLatestLeaving] = useState(false);
  const [topRatedLeaving, setTopRatedLeaving] = useState(false);
  const [upCommingLeaving, setUpCommingLeaving] = useState(false);

  const useGetMovieQuerys = () => {
    const searchTv = useQuery<IGetMoviesResult>({
      queryKey: ["search", "tv"],
      queryFn: async () => {
        const response = await getSearchMovie(keyword!);
        console.log(response);
        return response;
      },
    });
    const topRated = useQuery<IGetMoviesResult>({
      queryKey: ["movies", "topRated"],
      queryFn: getMoviesTopRated,
    });

    return [searchTv, topRated];
  };

  const [
    { isLoading: loadingSearchTv, data: searchTv },
    { isLoading: loadingTopRated, data: topRatedData },
  ] = useGetMovieQuerys();

  const onOverlayClick = () => navigate(-1);

  useLayoutEffect(() => {
    async function bgArrayRandomFunction() {
      if (searchTv?.results.length === 0) {
        return;
      }

      // const result = await bgArrayRandom(0, searchTv?.results.length! - 1 || 1);
      // setRandomNumber(() => result);
      // const maxIndex = Math.floor(searchTv?.results.length! / offset) - 1;
      // setMaxIndex(maxIndex);
      // console.log(result);
      //console.log("topRated:", topRatedData?.results.length);
    }

    bgArrayRandomFunction();
  }, []);

  const latestToggleLeving = () => setLatestLeaving((current) => !current);
  const topRatedToggleLeving = () => setTopRatedLeaving((current) => !current);
  const upCommingLeavingToggleLeving = () =>
    setUpCommingLeaving((current) => !current);

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
      `/movie/latest/${movieId}/${title}/${releaseDate}/${language}/${popularity}/${voteAverage}/${voteCount}/${posterPath?.replace(
        "/",
        ""
      )}/${adult}`
    );
  };

  const leftIndex = (index: number, value: string, data: any) => {
    if (data) {
      if (value === movieStatus.latest) {
        latestToggleLeving();
      }

      if (value === movieStatus.topRated) {
        topRatedToggleLeving();
      }

      if (value === movieStatus.upComming) {
        upCommingLeavingToggleLeving();
      }

      const totalMovies = data.results.length;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setMaxIndex(maxIndex);
      if (index === 0) {
        return;
      } else if (index > 0) {
        if (value === movieStatus.latest) {
          return setLatestIndex((current) => current - 1);
        }
        if (value === movieStatus.topRated) {
          return setTopRatedIndex((current) => current - 1);
        }
        if (value === movieStatus.upComming) {
          return setUpCommingIndex((current) => current - 1);
        }
      } else if (index === maxIndex) {
        if (value === movieStatus.latest) {
          return setLatestIndex(0);
        }
        if (value === movieStatus.topRated) {
          return setTopRatedIndex(0);
        }
        if (value === movieStatus.upComming) {
          return setUpCommingIndex(0);
        }
      }
    }
  };

  const rightIndex = (index: number, value: string, data: any) => {
    if (data) {
      if (value === movieStatus.latest) {
        latestToggleLeving();
      }

      if (value === movieStatus.topRated) {
        topRatedToggleLeving();
      }

      if (value === movieStatus.upComming) {
        upCommingLeavingToggleLeving();
      }
      const totalMovies = data.results.length;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setMaxIndex(maxIndex);
      console.log(maxIndex);

      if (index >= 0) {
        if (value === movieStatus.latest) {
          return setLatestIndex((current) => current + 1);
        }
        if (value === movieStatus.topRated) {
          return setTopRatedIndex((current) => current + 1);
        }
        if (value === movieStatus.upComming) {
          return setUpCommingIndex((current) => current + 1);
        }
      } else if (index === maxIndex) {
        if (value === movieStatus.latest) {
          return setLatestIndex(0);
        }
        if (value === movieStatus.topRated) {
          return setTopRatedIndex(0);
        }
        if (value === movieStatus.upComming) {
          return setUpCommingIndex(0);
        }
      }
    }
  };

  return (
    <>
      {loadingSearchTv ? (
        <span>Loading...</span>
      ) : (
        <span style={{ fontSize: "15px", color: "white" }}>
          {searchTv?.results.length}
        </span>
      )}
      {/* <Wrapper>
        {loadingLatest && loadingTopRated ? (
          <>
            <Loader>
              <span>로딩중</span>
            </Loader>
          </>
        ) : (
          <>
            <Banner
              bgphoto={makeImgPath(
                latestData?.results[randomNumber || 19].backdrop_path || ""
              )}
            >
              <Title>{latestData?.results[randomNumber || 19].title}</Title>
              <Overview>
                {latestData?.results[randomNumber || 19].overview}
              </Overview>
            </Banner>

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
                  top: 100,
                  paddingBottom: "20px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <LatestSlider>
                  <AnimatePresence
                    initial={false}
                    onExitComplete={latestToggleLeving}
                  >
                    <span style={{ position: "absolute", top: "-260px" }}>
                      LatestMovie
                    </span>
                    <LatestRow
                      variants={latestRowVariants}
                      initial={latestIndex > 0 ? "hidden" : "exit"}
                      animate="visible"
                      exit={latestIndex < maxIndex ? "exit" : "hidden"}
                      transition={{ type: "tween", duration: 1 }}
                      key={latestIndex}
                    >
                      {latestIndex > 0 ? (
                        <LeftBtn
                          onClick={() =>
                            leftIndex(
                              latestIndex,
                              movieStatus.latest,
                              latestData
                            )
                          }
                        >
                          <span>{"<"}</span>
                        </LeftBtn>
                      ) : null}

                      {latestData?.results
                        .slice(
                          offset * latestIndex,
                          offset * latestIndex + offset
                        )
                        .map((movie) => (
                          <Box
                            layoutId={String(movie.id)}
                            key={movie.id}
                            onClick={() =>
                              onBoxClicked(
                                movie.id,
                                movie.adult,
                                movie.title,
                                movie.original_language,
                                movie.popularity,
                                movie.release_date,
                                movie.vote_average,
                                movie.vote_count,
                                movie.poster_path
                              )
                            }
                            initial="normal"
                            whileHover="hover"
                            transition={{ type: "tween" }}
                            variants={boxVariants}
                            bgphoto={makeImgPath(
                              movie.backdrop_path || "",
                              "w500"
                            )}
                          >
                            <img />
                            <Info variants={infoVariants}>
                              <h4>{movie.title}</h4>
                            </Info>
                          </Box>
                        ))}

                      {latestIndex === maxIndex ? null : (
                        <RightBtn
                          onClick={() =>
                            rightIndex(
                              latestIndex,
                              movieStatus.latest,
                              latestData
                            )
                          }
                        >
                          <span>{">"}</span>
                        </RightBtn>
                      )}
                    </LatestRow>
                  </AnimatePresence>
                </LatestSlider>

                <TopRatedSlider>
                  <AnimatePresence
                    initial={false}
                    onExitComplete={topRatedToggleLeving}
                  >
                    <span style={{ position: "absolute", bottom: "5px" }}>
                      TopRateMovie
                    </span>
                    <TopRatedRow
                      variants={TopRatedRowVariants}
                      initial={topRatedIndex > 0 ? "hidden" : "exit"}
                      animate="visible"
                      exit={topRatedIndex < maxIndex ? "exit" : "hidden"}
                      transition={{ type: "tween", duration: 1 }}
                      key={topRatedIndex}
                    >
                      {topRatedIndex > 0 ? (
                        <LeftBtn
                          onClick={() =>
                            leftIndex(
                              topRatedIndex,
                              movieStatus.topRated,
                              topRatedData
                            )
                          }
                        >
                          <span>{"<"}</span>
                        </LeftBtn>
                      ) : null}

                      {topRatedData?.results
                        .slice(
                          offset * topRatedIndex,
                          offset * topRatedIndex + offset
                        )
                        .map((movie) => (
                          <Box
                            layoutId={String(movie.id)}
                            key={movie.id}
                            onClick={() =>
                              onBoxClicked(
                                movie.id,
                                movie.adult,
                                movie.title,
                                movie.original_language,
                                movie.popularity,
                                movie.release_date,
                                movie.vote_average,
                                movie.vote_count,
                                movie.poster_path
                              )
                            }
                            initial="normal"
                            whileHover="hover"
                            transition={{ type: "tween" }}
                            variants={boxVariants}
                            bgphoto={makeImgPath(
                              movie.backdrop_path || "",
                              "w500"
                            )}
                          >
                            <img />
                            <Info variants={infoVariants}>
                              <h4>{movie.title}</h4>
                            </Info>
                          </Box>
                        ))}

                      {topRatedIndex === maxIndex ? null : (
                        <RightBtn
                          onClick={() =>
                            rightIndex(
                              topRatedIndex,
                              movieStatus.topRated,
                              topRatedData
                            )
                          }
                        >
                          <span>{">"}</span>
                        </RightBtn>
                      )}
                    </TopRatedRow>
                  </AnimatePresence>
                </TopRatedSlider>

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
      </Wrapper> */}
    </>
  );
}
