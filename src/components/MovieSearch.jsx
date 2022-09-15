import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import "./MoviesList.css";
import "./MovieSearch.css";
import InfiniteScroll from "react-infinite-scroller";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { TextField } from "@mui/material";
import { useDebounce } from "use-debounce";

export default function MoviesList({ movies }) {
	const [filteredMovies, setFilteredMovies] = useState([]);
	const [pageNumber, setPageNumber] = useState(1);
	const [searchParams, setSearchParams] = useState("");
	const [debouncedSearch] = useDebounce(searchParams, 1000);
	const [hasMore, setHasMore] = useState(true);

	let fetching = false;

	async function getMovieFromApi() {
		if (fetching || !debouncedSearch || debouncedSearch.length < 3) {
			return;
		}
		try {
			const response = await axios.get(
				`https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_API_KEY}&query=${debouncedSearch}&page=${pageNumber}&include_adult=false`
			);
			setFilteredMovies([...filteredMovies, ...response.data.results]);
			if (response.data.results.length < 20) {
				setHasMore(false);
			}
		} catch (err) {
			console.log(err);
		} finally {
			setPageNumber(pageNumber + 1);
			fetching = false;
		}
	}

	useEffect(() => {
		// eslint-disable-next-line
		fetching = true;
		setFilteredMovies([]);
		setPageNumber(1);
		setHasMore(true);
		getMovieFromApi();
	}, [debouncedSearch]);

	return (
		<div className="search">
			<TextField
				id="search"
				label="Search"
				variant="outlined"
				color="primary"
				onChange={(event) => setSearchParams(event.target.value)}
			/>
			<InfiniteScroll
				pageStart={0}
				loadMore={getMovieFromApi}
				hasMore={hasMore}
				loader={
					debouncedSearch.length < 3 ? (
						<p key={1}>Waiting for search terms...</p>
					) : (
						<div className="loader" key={0}>
							<CircularProgress />
						</div>
					)
				}
			>
				<div className="movie-list">
					{filteredMovies.map((movie) => {
						return <MovieCard key={movie.id} id={movie.id} />;
					})}
				</div>
			</InfiniteScroll>
		</div>
	);
}
