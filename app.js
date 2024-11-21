import * as BABYLON from "https://cdn.jsdelivr.net/npm/@babylonjs/core/Legacy/legacy.min.js";
import "https://cdn.jsdelivr.net/npm/@babylonjs/loaders/glTF/2.0/glTFLoader.min.js";

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

  // WebXRの設定
  const xrHelper = await scene.createDefaultXRExperienceAsync({
    uiOptions: {
      sessionMode: "immersive-ar",
    },
  });

  // 平面検出機能を有効化
  const fm = xrHelper.featuresManager;
  const planeDetector = fm.enableFeature(
    BABYLON.WebXRPlaneDetector.Name,
    "latest"
  );

  // GLTFモデルの読み込み
  let wolf;
  BABYLON.SceneLoader.Append(
    "./wolf_with_animations/",
    "scene.gltf",
    scene,
    (loadedScene) => {
      wolf = loadedScene.meshes[0]; // モデルの最初のメッシュ
      wolf.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5); // サイズ調整
      wolf.isVisible = false; // 平面検出後に表示する
    }
  );

  // 平面検出時のイベント
  planeDetector.onPlaneAddedObservable.add((plane) => {
    if (wolf) {
      wolf.position = plane.polygon[0]; // 平面の位置に配置
      wolf.position.y += 0.1; // 少し浮かせる
      wolf.isVisible = true;

      // アニメーション再生
      scene.beginAnimation(wolf, 0, 100, true); // フレーム範囲を調整
    }
  });

  return scene;
};

// シーンの作成
const scene = await createScene();

engine.runRenderLoop(() => {
  scene.render();
});

// ウィンドウサイズ変更時のリサイズ対応
window.addEventListener("resize", () => {
  engine.resize();
});
