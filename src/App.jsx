import "./App.css";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import RedirectToMovie from "./components/RedirectToMovie";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { Typography, CircularProgress } from "@mui/material";
import Loadable from "react-loadable";

const darkTheme = createTheme({
	palette: {
		mode: "dark",
	},
});

const Loading = () => <CircularProgress />;

const AsyncHome = Loadable({
	loader: () => import("./components/Home"),
	loading: Loading,
});

const AsyncMovieSearch = Loadable({
	loader: () => import("./components/MovieSearch"),
	loading: Loading,
});

const AsyncMovie = Loadable({
	loader: () => import("./components/Movie"),
	loading: Loading,
});

const AsyncMoviesByGenre = Loadable({
	loader: () => import("./components/MoviesByGenre"),
	loading: Loading,
});

const queryClient = new QueryClient();

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={darkTheme}>
				<CssBaseline />
				<Header />
				<Routes>
					<Route path="/" element={<AsyncHome />} />
					<Route path="/search" element={<AsyncMovieSearch />} />
					<Route path="/pelicula/:id" element={<AsyncMovie />} />
					<Route path="/movie/:id" element={<RedirectToMovie />} />
					<Route path="/genre/:id" element={<AsyncMoviesByGenre />} />
					<Route
						path="*"
						element={
							<Typography variant="h2" sx={{ mt: 25, ml: 25 }}>
								Error 404: Page not found!
							</Typography>
						}
					/>
				</Routes>
			</ThemeProvider>

			{/* <ReactQueryDevtools initialIsOpen={false} /> */}
		</QueryClientProvider>
	);
}

export default App;
