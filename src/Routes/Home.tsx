import { IGetMoviesResult, getMovies } from "../api";
import styled from "styled-components";
import { bgArrayRandom, makeImgPath } from "./Util";
import { useQuery } from "@tanstack/react-query";
import { useLayoutEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useMatch, PathMatch } from "react-router-dom";

const Wrapper = styled.div`
  background-color: black;
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

const Slider = styled.div`
  position: relative;
  top: -100px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
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

const IsAdultDetail = styled(motion.div)<{ isAdult: boolean }>`
  border-radius: 10px;
  background-color: ${(props) => (props.isAdult ? `green` : `tomato`)};
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

const rowVariants = {
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

export default function Home() {
  const navigate = useNavigate();
  const moviePathMatch: PathMatch<string> | null = useMatch(
    "/movie/:id/:title/:releaseDate/:language/:popularity/:voteAverage/:voteCount/:posterPath/:adult"
  );
  console.log(moviePathMatch);

  const [randomNumber, setRandomNumber] = useState(0);
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const toggleLeving = () => setLeaving((current) => !current);

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
      `/movie/${movieId}/${title}/${releaseDate}/${language}/${popularity}/${voteAverage}/${voteCount}/${posterPath?.replace(
        "/",
        ""
      )}/${adult}`
    );
  };

  const incraseIndex = () => {
    if (data) {
      if (leaving) {
        return;
      } else {
        toggleLeving();
        const totalMovies = data.results.length;
        const maxIndex = Math.floor(totalMovies / offset) - 1;
        return setIndex((current) => (current === maxIndex ? 0 : current + 1));
      }
    }
  };

  const { data, isLoading } = useQuery<IGetMoviesResult>({
    queryKey: ["movies", "nowPlaying"],
    queryFn: getMovies,
  });

  const onOverlayClick = () => navigate(-1);

  useLayoutEffect(() => {
    async function bgArrayRandomFunction() {
      const result = await bgArrayRandom(0, data?.results.length! - 1 || 19);
      setRandomNumber(() => result);
      console.log(result);
    }
    bgArrayRandomFunction();
  }, []);

  //console.log(randomNumber);

  return (
    <>
      <Wrapper>
        {isLoading ? (
          <>
            <Loader>
              <span>로딩중</span>
            </Loader>
          </>
        ) : (
          <>
            <Banner
              onClick={incraseIndex}
              bgphoto={makeImgPath(
                data?.results[randomNumber || 19].backdrop_path || ""
              )}
            >
              <Title>{data?.results[randomNumber || 19].title}</Title>
              <Overview>{data?.results[randomNumber || 19].overview}</Overview>
            </Banner>
            <Slider>
              <AnimatePresence initial={false} onExitComplete={toggleLeving}>
                <Row
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ type: "tween", duration: 1 }}
                  key={index}
                >
                  {data?.results
                    .slice(offset * index, offset * index + offset)
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
                        bgphoto={makeImgPath(movie.backdrop_path || "", "w500")}
                      >
                        <img />
                        <Info variants={infoVariants}>
                          <h4>{movie.title}</h4>
                        </Info>
                      </Box>
                    ))}
                </Row>
              </AnimatePresence>
            </Slider>
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
                          isAdult={Boolean(moviePathMatch.params.adult)}
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
          </>
        )}
      </Wrapper>
    </>
  );
}
