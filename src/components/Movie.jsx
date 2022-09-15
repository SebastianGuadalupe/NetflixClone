import "./Movie.css";
import { Rating, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Movie() {
	const params = useParams();
	const movieId = params.id;
	const [Movie, setMovie] = useState(0);
	const [trailerKey, setTrailerKey] = useState();

	let fetching = false;

	// eslint-disable-next-line
	const fetchMovie = useCallback(async () => {
		if (fetching) {
			return;
		}
		fetching = true;

		try {
			const response = await axios.get(
				`https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.REACT_APP_API_KEY}&append_to_response=videos`
			);
			setMovie(response.data);
			setTrailerKey(
				response.data.videos.results.find(
					(element) => element.type?.toLowerCase() === "trailer"
				)?.key
			);
		} finally {
			fetching = false;
		}
	});
	useEffect(() => {
		fetchMovie();
		// eslint-disable-next-line
	}, []);

	return (
		<>
			{!fetching && Movie ? (
				<div className="Movie">
					<div className="backdrop">
						<iframe
							width="100%"
							height="100%"
							src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&controls=0&mute=1&loop=1&modestbranding=1&showinfo=0&enablejsapi=1&widgetid=3&playlist=${trailerKey}`}
							title="YouTube video player"
							frameBorder="0"
							allow="autoplay; encrypted-media;"
						/>
					</div>
					<div className="description">
						<Typography id="title" variant="h1" component="h1">
							{Movie.title}
						</Typography>
						<Typography
							id="subtitle"
							variant="subtitle1"
							component="h2"
							sx={{ ml: 3, mb: 3, fontStyle: "italic" }}
						>
							{Movie.tagline}
						</Typography>
						<div className="info">
							<div>
								<img
									src={
										"https://image.tmdb.org/t/p/original" + Movie.poster_path
									}
									alt=""
								/>
							</div>
							<div>
								<Rating
									name="movie-only"
									value={(Movie.vote_average + 1.4) / 2}
									precision={0.5}
									readOnly
								/>
								<Typography>Released: {Movie.release_date}</Typography>
								<Typography>Duration: {Movie.runtime}m</Typography>
								<Typography>
									Genres:{" "}
									{Movie.genres.map((genre, index) => {
										return (index ? ", " : "") + genre.name;
									})}
								</Typography>
								<Typography id="modal-modal-description" sx={{ mt: 2 }}>
									{Movie.overview}
								</Typography>
							</div>
						</div>
					</div>
				</div>
			) : (
				<div className="loader" key={0}>
					<CircularProgress />
				</div>
			)}
		</>
	);
}
