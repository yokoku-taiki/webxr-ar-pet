import * as BABYLON from "https://cdn.jsdelivr.net/npm/@babylonjs/core/Legacy/legacy.min.js";

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

const createScene = async () => {
  const scene = new BABYLON.Scene(engine);

  // 環境ライト
  const light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );

  // ペット（3Dオブジェクトとしてのボックス）
  const box = BABYLON.MeshBuilder.CreateBox("pet", { size: 1 }, scene);
  box.position.y = 1;

  // WebXRのARモードを有効化
  const xrHelper = await scene.createDefaultXRExperienceAsync({
    uiOptions: {
      sessionMode: "immersive-ar",
    },
  });

  return scene;
};

const scene = await createScene();
engine.runRenderLoop(() => {
  scene.render();
});
