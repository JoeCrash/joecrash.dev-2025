import { socialImgs } from "../constants";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="flex flex-col justify-center">

                </div>
                <div className="socials">
                    {socialImgs.map(({imgPath, url}, index) => (
                        <a target="_blank" href={url} key={index} className="icon">
                            <img src={imgPath} alt="social icon" />
                        </a>
                    ))}
                </div>
                <div className="flex flex-col justify-center">
                    <p className="text-center md:text-end">
                        © {new Date().getFullYear()} JoeCrash.dev | All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;