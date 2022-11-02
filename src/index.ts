import { 
	AquaWeb,
	THREE,
	Debug,
	CameraManager,
	Rendering,
	DOMManager,
	InputManager,
	SceneManager,
	TerrainManager,
	WaterManager
} from './Internal';


export function Init() {

	AquaWeb.Clock = new THREE.Clock();
	AquaWeb.Delta = AquaWeb.Clock.getDelta();
	AquaWeb.Time = 0.0;
	AquaWeb.DOM = new DOMManager();
	AquaWeb.Cameras = new CameraManager();
	AquaWeb.Render = new Rendering();
	AquaWeb.Render.Init();
	AquaWeb.Scenes = new SceneManager();
	AquaWeb.Terrain = new TerrainManager();
	AquaWeb.Input = new InputManager();
	AquaWeb.Water = new WaterManager();

	if ( AquaWeb.DOM.GetUrlParameter( "debug" ) ) {
		AquaWeb.Debug = new Debug();
		AquaWeb.Debug.InitDebugPanel();
	}
	AquaWeb.DOM.Init();
	animate();
}

function animate() {

	requestAnimationFrame( animate );
	AquaWeb.Delta = AquaWeb.Clock.getDelta();
	AquaWeb.Time += AquaWeb.Delta;
	
	AquaWeb.Render.Render();
	AquaWeb.DOM.Update();
}



