export function VirusModel({ index }) {
  const models = [
    "/assets/GolemEarth.gltf",
    "/assets/GolemFire.gltf",
    "/assets/GolemIce.gltf",
    "/assets/EarthWorm.gltf",
    "/assets/Scorpion.gltf",
  ];
  const arModels = [
    "/assets/shiba/Shiba.usdz",
    "/assets/low_poly_mccree/Low_poly_McCree.usdz",
    "/assets/matilda/Matilda.usdz",
    "/assets/shiba/Shiba.usdz",
    "/assets/low_poly_mccree/Low_poly_McCree.usdz",
  ];
  // return <img className="modelImg" src={imgs[index]} alt="model" />;
  return (
    <div className="model scrollable-content">
      <model-viewer
        alt="shiba"
        src={process.env.PUBLIC_URL + models[index]}
        ar
        ios-src={process.env.PUBLIC_URL + arModels[index]}
        // environment-image="shared-assets/environments/moon_1k.hdr"
        // poster="shared-assets/models/NeilArmstrong.webp"
        shadow-intensity="1"
        touch-action="none"
        camera-controls
        auto-rotate
        autoplay
        disable-zoom
        disable-pan
        style={{ width: "300px", height: "300px" }}
      ></model-viewer>
    </div>
  );
}