import {
	Rating,
	Typography,
	Box,
	Modal,
	Card,
	CardMedia,
	CardActionArea,
	CardContent,
	Button,
	Skeleton,
} from "@mui/material";
import "./MovieCard.css";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useQuery } from "react-query";
import { Buffer } from "buffer";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 800,
	bgcolor: "background.paper",
	p: 4,
};

export default function MovieCard({ id }) {
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const movieId = id;

	const [hovering, setHovering] = useState();

	const {
		isLoading: movieIsLoading,
		isError: movieIsError,
		data: movie,
		error: movieError,
	} = useQuery(id.toString(), async () => {
		const response = await axios({
			method: "GET",
			url: `https://api.themoviedb.org/3/movie/${movieId}`,
			params: {
				api_key: process.env.REACT_APP_API_KEY,
				append_to_response: "videos,images",
			},
		});
		return response.data;
	});

	const {
		isLoading: backdropIsLoading,
		isError: backdropIsError,
		data: backdrop,
		error: backdropError,
	} = useQuery(
		["b" + id, movie],
		async () => {
			const response = await axios({
				method: "GET",
				url: movie.backdrop_path
					? "https://image.tmdb.org/t/p/w400" + movie.backdrop_path
					: "https://media.self.com/photos/587961f26238873b04605c65/16:9/w_1920,h_1080,c_limit/netflix-logo.png",
				responseType: "arraybuffer",
			});
			let raw = Buffer.from(response.data).toString("base64");
			return "data:" + response.headers["content-type"] + ";base64," + raw;
		},
		{
			enabled: !!movie,
		}
	);

	const {
		isLoading: logoIsLoading,
		isError: logoIsError,
		data: logo,
		error: logoError,
	} = useQuery(
		["l" + id, movie],
		async () => {
			let url = movie.images.logos.find(
				(element) => element.iso_639_1?.toLowerCase() === "en"
			);
			url = url ? url.file_path : movie.images.logos[0].file_path;
			const response = await axios({
				method: "GET",
				url: "https://image.tmdb.org/t/p/w200" + url,
				responseType: "arraybuffer",
			});
			let raw = Buffer.from(response.data).toString("base64");
			return "data:" + response.headers["content-type"] + ";base64," + raw;
		},
		{
			enabled: movie?.images.logos.length > 0,
		}
	);

	if (movieIsLoading || backdropIsLoading) {
		return (
			<Card className="movie-card">
				<Skeleton variant="rectangular" height={"10vw"} width={"17.7vw"} />
			</Card>
		);
	}

	if (movieIsError) {
		return <span>Error: {movieError.message}</span>;
	}

	if (backdropIsError) {
		return <span>Error: {backdropError.message}</span>;
	}

	return (
		<>
			<Card
				className="movie-card"
				sx={{
					width: 0.23,
					transition: "transform 0.3s, border 0.3s",
					"&:hover": {
						transform: "scale(1.5)",
						zIndex: 1000,
					},
				}}
			>
				<CardActionArea
					onClick={handleOpen}
					onMouseEnter={() => setHovering(true)}
					onMouseLeave={() => setHovering(false)}
				>
					<CardContent sx={{ padding: 0 }}>
						<CardMedia
							component="img"
							image={backdrop}
							className="movie-backdrop"
						/>
						{hovering && (
							<CardMedia
								className="card-trailer"
								component="iframe"
								title="Trailer"
								src={`https:/www.youtube-nocookie.com/embed/${
									movie.videos.results.find(
										(element) => element.type?.toLowerCase() === "trailer"
									)?.key ?? movie.videos.results[0]?.key
								}?autoplay=1&controls=0&mute=1&loop=1&modestbranding=1&showinfo=0&enablejsapi=1&widgetid=3&playlist=${
									movie.videos.results.find(
										(element) => element.type?.toLowerCase() === "trailer"
									)?.key ?? movie.videos.results[0]?.key
								}`}
								frameBorder="0"
								height={720}
							/>
						)}
						{movie.images.logos.length === 0 ? (
							<Typography className="card-logo">{movie.title}</Typography>
						) : (
							<CardMedia
								component="img"
								image={logo}
								className="card-logo"
								alt=""
							/>
						)}
					</CardContent>
				</CardActionArea>
			</Card>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={{ ...style, display: "flex" }}>
					<Box>
						<img
							src={"https://image.tmdb.org/t/p/w300" + movie.poster_path}
							alt=""
							width={300}
							height={450}
						/>
					</Box>
					<Box sx={{ paddingLeft: 3 }}>
						<Typography id="modal-modal-title" variant="h6" component="h2">
							{movie.title}
						</Typography>
						<Typography component="legend">
							Rating {movie.vote_average}
						</Typography>
						<Rating
							name="movie-only"
							value={(movie.vote_average + 1.4) / 2}
							precision={0.5}
							readOnly
						/>
						<Typography id="modal-description" sx={{ mt: 2, mb: 3 }}>
							{movie.overview}
						</Typography>
						<Link className="button-modal" to={"/pelicula/" + movie.id}>
							<Button variant="outlined" as="span" sx={{ padding: 1 }}>
								Ver más
							</Button>
						</Link>
					</Box>
				</Box>
			</Modal>
		</>
	);
}
