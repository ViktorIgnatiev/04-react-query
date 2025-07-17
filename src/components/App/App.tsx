import { useState } from 'react';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { fetchMovies } from '../../services/movieService';
import ReactPaginate from 'react-paginate';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import styles from './App.module.css';

export default function App() {
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['movies', query, page],
        queryFn: () => fetchMovies(query, page),
        enabled: !!query,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

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
            <SearchBar onSubmit={handleSearch} />
            
            {isLoading && <Loader />}
            {isError && <ErrorMessage />}
            
            {data?.results && data.results.length > 0 && (
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
            
            {data?.results?.length === 0 && !isLoading && (
                <p>No movies found for your request.</p>
            )}
            
            {selectedMovie && (
                <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
            )}
        </div>
    );
}