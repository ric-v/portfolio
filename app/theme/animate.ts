import { useSpring } from "react-spring";

export const transition = ` transition-all ease-in-out duration-2000 `;

// useFadeIn hook for fade in animation
export const useFadeIn = () => {
  return useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    immediate: true,
  })
};


export const useFadeOut = () => {
  return useSpring({
    to: { opacity: 0 },
    from: { opacity: 1 },
    config: { duration: 1000 },
    delay: 200,
  })
}

// useSlideIn hook for slide in animation
export const useSlideIn = () => {
  return useSpring({
    to: { transform: "translateX(0)" },
    from: { transform: "translateX(-100%)" },
    config: { duration: 1000 },
    delay: 200,
  })
}

export const useSlideOut = () => {
  return useSpring({
    to: { transform: "translateX(-100%)" },
    from: { transform: "translateX(0)" },
    config: { duration: 1000 },
    delay: 200,
  })
}

export const useExpand = () => {
  return useSpring({
    from: { x: '50%', width: '20%', opacity: 0 },
    to: { x: '0%', width: '100%', opacity: 1 },
  });
}

export const useTraverseStartToEnd = () => {
  return useSpring({
    from: { x: '-1000px', opacity: 1 },
    to: { x: '720px', opacity: 1 },
    config: { duration: 10000 },
    delay: 200,
    loop: { reverse: true },
  });
}

// useZoomIn hook for zoom in animation without scroll
export const useZoomIn = () => {
  return useSpring({
    to: { transform: "scale(1)" },
    from: { transform: "scale(0)" },
    config: { duration: 1000 },
    delay: 200,
  })
}

export const useBreathing = () => {
  return useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 1000 },
    delay: 200,
    loop: { reverse: true },
  });
}