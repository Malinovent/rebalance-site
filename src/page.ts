// Script for plain content pages (legal pages): fonts, styles and the language switch.
// No visit count here, so the scoreboard only counts landing-page visits.
import "@fontsource-variable/fraunces/opsz.css";
import "@fontsource/spline-sans-mono/latin-400.css";
import "@fontsource/spline-sans-mono/latin-500.css";
import "./styles.css";
import { wireLangSwitch } from "./lib/langSwitch";

wireLangSwitch(document, location.search);
