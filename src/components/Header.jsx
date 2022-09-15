import "./Header.css";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

export default function Header() {
	const navigate = useNavigate();
	return (
		<header className="header">
			<div className="navbar">
				<span
					className="logo"
					onClick={() => {
						navigate("/");
					}}
				>
					Hackflix
				</span>

				<Button
					variant="text"
					color="inherit"
					onClick={() => {
						navigate("/search");
					}}
				>
					Search
				</Button>
			</div>
		</header>
	);
}
