// components/Navbar.jsx
import {navLinks} from "../constants/index.js";
import {useEffect, useRef, useState} from "react";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {ScrollToPlugin} from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const splitGraphemes = (text) => {
    if (typeof Intl !== "undefined" && Intl.Segmenter) {
        const seg = new Intl.Segmenter(undefined, {granularity: "grapheme"});
        return [...seg.segment(text)].map((s) => s.segment);
    }
    return Array.from(text);
};

const NavbarB = () => {
    const [scrolled, setScrolled] = useState(false);
    const headerRef = useRef(null);

    // { [id]: { anchor, underline, activeTl, hoverTl } }
    const itemsRef = useRef({});
    const activeIdRef = useRef(null);

    const ensureTimelines = (id) => {
        const item = itemsRef.current[id];
        if (!item || item.activeTl) return;

        const {anchor, underline} = item;
        const label = anchor.querySelector(".nav-label");

        // underline: let CSS handle hover; JS sets width for "active"
        underline.style.transform = ""; // avoid transform/scale conflicts

        // --- Tutorial-style letter structure ---
        const topLetters = anchor.querySelectorAll(".letter > span:first-child");
        const bottomLetters = anchor.querySelectorAll(".letter > span:last-child");

        gsap.set(topLetters, {yPercent: 0, rotateZ: 0});
        gsap.set(bottomLetters, {yPercent: -112, rotateZ: 0});
        gsap.set(label, { transformOrigin: "left center", scale: 1 }); // baseline

        // Active state (no underline animation here to avoid width conflicts)
        // Bigger pop, slight settle, stronger lift
        item.activeTl = gsap.timeline({ paused: true })
            .to(anchor, { y: -4, duration: 0.18, ease: "power2.out" }, 0)
          .to(label,  { scale: 1.22, duration: 0.18, ease: "power2.out" }, 0)     // pop
          .to(label,  { scale: 1.14, duration: 0.32, ease: "back.out(2.2)" }, ">-0.02") // settle bigger
          .set(anchor, { fontWeight: 800 }, 0);

        // Hover: push-down swap per tutorial027
        item.hoverTl = gsap
            .timeline({paused: true, defaults: {ease: "power2.out"}})
            .to(topLetters, {
                yPercent: 100,
                rotateZ: 12,
                duration: 0.26,
                stagger: {each: 0.02, from: "start"},
            }, 0)
            .to(bottomLetters, {
                yPercent: 0,
                rotateZ: 0,
                duration: 0.26,
                stagger: {each: 0.02, from: "start"},
            }, 0)
            .add(() => {
                // reset so repeat hovers replay identically
                gsap.set(topLetters, {yPercent: 0, rotateZ: 0});
                gsap.set(bottomLetters, {yPercent: -112, rotateZ: 0});
            });
    };

    const activate = (id) => {
        if (activeIdRef.current === id) return;

        const prev = activeIdRef.current;
        if (prev && itemsRef.current[prev]?.activeTl) {
            const prevItem = itemsRef.current[prev];
            prevItem.activeTl.reverse();
            prevItem.underline && (prevItem.underline.style.width = "0");
            prevItem.anchor?.setAttribute("aria-current", "false");
        }

        ensureTimelines(id);
        const item = itemsRef.current[id];
        if (!item || !item.activeTl) {
          activeIdRef.current = id; // still track, but nothing to animate
          return;
        }
        item.activeTl.play();
        item.underline && (item.underline.style.width = "100%");
        item.anchor?.setAttribute("aria-current", "page");
        activeIdRef.current = id;
    };

    const scrollToId = (id) => {
        const el = document.getElementById(id);
        if (!el) return;
        const headerH = headerRef.current?.offsetHeight ?? 0;
        const offset = Math.max(headerH + 12, window.innerHeight * 0.12);
        const y = el.getBoundingClientRect().top + window.scrollY - offset;
        gsap.to(window, {duration: 0.7, scrollTo: y, ease: "power2.out"});
    };

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        onScroll();
        window.addEventListener("scroll", onScroll, {passive: true});
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const ids = navLinks.map(({link}) => link.replace("#", "")).filter(Boolean);

        // build timelines after paint
        requestAnimationFrame(() => ids.forEach(ensureTimelines));

        const triggers = ids
            .filter((id) => document.getElementById(id))
            .map((id) =>
                ScrollTrigger.create({
                    trigger: `#${id}`,
                    start: "top 60%",
                    end: "bottom 60%",
                    onEnter: () => activate(id),
                    onEnterBack: () => activate(id),
                })
            );

        return () => {
            triggers.forEach((t) => t.kill());
            ScrollTrigger.clearMatchMedia();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleHover = (id) => {
        const item = itemsRef.current[id];
        if (!item?.hoverTl) return;
        item.hoverTl.restart(true);
    };

    return (
        <header ref={headerRef} className={`navbar ${scrolled ? "scrolled" : "not-scrolled"}`}>
            <div className="inner">
                <a href="#hero" className="logo" onClick={(e) => {
                    e.preventDefault();
                    scrollToId("hero");
                }}>
                    JoeCrash
                </a>

                <nav className="desktop" aria-label="Primary">
                    <ul>
                        {navLinks.map(({link, name}) => {
                            const id = link.replace("#", "");
                            const chars = splitGraphemes(name);
                            return (
                                <li key={name} className="group">
                                    <a
                                        href={link}
                                        ref={(el) => {
                                            if (!el) return;
                                            const underline = el.querySelector(".underline");
                                            itemsRef.current[id] = {
                                                ...(itemsRef.current[id] || {}),
                                                anchor: el,
                                                underline
                                            };
                                        }}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            scrollToId(id);
                                            activate(id);
                                        }}
                                        onMouseEnter={() => handleHover(id)}
                                        onFocus={() => handleHover(id)}
                                        aria-current="false"
                                    >
                                        {/* accessible label */}
                                        <span className="sr-only">{name}</span>
                                        {/* nav B-style label */}
                                        <span className="nav-label" aria-hidden="true">
                                          {chars.map((ch, i) => (
                                              <span className="letter" key={`${id}-${i}`}>
                                              <span>{ch === " " ? "\u00A0" : ch}</span>
                                              <span>{ch === " " ? "\u00A0" : ch}</span>
                                            </span>
                                          ))}
                                        </span>

                                        {/* keep your existing underline for hover; JS sets width for active */}
                                        <span className="underline"/>
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <a
                    href="#contact"
                    className="contact-btn group"
                    onClick={(e) => {
                        e.preventDefault();
                        scrollToId("contact");
                        activate("contact");
                    }}
                >
                    <div className="inner"><span>Contact Me</span></div>
                </a>
            </div>
        </header>
    );
};

export default NavbarB;
