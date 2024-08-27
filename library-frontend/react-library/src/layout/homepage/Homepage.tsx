import { ExploreTopBooks } from './components/ExploreTopBooks';
import { Carousel } from './components/Carousel';
import { Hero } from './components/Hero';
import { LibraryService } from './components/LibraryServices';

export const Homepage = () => {
    return (
        <>
            <ExploreTopBooks />
            <Carousel />
            <Hero />
            <LibraryService />
        </>
    );
}