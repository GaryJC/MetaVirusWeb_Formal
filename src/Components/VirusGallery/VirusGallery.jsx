import { useSprings, animated, to as interpolate } from "@react-spring/web";
import { useDrag } from "react-use-gesture";
import { useState } from "react";
import { VirusModel } from "./VirusModels";
import "./virusGallery.scss";

const cards = [
  "/img/card_grimReaper.png",
  "/img/card_gloom.png",
  "/img/card_scorpion.png",
  "/img/card_worm.png",
  "/img/card_dragonFire.png",
  "/img/card_plantChewer.png",
  "/img/card_beem.png",
  "/img/card_golemStone.png",
  "/img/card_golemFire.png",
  "/img/card_golemIce.png",
];

// These two are just helpers, they curate spring data, values that are later being interpolated into css
const to = (i) => ({
  x: 0,
  y: i * -4,
  scale: 1,
  rot: -10 + Math.random() * 20,
  delay: i * 100,
});
const from = (_i) => ({ x: 0, rot: 0, scale: 1.5, y: -1500 });
// This is being used down there in the view, it interpolates rotation and scale into a css transform
const trans = (r, s) =>
  `perspective(1500px) rotateX(30deg) rotateY(${
    r / 10
  }deg) rotateZ(${r}deg) scale(${s})`;

function Deck() {
  const [cardIndex, setCardIndex] = useState(cards.length - 1);
  const [gone] = useState(() => new Set()); // The set flags all the cards that are flicked out
  const [props, api] = useSprings(cards.length, (i) => ({
    ...to(i),
    from: from(i),
  })); // Create a bunch of springs using the helpers above
  // Create a gesture, we're interested in down-state, delta (current-pos - click-pos), direction and velocity
  const bind = useDrag(
    ({ args: [index], down, movement: [mx], direction: [xDir], velocity }) => {
      const trigger = velocity > 0.2; // If you flick hard enough it should trigger the card to fly out
      const dir = xDir < 0 ? -1 : 1; // Direction should either point left or right
      if (!down && trigger) gone.add(index); // If button/finger's up and trigger velocity is reached, we flag the card ready to fly out
      api.start((i) => {
        if (index !== i) return; // We're only interested in changing spring-data for the current spring
        const isGone = gone.has(index);
        let x;
        if (isGone) {
          x = (200 + window.innerWidth) * dir;
          // if the card is out of screen, change model img
          if (index - 1 >= 0) {
            setCardIndex(index - 1);
          }
        } else if (down) {
          x = mx;
        } else {
          x = 0;
        }
        // const x = isGone ? (200 + window.innerWidth) * dir : down ? mx : 0; // When a card is gone it flys out left or right, otherwise goes back to zero
        const rot = mx / 100 + (isGone ? dir * 10 * velocity : 0); // How much the card tilts, flicking it harder makes it rotate faster
        const scale = down ? 1.5 : 1; // Active cards lift up a bit
        return {
          x,
          rot,
          scale,
          delay: undefined,
          config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 },
        };
      });
      if (!down && gone.size === cards.length)
        setTimeout(() => {
          gone.clear();
          api.start((i) => to(i));
          setCardIndex(cards.length - 1);
        }, 600);
    }
  );
  // Now we're just mapping the animated values to our view, that's it. Btw, this component only renders once. :-)
  return (
    <>
      <VirusModel index={cardIndex} />
      {props.map(({ x, y, rot, scale }, i) => (
        <animated.div className={"deck"} key={i} style={{ x, y }}>
          {/* This is the card itself, we're binding our gesture to it (and inject its index so we know which is which) */}
          <animated.div
            {...bind(i)}
            style={{
              transform: interpolate([rot, scale], trans),
              backgroundImage: `url(${process.env.PUBLIC_URL + cards[i]})`,
            }}
          ></animated.div>
        </animated.div>
      ))}
    </>
  );
}

export default function VirusGallery({ isLoaded }) {
  return (
    <div className="galleryContainer">
      <div id="galleryContextContainer">
        <div id="galleryContext">
          <h2>Cute version of the virus</h2>
          <p>
            In the virtual world of Metavirus, technology instruments can
            visualize the virus. While visualization, turn the entire reality
            into a world of swords and magic!
          </p>
        </div>
      </div>
      <div className="stackContainer">{isLoaded && <Deck />}</div>
    </div>
  );
}
