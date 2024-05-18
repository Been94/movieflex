import { IGetMoviesResult, IMovie, getMovies } from "../api";
import styled from "styled-components";
import { bgArrayRandom, makeImgPath } from "./Util";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useLayoutEffect, useState } from "react";
import { motion, AnimatePresence, delay } from "framer-motion";

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

const offset = 6;

export default function Home() {
  const [randomNumber, setRandomNumber] = useState(0);
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

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

  const toggleLeving = () => setLeaving((current) => !current);

  const { data, isLoading } = useQuery<IGetMoviesResult>({
    queryKey: ["movies", "nowPlaying"],
    queryFn: getMovies,
  });

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
                        key={movie.id}
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
          </>
        )}
      </Wrapper>
    </>
  );
}
