import { Rating, Typography } from "@mui/material";
import "./Filter.css";

export default function Filter({ rating, setRating }) {
	return (
		<div className="rating">
			<Typography>Filtrar por rating:</Typography>
			<Rating
				key={rating}
				name="rating"
				defaultValue={(rating + 2) / 2 ?? 0}
				precision={0.5}
				onChange={(event, value) => {
					setRating && (value >= 2 ? setRating(value * 2 - 2) : setRating(2));
				}}
			/>
		</div>
	);
}
