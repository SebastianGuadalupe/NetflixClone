import "./Movie.css";
import "./Home.css";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { useCallback, useState, useEffect } from "react";
import { Button } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useNavigate } from "react-router-dom";
import Slider from "./Slider";

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

export default function Home() {
	const [trendingMovie, setTrendingMovie] = useState();
	const [logoPath, setLogoPath] = useState();
	const [trailerKey, setTrailerKey] = useState();
	const navigate = useNavigate();

	let fetching = false;

	const fetchItems = useCallback(async () => {
		if (fetching) {
			return;
		}

		fetching = true;

		try {
			const response = await axios({
				method: "GET",
				url: "https://api.themoviedb.org/3/trending/movie/day",
				params: {
					api_key: process.env.REACT_APP_API_KEY,
					include_adult: "false",
					"vote_count.gte": "500",
					append_to_response: "videos,images",
				},
			});
			const movie = await axios({
				method: "GET",
				url: `https://api.themoviedb.org/3/movie/${response.data.results[0].id}`,
				params: {
					api_key: process.env.REACT_APP_API_KEY,
					append_to_response: "videos,images",
				},
			});
			setTrendingMovie(movie.data);
			setLogoPath(
				movie.data.images.logos.find(
					(element) => element.iso_639_1.toLowerCase() === "en"
				).file_path
			);
			setTrailerKey(
				movie.data.videos.results.find(
					(element) => element.type.toLowerCase() === "Trailer".toLowerCase()
				).key
			);
		} finally {
			fetching = false;
		}
	});

	useEffect(() => {
		fetchItems();
	}, []);

	return (
		<>
			{trendingMovie ? (
				<div>
					<div className="backdrop">
						<iframe
							width="100%"
							height="100%"
							src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&controls=0&mute=1&loop=1&modestbranding=1&showinfo=0&enablejsapi=1&widgetid=3&playlist=${trailerKey}`}
							title="Trailer"
							frameBorder="0"
							allow="autoplay"
						/>
					</div>
					<div className="backdrop-info">
						<img
							src={`https://image.tmdb.org/t/p/w300${logoPath}`}
							alt=""
							fetchpriority="high"
						/>
						<div className="info-buttons">
							<Button
								variant="contained"
								color="inherit"
								sx={{ color: "black", mt: 3, width: 0.3 }}
							>
								<PlayArrowIcon sx={{ mr: 1 }} /> Play
							</Button>
							<Button
								variant="contained"
								sx={{
									backgroundColor: "darkslategray",
									color: "white",
									mt: 3,
									width: 0.5,
									ml: 1,
								}}
								onClick={() => {
									navigate("/pelicula/" + trendingMovie.id);
								}}
							>
								<InfoOutlinedIcon sx={{ mr: 1 }} /> More info
							</Button>
						</div>
					</div>
				</div>
			) : (
				<div className="loader" key={0}>
					<div className="backdrop-loading"></div>
				</div>
			)}
			{genres.map((genre, index) => {
				return <Slider key={index} genreName={genre.name} genreId={genre.id} />;
			})}
		</>
	);
}
