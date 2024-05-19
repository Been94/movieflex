import { ISearchResult, getSearchMovie, getSearchTv } from "../api";
import styled from "styled-components";
import { dummyDataMsgMake, makeImgPath, searchStatus } from "./Util";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMatch, PathMatch } from "react-router-dom";
import { FaChessQueen, FaHeart, FaStar } from "react-icons/fa";

const Wrapper = styled.div`
  background-color: rgba(0, 0, 0, 0.8);
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
  border: 1px solid white;
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
export default function Search() {
  const navigate = useNavigate();
  const moviePathMatch: PathMatch<string> | null = useMatch(
    "/search/latest/:searchId/:title/:Date/:language/:overview/:urlPath/:popularity/:vote_average/:vote_count/:adult"
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
    adult: boolean,
    searchId: number,
    popularity: number,
    vote_average: number,
    vote_count: number,
    backdrop_path: string,
    original_language: string,
    original_title: string,
    original_name: string,
    overview: string,
    poster_path: string,
    first_air_date: string,
    release_date: string,
    title: string,
    name: string
  ) => {
    if (backdrop_path != undefined) {
      backdrop_path = backdrop_path.replace("/", "");
    }

    if (original_language != undefined) {
      original_language = original_language.replace("/", "");
    }

    if (original_title != undefined) {
      original_title = original_title.replace("/", "");
    }

    if (original_name != undefined) {
      original_name = original_name.replace("/", "");
    }

    if (overview != undefined) {
      overview = overview.replace("/", "");
    }

    if (poster_path != undefined) {
      poster_path = poster_path.replace("/", "");
    }

    if (first_air_date != undefined) {
      first_air_date = first_air_date.replace("/", "");
    }

    if (release_date != undefined) {
      release_date = release_date.replace("/", "");
    }

    if (title != undefined) {
      title = title.replace("/", "");
    }

    if (name != undefined) {
      name = name.replace("/", "");
    }

    popularity = Math.round(popularity);
    vote_average = Math.round(vote_average);
    vote_count = Math.round(vote_count);
    if (vote_average >= 5) {
      vote_average = 5;
    }

    let tmpName: any;
    if (original_title !== undefined) {
      tmpName = original_title;
    }
    if (original_name !== undefined) {
      tmpName = original_name;
    }
    if (title !== undefined) {
      tmpName = title;
    }
    if (name !== undefined) {
      tmpName = name;
    }

    if (tmpName === undefined || "") {
      tmpName = undefined;
    }

    let tmpDate: any;

    if (first_air_date !== undefined) {
      tmpDate = first_air_date;
    }

    if (release_date !== undefined) {
      tmpDate = release_date;
    }

    if (tmpDate === undefined || "") {
      tmpDate = undefined;
    }

    let tmpPath: any;
    if (backdrop_path !== undefined) {
      tmpPath = backdrop_path;
    }
    if (poster_path !== undefined) {
      tmpPath = poster_path;
    }

    if (tmpPath === undefined || "") {
      tmpPath = undefined;
    }

    navigate(
      `/search/latest/${searchId}/${dummyDataMsgMake(
        tmpName!,
        "title"
      )}/${dummyDataMsgMake(tmpDate!, "Date")}/${dummyDataMsgMake(
        original_language,
        "language"
      )}/${dummyDataMsgMake(overview, "overview")}/${dummyDataMsgMake(
        tmpPath!,
        "urlPath"
      )}/${popularity}/${vote_average}/${vote_count}/${adult}`
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
                        .map((searchTv) => (
                          <Box
                            layoutId={String(searchTv.id)}
                            key={searchTv.id}
                            onClick={() =>
                              onBoxClicked(
                                searchTv.adult,
                                searchTv.id,
                                searchTv.popularity,
                                searchTv.vote_average,
                                searchTv.vote_count,
                                searchTv.backdrop_path,
                                searchTv.original_language,
                                searchTv.original_title,
                                searchTv.original_name,
                                searchTv.overview,
                                searchTv.poster_path,
                                searchTv.first_air_date,
                                searchTv.release_date,
                                searchTv.title,
                                searchTv.name
                              )
                            }
                            initial="normal"
                            whileHover="hover"
                            transition={{ type: "tween" }}
                            variants={boxVariants}
                            bgphoto={makeImgPath(
                              searchTv.backdrop_path || "",
                              "w500"
                            )}
                          >
                            <img />
                            <Info variants={infoVariants}>
                              <h4>{searchTv.original_name}</h4>
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
                        .map((searchTv) => (
                          <Box
                            layoutId={String(searchTv.id)}
                            key={searchTv.id}
                            onClick={() =>
                              onBoxClicked(
                                searchTv.adult,
                                searchTv.id,
                                searchTv.popularity,
                                searchTv.vote_average,
                                searchTv.vote_count,
                                searchTv.backdrop_path,
                                searchTv.original_language,
                                searchTv.original_title,
                                searchTv.original_name,
                                searchTv.overview,
                                searchTv.poster_path,
                                searchTv.first_air_date,
                                searchTv.release_date,
                                searchTv.title,
                                searchTv.name
                              )
                            }
                            initial="normal"
                            whileHover="hover"
                            transition={{ type: "tween" }}
                            variants={boxVariants}
                            bgphoto={makeImgPath(
                              searchTv.backdrop_path || "",
                              "w500"
                            )}
                          >
                            <img />
                            <Info variants={infoVariants}>
                              <h4>{searchTv.original_name}</h4>
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
                                "/" + moviePathMatch.params.posterPath!
                              )})`,
                              backgroundSize: `contain`,
                              backgroundRepeat: `no-repeat`,
                              backgroundPosition: "center",
                            }}
                          />
                          <DetailMovieBottom>
                            <DetailMovieTitle>
                              {moviePathMatch.params.title === undefined ? (
                                <span>unknown</span>
                              ) : (
                                <>
                                  {decodeURIComponent(
                                    moviePathMatch.params.title || "error - 1"
                                  )}
                                </>
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
                                  {moviePathMatch.params.releaseDate}
                                </span>
                              </div>
                              <div>
                                <FaChessQueen /> &nbsp;
                                <span>{moviePathMatch.params.popularity}</span>
                              </div>
                              <div>
                                {moviePathMatch.params.vote_count === "0" ? (
                                  <>
                                    <div />
                                  </>
                                ) : (
                                  <>
                                    <FaHeart style={{ color: "tomato" }} />
                                    &nbsp;
                                    <span>
                                      {moviePathMatch.params.vote_count}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                            <div>
                              {decodeURIComponent(
                                moviePathMatch.params.overview || ""
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
