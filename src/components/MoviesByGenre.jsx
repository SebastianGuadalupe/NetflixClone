import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import MovieCard from "./MovieCard";
import Filter from "./Filter";
import "./MoviesList.css";
import InfiniteScroll from "react-infinite-scroller";
import { Typography, CircularProgress } from "@mui/material";
import axios from "axios";

const genres = [
	{ id: 28, name: "Action" },
	{ id: 12, name: "Adventure" },
	{ id: 16, name: "Animation" },
	{ id: 35, name: "Comedy" },
	{ id: 80, name: "Crime" },
	{ id: 99, name: "Documentary" },
	{ id: 18, name: "Drama" },
	{ id: 10751, name: "Family" },
	{ id: 14, name: "Fantasy" },
	{ id: 36, name: "History" },
	{ id: 27, name: "Horror" },
	{ id: 10402, name: "Music" },
	{ id: 9648, name: "Mystery" },
	{ id: 10749, name: "Romance" },
	{ id: 878, name: "Science Fiction" },
	{ id: 53, name: "Thriller" },
	{ id: 10752, name: "War" },
	{ id: 37, name: "Western" },
];

export default function MoviesList() {
	const params = useParams();
	const genreId = params.id;
	const [rating, setRating] = useState(0);
	const [filteredMovies, setFilteredMovies] = useState([]);
	const [pageNumber, setPageNumber] = useState(1);

	let fetching = false;

	// eslint-disable-next-line
	const fetchItems = useCallback(async () => {
		if (fetching) {
			return;
		}

		fetching = true;

		try {
			const response = await axios({
				method: "GET",
				url: "https://api.themoviedb.org/3/discover/movie",
				params: {
					api_key: process.env.REACT_APP_API_KEY,
					sort_by: "popularity.desc",
					include_adult: "false",
					page: pageNumber,
					"vote_count.gte": "500",
					"vote_average.gte": rating,
					with_genres: genreId,
				},
			});
			setFilteredMovies([...filteredMovies, ...response.data.results]);
		} finally {
			setPageNumber(pageNumber + 1);

			fetching = false;
		}
	});

	useEffect(() => {
		setFilteredMovies([]);
		setPageNumber(1);
		fetchItems();
		// eslint-disable-next-line
	}, [rating]);

	return (
		<div
			style={{
				marginTop: 100,
				display: "flex",
				alignItems: "center",
				flexDirection: "column",
			}}
		>
			<Typography variant="h3">
				{genres.find((genre) => genre.id === Number(genreId)).name}
			</Typography>
			<Filter rating={rating} setRating={setRating} />
			<InfiniteScroll
				pageStart={0}
				loadMore={fetchItems}
				hasMore={true}
				loader={
					<div className="loader" key={0}>
						<CircularProgress />
					</div>
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
