import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMovies } from '../../services/movieService';
import { Movie } from '../../types/movie';
import toast from 'react-hot-toast';
import ReactPaginate from 'react-paginate';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import { Toaster } from 'react-hot-toast';
import styles from './App.module.css';




export default function App() {
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: !!query,
    staleTime: 1000 * 60 * 5,
    placeholderData: { results: [], total_pages: 0, page: 1 },
    gcTime: 1000 * 60 * 5,
    retry: 2,
});

useEffect(() => {
    if (isError) {
        toast.error('Failed to fetch movies', { id: 'fetch-error' });
        return;
    }
    
    if (!isLoading && isSuccess && data?.results.length === 0 && query.trim() !== '' && page === 1) {
        toast.error('No movies found for your request', { id: 'no-results' });
    }
}, [isError, isSuccess, isLoading, data, query, page]);
    

    const handleSearch = (searchQuery: string) => {
        setQuery(searchQuery);
        setPage(1);
    };

    const handleSelectMovie = (movie: Movie) => {
        setSelectedMovie(movie);
    };

    const handleCloseModal = () => {
        setSelectedMovie(null);
    };

    const handlePageChange = ({ selected }: { selected: number }) => {
        setPage(selected + 1);
    };

    return (
        <div className={styles.container}>
            <Toaster position="top-center" />
            <SearchBar onSubmit={handleSearch} />
            
            {isLoading && query && <Loader />}
            {isError && <ErrorMessage />}
            
            {isSuccess && data.results.length > 0 && (
                <>
                    <MovieGrid 
                        movies={data.results} 
                        onSelect={handleSelectMovie} 
                    />
                    {data.total_pages > 1 && (
                        <ReactPaginate
                            pageCount={data.total_pages}
                            pageRangeDisplayed={5}
                            marginPagesDisplayed={1}
                            onPageChange={handlePageChange}
                            forcePage={page - 1}
                            containerClassName={styles.pagination}
                            activeClassName={styles.active}
                            nextLabel="→"
                            previousLabel="←"
                        />
                    )}
                </>
            )}
            
            {selectedMovie && (
                <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
            )}
        </div>
    );
}