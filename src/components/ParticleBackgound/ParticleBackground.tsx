import Particles from "@tsparticles/react";

const GreenFire = () => {
  return (
    <Particles
      options={{
        fullScreen: false,
        background: { color: "transparent" },
        particles: {
          color: { value: "#ff00ff" }, // ярко-розовый — точно увидишь
          number: { value: 100 },
          size: { value: 5 },
          move: { enable: true, speed: 2 },
        },
      }}
      style={{
        position: "absolute", // или fixed
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 10,
      }}
    />
  );
};
export default GreenFire