import Hero from "./sections/Hero.jsx";
import ShowcaseSection from "./sections/ShowcaseSection.jsx";
import Navbar from "./components/Navbar.jsx";
import NavbarB from "./components/NavbarB.jsx";
import LogoSection from "./components/LogoSection.jsx";

const App = () => {
    return (
        <>
            <NavbarB />
            <Hero />
            <ShowcaseSection />
            <LogoSection />
        </>
    )
}
export default App
