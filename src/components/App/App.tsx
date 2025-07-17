import { useState } from 'react';
import toast from 'react-hot-toast';
import { fetchMovies } from '../../services/movieService';
import { Movie } from '../../types/movie';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import styles from './App.module.css';

// Виносимо логіку пошуку в окремий хук
function useMovieSearch() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const handleSearch = async (query: string) => {
        try {
            setIsLoading(true);
            setError(null);
            setMovies([]);
            
            const results = await fetchMovies(query);
            
            if (results.length === 0) {
                toast.error('No movies found for your request.');
            }
            
            setMovies(results);
        } catch (err) {
            setError('Failed to fetch movies');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    
    return { movies, isLoading, error, handleSearch };
}

export default function App() {
    const { movies, isLoading, error, handleSearch } = useMovieSearch();
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    const handleSelectMovie = (movie: Movie) => {
        setSelectedMovie(movie);
    };

    const handleCloseModal = () => {
        setSelectedMovie(null);
    };

    return (
        <div className={styles.container}>
            <SearchBar onSubmit={handleSearch} />
            
            {isLoading && <Loader />}
            {error && <ErrorMessage />}
            {movies.length > 0 && !isLoading && !error && (
                <MovieGrid movies={movies} onSelect={handleSelectMovie} />
            )}
            
            {selectedMovie && (
                <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
            )}
        </div>
    );
}