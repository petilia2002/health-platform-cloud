import FeatureCards from "./FeatureCards/FeatureCards";
import HeroCards from "./HeroCards/HeroCards";
import Info from "./Info/Info";
import classes from "./Home.module.css";

export default function Home() {
  return (
    <div className={classes.home}>
      <HeroCards />
      <FeatureCards />
      <Info />
    </div>
  );
}
