import Hero from "./sections/Hero.jsx";
import ShowcaseSection from "./sections/ShowcaseSection.jsx";
import Navbar from "./components/Navbar.jsx";
import NavbarB from "./components/NavbarB.jsx";
import LogoSection from "./sections/LogoSection.jsx";
import FeatureCards from "./sections/FeatureCards.jsx";

const App = () => {
    return (
        <>
            <NavbarB />
            <Hero />
            <ShowcaseSection />
            <LogoSection />
            <FeatureCards />
        </>
    )
}
export default App
