import { Navigate, useParams } from "react-router-dom";

export default function RedirectToMovie() {
	const params = useParams();
	if (!params.id) {
		return null;
	}
	return <Navigate to={"/pelicula/" + params.id} replace />;
}
