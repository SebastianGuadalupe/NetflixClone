import SliderSlick from "react-slick";
import "./Slider.css";
import MovieCard from "./MovieCard";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function shuffle(array) {
	let currentIndex = array.length,
		randomIndex;

	// While there remain elements to shuffle.
	while (currentIndex !== 0) {
		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex],
			array[currentIndex],
		];
	}

	return array;
}

export default function Slider({ genreId, genreName }) {
	const [filteredMovies, setFilteredMovies] = useState([]);
	const navigate = useNavigate();

	let fetching;

	const settings = {
		infinite: true,
		speed: 500,
		slidesToShow: 5,
		slidesToScroll: 5,
		adaptiveHeight: true,
		// lazyLoad: true,
		responsive: [
			{
				breakpoint: 700,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2,
				},
			},
			{
				breakpoint: 900,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 3,
				},
			},
			{
				breakpoint: 1200,
				settings: {
					slidesToShow: 4,
					slidesToScroll: 4,
				},
			},
		],
	};

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
					page: "1",
					with_genres: genreId,
					"vote_count.gte": "500",
				},
			});
			setFilteredMovies(shuffle([...response.data.results]));
		} finally {
			fetching = false;
		}
	});

	useEffect(() => {
		setFilteredMovies([]);
		fetchItems();
		// eslint-disable-next-line
	}, []);

	return (
		<div className="slider">
			<Typography
				variant="h4"
				sx={{ ml: 5, cursor: "pointer", width: "fit-content" }}
				onClick={() => {
					navigate("/genre/" + genreId);
				}}
			>
				{genreName}
			</Typography>
			<SliderSlick {...settings}>
				{filteredMovies &&
					filteredMovies.map((movie) => {
						return <MovieCard key={movie.id} id={movie.id} />;
					})}
			</SliderSlick>
		</div>
	);
}
