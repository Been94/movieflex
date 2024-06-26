import {
  IHomeMoviesResult,
  getMovies,
  getMoviesTopRated,
  getMoviesUpcoming,
} from "../api";
import styled from "styled-components";
import {
  movieStatus,
  bgArrayRandom,
  makeImgPath,
  dummyDataMsgMake,
} from "./Util";
import { useQuery } from "@tanstack/react-query";
import { useLayoutEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useMatch, PathMatch } from "react-router-dom";
import { FaChessQueen, FaHeart, FaStar } from "react-icons/fa";

const Wrapper = styled.div`
  background-color: black;
  height: 60vh;
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
  justify-content: space-between;
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
const rating = (score: number) => {
  const result = [];
  for (let i = 5; i > 0; i--) {
    score--;
    if (score >= 0) {
      result.push(<FaStar size="12" color="#d57358"></FaStar>);
    } else {
      result.push(<FaStar size="12" color="lightgray"></FaStar>);
    }
  }
  return result;
};
export default function Home() {
  const navigate = useNavigate();
  const moviePathMatch: PathMatch<string> | null = useMatch(
    "/movie/latest/:movieId/:original_title/:original_language/:overview/:poster_path/:backdrop_path/:release_date/:popularity/:vote_average/:vote_count/:adult"
  );
  //console.log(moviePathMatch);

  const [randomNumber, setRandomNumber] = useState(0);
  const [latestIndex, setLatestIndex] = useState(0);
  const [topRatedIndex, setTopRatedIndex] = useState(0);
  const [upCommingIndex, setUpCommingIndex] = useState(0);

  const [maxIndex, setMaxIndex] = useState(0);

  const useGetMovieQuerys = () => {
    const latest = useQuery<IHomeMoviesResult>({
      queryKey: ["movies", "latest"],
      queryFn: getMovies,
    });
    const topRated = useQuery<IHomeMoviesResult>({
      queryKey: ["movies", "topRated"],
      queryFn: getMoviesTopRated,
    });

    const upComming = useQuery<IHomeMoviesResult>({
      queryKey: ["movies", "upComming"],
      queryFn: getMoviesUpcoming,
    });
    return [latest, topRated, upComming];
  };

  const [
    { isLoading: loadingLatest, data: latestData },
    { isLoading: loadingTopRated, data: topRatedData },
    { isLoading: loadingUpComming, data: upCommingData },
  ] = useGetMovieQuerys();

  const onOverlayClick = () => navigate(-1);

  useLayoutEffect(() => {
    async function bgArrayRandomFunction() {
      const result = await bgArrayRandom(
        0,
        Number(latestData?.results.length) - 1 || 19
      );
      setRandomNumber(() => result);
      const maxIndex = Math.floor(latestData?.results.length! / offset) - 1;
      setMaxIndex(maxIndex);
    }

    bgArrayRandomFunction();
  }, [latestData?.results.length]);

  const onBoxClicked = (
    movieId: number,
    popularity: number,
    vote_average: number,
    vote_count: number,
    adult: boolean,
    backdrop_path: string,
    poster_path: string,
    overview: string,
    original_title: string,
    original_language: string,
    release_date: string
  ) => {
    if (original_title !== undefined) {
      original_title = original_title.replace("/", "");
      original_title = original_title.replace(":", "");
    }
    if (original_language !== undefined) {
      original_language = original_language.replace("/", "");
      original_language = original_language.replace(":", "");
    }
    if (overview !== undefined) {
      overview = overview.replace("/", "");
      overview = overview.replace(":", "");
    }
    if (poster_path !== undefined) {
      poster_path = poster_path.replace("/", "");
      poster_path = poster_path.replace(":", "");
    }
    if (backdrop_path !== undefined) {
      backdrop_path = backdrop_path.replace("/", "");
      backdrop_path = backdrop_path.replace(":", "");
    }
    if (release_date !== undefined) {
      release_date = release_date.replace("/", "");
      release_date = release_date.replace(":", "");
    }

    // console.log("movieId", movieId);
    // console.log("popularity", popularity);
    // console.log("vote_average", vote_average);
    // console.log("vote_count", vote_count);

    // console.log("adult", adult);
    // console.log("backdrop_path", backdrop_path);
    // console.log("poster_path", poster_path);

    // console.log("overview", overview);
    // console.log("original_title", original_title);
    // console.log("original_language", original_language);
    // console.log("release_date", release_date);

    popularity = Math.round(popularity);
    vote_average = Math.floor(Math.round(vote_average) / 2);
    vote_count = Math.round(vote_count);

    if (vote_average >= 5) {
      vote_average = 5;
    }

    if (overview.length >= 400) {
      overview = overview.substring(0, 400);
      overview = overview + "...";
    }

    // console.log(overview.length);

    navigate(
      `/movie/latest/${movieId}/${dummyDataMsgMake(
        original_title,
        "title"
      )}/${dummyDataMsgMake(original_language, "Language")}/${dummyDataMsgMake(
        overview,
        "overview"
      )}/${dummyDataMsgMake(poster_path, "posterPath")}/${dummyDataMsgMake(
        backdrop_path,
        "backdropPath"
      )}/${dummyDataMsgMake(
        release_date,
        "releaseDate"
      )}/${popularity}/${vote_average}/${vote_count}/${adult}`
    );
  };

  const leftIndex = (index: number, value: string, data: any) => {
    if (data) {
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
      const totalMovies = data.results.length;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setMaxIndex(maxIndex);
      //  console.log(maxIndex);

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
      <Wrapper>
        {loadingLatest && loadingTopRated && loadingUpComming ? (
          <>
            <Loader>
              <span>로딩중...</span>
            </Loader>
          </>
        ) : (
          <>
            <Banner
              bgphoto={makeImgPath(
                latestData?.results[randomNumber || 19].backdrop_path || ""
              )}
            >
              <Title>
                {latestData?.results[randomNumber || 19].original_title}
              </Title>
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
                  <AnimatePresence initial={false}>
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
                                movie.popularity,
                                movie.vote_average,
                                movie.vote_count,
                                movie.adult,
                                movie.backdrop_path,
                                movie.poster_path,
                                movie.overview,
                                movie.original_title,
                                movie.original_language,
                                movie.release_date
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
                            <Info variants={infoVariants}>
                              <h4>{movie.original_title}</h4>
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
                  <AnimatePresence initial={false}>
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
                                movie.popularity,
                                movie.vote_average,
                                movie.vote_count,
                                movie.adult,
                                movie.backdrop_path,
                                movie.poster_path,
                                movie.overview,
                                movie.original_title,
                                movie.original_language,
                                movie.release_date
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
                            <Info variants={infoVariants}>
                              <h4>{movie.original_title}</h4>
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

                <UpcommingSlider>
                  <AnimatePresence initial={false}>
                    <span style={{ position: "absolute", bottom: "-250px" }}>
                      Upcomming
                    </span>

                    <UpcommingRow
                      variants={UpcommingRowVariants}
                      initial={upCommingIndex > 0 ? "hidden" : "exit"}
                      animate="visible"
                      exit={upCommingIndex < maxIndex ? "exit" : "hidden"}
                      transition={{ type: "tween", duration: 1 }}
                      key={upCommingIndex}
                    >
                      {upCommingIndex > 0 ? (
                        <LeftBtn
                          onClick={() =>
                            leftIndex(
                              upCommingIndex,
                              movieStatus.upComming,
                              upCommingData
                            )
                          }
                        >
                          <span>{"<"}</span>
                        </LeftBtn>
                      ) : null}

                      {upCommingData?.results
                        .slice(
                          offset * upCommingIndex,
                          offset * upCommingIndex + offset
                        )
                        .map((movie) => (
                          <Box
                            layoutId={String(movie.id)}
                            key={movie.id}
                            onClick={() =>
                              onBoxClicked(
                                movie.id,
                                movie.popularity,
                                movie.vote_average,
                                movie.vote_count,
                                movie.adult,
                                movie.backdrop_path,
                                movie.poster_path,
                                movie.overview,
                                movie.original_title,
                                movie.original_language,
                                movie.release_date
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
                            <Info variants={infoVariants}>
                              <h4>{movie.original_title}</h4>
                            </Info>
                          </Box>
                        ))}

                      {upCommingIndex === maxIndex ? null : (
                        <RightBtn
                          onClick={() =>
                            rightIndex(
                              upCommingIndex,
                              movieStatus.upComming,
                              upCommingData
                            )
                          }
                        >
                          <span>{">"}</span>
                        </RightBtn>
                      )}
                    </UpcommingRow>
                  </AnimatePresence>
                </UpcommingSlider>

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
                      <BigMovie layoutId={moviePathMatch.params.movieId}>
                        <DetailMovie>
                          <IsAdult>
                            <div style={{ marginLeft: "10px" }}>
                              {rating(
                                Number(moviePathMatch.params.vote_average)
                              )}
                            </div>
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
                                "/" + moviePathMatch.params.poster_path!
                              )})`,
                              backgroundSize: `contain`,
                              backgroundRepeat: `no-repeat`,
                              backgroundPosition: "center",
                            }}
                          />
                          <DetailMovieBottom>
                            <DetailMovieTitle>
                              {decodeURIComponent(
                                moviePathMatch.params.original_title ||
                                  "error - 1"
                              )}
                            </DetailMovieTitle>
                            <div
                              style={{
                                display: "flex",
                                width: "100%",
                                justifyContent: "space-between",
                                alignContent: "center",
                                padding: "20px",
                              }}
                            >
                              <div>
                                <span>
                                  출시일: &nbsp;
                                  {moviePathMatch.params.release_date}
                                </span>
                              </div>
                              <div>
                                <FaChessQueen /> &nbsp;
                                <span>{moviePathMatch.params.popularity}</span>
                              </div>
                              <div>
                                <FaHeart style={{ color: "tomato" }} />
                                &nbsp;
                                <span>{moviePathMatch.params.vote_count}</span>
                              </div>
                            </div>
                            <div>
                              {decodeURIComponent(
                                moviePathMatch.params.overview || "error - 2"
                              )}
                            </div>
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
