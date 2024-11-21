import * as BABYLON from "https://cdn.jsdelivr.net/npm/@babylonjs/core/Legacy/legacy.min.js";
import "https://cdn.jsdelivr.net/npm/@babylonjs/loaders/glTF/2.0/glTFLoader.min.js";

// ログを画面に表示する関数
function logToScreen(message) {
  const logDiv = document.getElementById("log");
  logDiv.innerHTML += `<p>${message}</p>`;
  console.log(message);
}

// エラーハンドリング
window.onerror = (msg, url, lineNo, columnNo, error) => {
  const message = `エラー: ${msg} at ${lineNo}:${columnNo}`;
  logToScreen(message);
  return false;
};

window.addEventListener("unhandledrejection", (event) => {
  const message = `未処理のPromiseエラー: ${event.reason}`;
  logToScreen(message);
});

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

const createScene = async () => {
  logToScreen("シーンの初期化を開始します");

  const scene = new BABYLON.Scene(engine);
  logToScreen("シーンを作成しました");

  // 環境ライトを追加
  const light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );
  logToScreen("環境ライトを追加しました");

  // WebXRの設定
  try {
    const xrHelper = await scene.createDefaultXRExperienceAsync({
      uiOptions: {
        sessionMode: "immersive-ar",
      },
    });
    logToScreen("WebXRの初期化が完了しました");

    // 平面検出機能を有効化
    const fm = xrHelper.featuresManager;
    const planeDetector = fm.enableFeature(
      BABYLON.WebXRPlaneDetector.Name,
      "latest"
    );
    logToScreen("平面検出機能を有効化しました");

    // GLTFモデルの読み込み
    let wolf;
    logToScreen("3Dモデルを読み込みます");
    BABYLON.SceneLoader.Append(
      "./wolf_with_animations/",
      "scene.gltf",
      scene,
      (loadedScene) => {
        wolf = loadedScene.meshes[0]; // モデルの最初のメッシュ
        wolf.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5); // サイズ調整
        wolf.isVisible = false; // 平面検出後に表示する
        logToScreen("3Dモデルの読み込みが完了しました");
      }
    ).catch((err) => {
      logToScreen(`3Dモデルの読み込みに失敗しました: ${err.message}`);
    });

    // 平面検出時のイベント
    planeDetector.onPlaneAddedObservable.add((plane) => {
      logToScreen("平面を検出しました");
      if (wolf) {
        wolf.position = plane.polygon[0]; // 平面の位置に配置
        wolf.position.y += 0.1; // 少し浮かせる
        wolf.isVisible = true;

        // アニメーション再生
        scene.beginAnimation(wolf, 0, 100, true);
        logToScreen("3Dモデルを平面に配置し、アニメーションを再生しました");
      }
    });
  } catch (err) {
    logToScreen(`WebXRの初期化に失敗しました: ${err.message}`);
  }

  return scene;
};

const scene = await createScene();
logToScreen("シーンが初期化されました");

engine.runRenderLoop(() => {
  scene.render();
});

// ウィンドウサイズ変更時のリサイズ対応
window.addEventListener("resize", () => {
  engine.resize();
});
