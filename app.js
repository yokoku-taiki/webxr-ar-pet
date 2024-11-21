window.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("renderCanvas");
  const engine = new BABYLON.Engine(canvas, true);

  const createScene = () => {
    const scene = new BABYLON.Scene(engine);

    // カメラ設定
    const camera = new BABYLON.ArcRotateCamera(
      "camera1",
      Math.PI / 2,
      Math.PI / 4,
      4,
      BABYLON.Vector3.Zero(),
      scene
    );
    camera.attachControl(canvas, true);

    // 環境光
    const light = new BABYLON.HemisphericLight(
      "light",
      new BABYLON.Vector3(0, 1, 0),
      scene
    );
    light.intensity = 0.7;

    return scene;
  };

  const scene = createScene();

  // レンダーループ
  engine.runRenderLoop(() => {
    scene.render();
  });

  // ウィンドウリサイズ対応
  window.addEventListener("resize", () => {
    engine.resize();
  });

  // カメラ起動ボタンの処理
  const startCameraButton = document.getElementById("startCamera");
  startCameraButton.addEventListener("click", async () => {
    try {
      const xr = await scene.createDefaultXRExperienceAsync({
        uiOptions: {
          sessionMode: "immersive-ar",
        },
        optionalFeatures: ["local-floor"],
      });

      // ARセッションを開始
      await xr.baseExperience.enterXRAsync("immersive-ar", "local-floor", {});

      console.log("ARセッションが正常に開始されました");

      // タップでオブジェクトを出現させる処理
      const xrInput = xr.input;
      xrInput.onPointerDownObservable.add((pointerEvent) => {
        const pickResult = scene.pick(pointerEvent.x, pointerEvent.y);

        if (pickResult.hit) {
          // タップ位置にオブジェクトを作成
          const sphere = BABYLON.MeshBuilder.CreateSphere(
            "sphere",
            { diameter: 0.2 },
            scene
          );
          sphere.position = pickResult.pickedPoint;
          console.log("オブジェクトが作成されました");
        }
      });
    } catch (error) {
      console.error("ARセッションの開始に失敗しました", error);
      alert(
        "カメラを起動できませんでした。デバイスやブラウザを確認してください。"
      );
    }
  });
});
