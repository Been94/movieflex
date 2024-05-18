import { IGetMoviesResult, getMovies } from "../api";
import styled from "styled-components";
import { makeImgPath } from "./Util";
import { useQuery } from "@tanstack/react-query";

const Wrapper = styled.div`
  background-color: black;
`;

const Loader = styled.div`
  height: 20vh;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
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

export default function Home() {
  const { data, isLoading } = useQuery<IGetMoviesResult>({
    queryKey: ["movies", "nowPlaying"],
    queryFn: getMovies,
  });
  console.log(data);
  return (
    <>
      <Wrapper>
        {isLoading ? (
          <Loader>
            <span>로딩중</span>
          </Loader>
        ) : (
          <Banner bgPhoto={makeImgPath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
        )}
      </Wrapper>
    </>
  );
}
