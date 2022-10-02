import { animated } from "react-spring";
import { useExpand, transition } from "~/theme/animate";

type Props = {};

const Footer = (props: Props) => {
  return (
    <animated.div
      style={useExpand()}
      className={`text-center font-display py-5 text-gray-700 dark:text-gray-400 drop-shadow-2xl backdrop-blur-md ${transition}`}
    >
      Created by, Richie Varghese © 2022
    </animated.div>
  );
};

export default Footer;
