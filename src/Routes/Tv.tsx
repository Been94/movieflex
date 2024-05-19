import {
  IGetMoviesResult,
  getMovies,
  getMoviesTopRated,
  getMoviesUpcoming,
  getTv,
  getTvAiringToday,
  getTvPopular,
  getTvTopRated,
} from "../api";
import styled from "styled-components";
import { tvStatus, bgArrayRandom, makeImgPath } from "./Util";
import { useQuery } from "@tanstack/react-query";
import { useLayoutEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useMatch, PathMatch } from "react-router-dom";

const Wrapper = styled.div`
  background-color: black;
  height: 85vh;
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

const TvLatestSlider = styled.div`
  position: relative;
`;

const TvTopRatedSlider = styled.div`
  position: relative;
`;

const TvPopularSlider = styled.div`
  position: relative;
`;

const TvAiringTodaySlider = styled.div`
  position: relative;
`;

const TvLatestRow = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  bottom: 30px;
  width: 100%;
`;

const TvAiringTodayRow = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  width: 100%;
  position: absolute;
  top: 5px;
`;

const TvPopularRow = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  top: 250px;

  //position: absolute;

  width: 100%;
`;

const TvTopRatedRow = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  top: 500px;

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

const TvAiringTodayRowVariants = {
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

const TvPopularRowVariants = {
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

const TvTopRatedRowVariants = {
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

export default function Tv() {
  const navigate = useNavigate();
  const moviePathMatch: PathMatch<string> | null = useMatch(
    "/tv/latest/:id/:title/:releaseDate/:language/:popularity/:voteAverage/:voteCount/:posterPath/:adult"
  );
  //console.log(moviePathMatch);

  const [randomNumber, setRandomNumber] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);

  const [tvLatestIndex, setTvLatestIndex] = useState(0);
  const [tvAiringTodayIndex, setTvAiringTodayIndex] = useState(0);
  const [tvPopularIndex, setTvPopularIndex] = useState(0);
  const [tvTopRatedIndex, setTvTopRatedIndex] = useState(0);

  const [tvLatestLeaving, setTvLatestLeaving] = useState(false);
  const [tvAiringTodayLeaving, setTvAiringTodayLeaving] = useState(false);
  const [tvPopularLeaving, setTvPopularLeaving] = useState(false);
  const [tvTopRatedLeaving, setTvTopRatedLeaving] = useState(false);

  const useGetTvQuerys = () => {
    const tvLatest = useQuery<IGetMoviesResult>({
      queryKey: ["tv", "tvLatest"],
      queryFn: getTv,
    });
    const tvAiringToday = useQuery<IGetMoviesResult>({
      queryKey: ["tv", "tvAiringToday"],
      queryFn: getTvAiringToday,
    });

    const tvPopular = useQuery<IGetMoviesResult>({
      queryKey: ["tv", "tvPopular"],
      queryFn: getTvPopular,
    });

    const tvTopRated = useQuery<IGetMoviesResult>({
      queryKey: ["tv", "tvTopRated"],
      queryFn: getTvTopRated,
    });

    return [tvLatest, tvAiringToday, tvPopular, tvTopRated];
  };

  const [
    { isLoading: loadingLatest, data: tvLatestData },
    { isLoading: loadingAiringToday, data: tvAiringTodayData },
    { isLoading: loadingPopular, data: tvPopularData },
    { isLoading: loadingTopRated, data: tvTopRatedData },
  ] = useGetTvQuerys();

  const onOverlayClick = () => navigate(-1);

  useLayoutEffect(() => {
    async function bgArrayRandomFunction() {
      const result = await bgArrayRandom(
        0,
        tvLatestData?.results.length! - 1 || 19
      );
      setRandomNumber(() => result);
      const maxIndex = Math.floor(tvLatestData?.results.length! / offset) - 1;
      setMaxIndex(maxIndex);
      // console.log(result);
      //console.log("topRated:", topRatedData?.results.length);
    }

    bgArrayRandomFunction();
  }, []);

  const tvLatestToggleLeving = () => setTvLatestLeaving((current) => !current);

  const tvAiringTodayToggleLeving = () =>
    setTvAiringTodayLeaving((current) => !current);

  const tvPopularToggleLeving = () =>
    setTvPopularLeaving((current) => !current);

  const tvTopRatedToggleLeving = () =>
    setTvTopRatedLeaving((current) => !current);

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
      `/tv/latest/${movieId}/${title}/${releaseDate}/${language}/${popularity}/${voteAverage}/${voteCount}/${posterPath?.replace(
        "/",
        ""
      )}/${adult}`
    );
  };

  const leftIndex = (index: number, value: string, data: any) => {
    if (data) {
      if (value === tvStatus.latest) {
        tvLatestToggleLeving();
      }

      if (value === tvStatus.airingToday) {
        tvAiringTodayToggleLeving();
      }

      if (value === tvStatus.popular) {
        tvPopularToggleLeving();
      }
      if (value === tvStatus.rated) {
        tvTopRatedToggleLeving();
      }

      const totalMovies = data.results.length;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setMaxIndex(maxIndex);
      if (index === 0) {
        return;
      } else if (index > 0) {
        if (value === tvStatus.latest) {
          return setTvLatestIndex((current) => current - 1);
        }
        if (value === tvStatus.airingToday) {
          return setTvAiringTodayIndex((current) => current - 1);
        }
        if (value === tvStatus.popular) {
          return setTvPopularIndex((current) => current - 1);
        }
        if (value === tvStatus.rated) {
          return setTvTopRatedIndex((current) => current - 1);
        }
      } else if (index === maxIndex) {
        if (value === tvStatus.latest) {
          return setTvLatestIndex(0);
        }
        if (value === tvStatus.airingToday) {
          return setTvAiringTodayIndex(0);
        }
        if (value === tvStatus.popular) {
          return setTvPopularIndex(0);
        }
        if (value === tvStatus.rated) {
          return setTvTopRatedIndex(0);
        }
      }
    }
  };

  const rightIndex = (index: number, value: string, data: any) => {
    if (data) {
      if (value === tvStatus.latest) {
        tvLatestToggleLeving();
      }

      if (value === tvStatus.airingToday) {
        tvAiringTodayToggleLeving();
      }

      if (value === tvStatus.popular) {
        tvPopularToggleLeving();
      }
      if (value === tvStatus.rated) {
        tvTopRatedToggleLeving();
      }
      const totalMovies = data.results.length;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setMaxIndex(maxIndex);
      console.log(maxIndex);

      if (index >= 0) {
        if (value === tvStatus.latest) {
          return setTvLatestIndex((current) => current + 1);
        }
        if (value === tvStatus.airingToday) {
          return setTvAiringTodayIndex((current) => current + 1);
        }
        if (value === tvStatus.popular) {
          return setTvPopularIndex((current) => current + 1);
        }
        if (value === tvStatus.rated) {
          return setTvTopRatedIndex((current) => current + 1);
        }
      } else if (index === maxIndex) {
        if (value === tvStatus.latest) {
          return setTvLatestIndex(0);
        }
        if (value === tvStatus.airingToday) {
          return setTvAiringTodayIndex(0);
        }
        if (value === tvStatus.popular) {
          return setTvPopularIndex(0);
        }
        if (value === tvStatus.rated) {
          return setTvTopRatedIndex(0);
        }
      }
    }
  };

  // const { data, isLoading } = useQuery<IGetMoviesResult>({
  //   queryKey: ["movies", "latest"],
  //   queryFn: getMovies,
  // });

  //console.log(randomNumber);

  return (
    <>
      <Wrapper>
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
                tvLatestData?.results[randomNumber || 19].backdrop_path || ""
              )}
            >
              <Title>{tvLatestData?.results[randomNumber || 19].title}</Title>
              <Overview>
                {tvLatestData?.results[randomNumber || 19].overview}
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
                <TvLatestSlider>
                  <AnimatePresence
                    initial={false}
                    onExitComplete={tvLatestToggleLeving}
                  >
                    <span style={{ position: "absolute", top: "-260px" }}>
                      LatestTV
                    </span>
                    <TvLatestRow
                      variants={latestRowVariants}
                      initial={tvLatestIndex > 0 ? "hidden" : "exit"}
                      animate="visible"
                      exit={tvLatestIndex < maxIndex ? "exit" : "hidden"}
                      transition={{ type: "tween", duration: 1 }}
                      key={tvLatestIndex}
                    >
                      {tvLatestIndex > 0 ? (
                        <LeftBtn
                          onClick={() =>
                            leftIndex(
                              tvLatestIndex,
                              tvStatus.latest,
                              tvLatestData
                            )
                          }
                        >
                          <span>{"<"}</span>
                        </LeftBtn>
                      ) : null}

                      {tvLatestData?.results
                        .slice(
                          offset * tvLatestIndex,
                          offset * tvLatestIndex + offset
                        )
                        .map((tv) => (
                          <Box
                            layoutId={String(tv.id)}
                            key={tv.id}
                            onClick={() =>
                              onBoxClicked(
                                tv.id,
                                tv.adult,
                                tv.title,
                                tv.original_language,
                                tv.popularity,
                                tv.release_date,
                                tv.vote_average,
                                tv.vote_count,
                                tv.poster_path
                              )
                            }
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
                              <h4>{tv.title}</h4>
                            </Info>
                          </Box>
                        ))}

                      {tvLatestIndex === maxIndex ? null : (
                        <RightBtn
                          onClick={() =>
                            rightIndex(
                              tvLatestIndex,
                              tvStatus.latest,
                              tvLatestData
                            )
                          }
                        >
                          <span>{">"}</span>
                        </RightBtn>
                      )}
                    </TvLatestRow>
                  </AnimatePresence>
                </TvLatestSlider>

                <TvTopRatedSlider>
                  <AnimatePresence
                    initial={false}
                    onExitComplete={tvAiringTodayToggleLeving}
                  >
                    <span style={{ position: "absolute", bottom: "5px" }}>
                      TopRateTV
                    </span>
                    <TvAiringTodayRow
                      variants={TvAiringTodayRowVariants}
                      initial={tvAiringTodayIndex > 0 ? "hidden" : "exit"}
                      animate="visible"
                      exit={tvAiringTodayIndex < maxIndex ? "exit" : "hidden"}
                      transition={{ type: "tween", duration: 1 }}
                      key={tvAiringTodayIndex}
                    >
                      {tvAiringTodayIndex > 0 ? (
                        <LeftBtn
                          onClick={() =>
                            leftIndex(
                              tvAiringTodayIndex,
                              tvStatus.airingToday,
                              tvAiringTodayData
                            )
                          }
                        >
                          <span>{"<"}</span>
                        </LeftBtn>
                      ) : null}

                      {tvAiringTodayData?.results
                        .slice(
                          offset * tvAiringTodayIndex,
                          offset * tvAiringTodayIndex + offset
                        )
                        .map((tv) => (
                          <Box
                            layoutId={String(tv.id)}
                            key={tv.id}
                            onClick={() =>
                              onBoxClicked(
                                tv.id,
                                tv.adult,
                                tv.title,
                                tv.original_language,
                                tv.popularity,
                                tv.release_date,
                                tv.vote_average,
                                tv.vote_count,
                                tv.poster_path
                              )
                            }
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
                              <h4>{tv.title}</h4>
                            </Info>
                          </Box>
                        ))}

                      {tvAiringTodayIndex === maxIndex ? null : (
                        <RightBtn
                          onClick={() =>
                            rightIndex(
                              tvAiringTodayIndex,
                              tvStatus.airingToday,
                              tvAiringTodayData
                            )
                          }
                        >
                          <span>{">"}</span>
                        </RightBtn>
                      )}
                    </TvAiringTodayRow>
                  </AnimatePresence>
                </TvTopRatedSlider>

                <TvPopularSlider>
                  <AnimatePresence
                    initial={false}
                    onExitComplete={tvPopularToggleLeving}
                  >
                    <span style={{ position: "absolute", bottom: "-240px" }}>
                      Popular
                    </span>

                    <TvPopularRow
                      variants={TvPopularRowVariants}
                      initial={tvPopularIndex > 0 ? "hidden" : "exit"}
                      animate="visible"
                      exit={tvPopularIndex < maxIndex ? "exit" : "hidden"}
                      transition={{ type: "tween", duration: 1 }}
                      key={tvPopularIndex}
                    >
                      {tvPopularIndex > 0 ? (
                        <LeftBtn
                          onClick={() =>
                            leftIndex(
                              tvPopularIndex,
                              tvStatus.popular,
                              tvPopularData
                            )
                          }
                        >
                          <span>{"<"}</span>
                        </LeftBtn>
                      ) : null}

                      {tvPopularData?.results
                        .slice(
                          offset * tvPopularIndex,
                          offset * tvPopularIndex + offset
                        )
                        .map((tv) => (
                          <Box
                            layoutId={String(tv.id)}
                            key={tv.id}
                            onClick={() =>
                              onBoxClicked(
                                tv.id,
                                tv.adult,
                                tv.title,
                                tv.original_language,
                                tv.popularity,
                                tv.release_date,
                                tv.vote_average,
                                tv.vote_count,
                                tv.poster_path
                              )
                            }
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
                              <h4>{tv.title}</h4>
                            </Info>
                          </Box>
                        ))}

                      {tvPopularIndex === maxIndex ? null : (
                        <RightBtn
                          onClick={() =>
                            rightIndex(
                              tvPopularIndex,
                              tvStatus.popular,
                              tvPopularData
                            )
                          }
                        >
                          <span>{">"}</span>
                        </RightBtn>
                      )}
                    </TvPopularRow>
                  </AnimatePresence>
                </TvPopularSlider>

                <TvAiringTodaySlider>
                  <AnimatePresence
                    initial={false}
                    onExitComplete={tvTopRatedToggleLeving}
                  >
                    <span style={{ position: "absolute", bottom: "-490px" }}>
                      Airing Today
                    </span>

                    <TvTopRatedRow
                      variants={TvTopRatedRowVariants}
                      initial={tvTopRatedIndex > 0 ? "hidden" : "exit"}
                      animate="visible"
                      exit={tvTopRatedIndex < maxIndex ? "exit" : "hidden"}
                      transition={{ type: "tween", duration: 1 }}
                      key={tvTopRatedIndex}
                    >
                      {tvTopRatedIndex > 0 ? (
                        <LeftBtn
                          onClick={() =>
                            leftIndex(
                              tvTopRatedIndex,
                              tvStatus.rated,
                              tvTopRatedData
                            )
                          }
                        >
                          <span>{"<"}</span>
                        </LeftBtn>
                      ) : null}

                      {tvTopRatedData?.results
                        .slice(
                          offset * tvTopRatedIndex,
                          offset * tvTopRatedIndex + offset
                        )
                        .map((tv) => (
                          <Box
                            layoutId={String(tv.id)}
                            key={tv.id}
                            onClick={() =>
                              onBoxClicked(
                                tv.id,
                                tv.adult,
                                tv.title,
                                tv.original_language,
                                tv.popularity,
                                tv.release_date,
                                tv.vote_average,
                                tv.vote_count,
                                tv.poster_path
                              )
                            }
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
                              <h4>{tv.title}</h4>
                            </Info>
                          </Box>
                        ))}

                      {tvTopRatedIndex === maxIndex ? null : (
                        <RightBtn
                          onClick={() =>
                            rightIndex(
                              tvTopRatedIndex,
                              tvStatus.rated,
                              tvTopRatedData
                            )
                          }
                        >
                          <span>{">"}</span>
                        </RightBtn>
                      )}
                    </TvTopRatedRow>
                  </AnimatePresence>
                </TvAiringTodaySlider>

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
