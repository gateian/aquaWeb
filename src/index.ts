import { 
	AquaWeb,
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

	AquaWeb.DOM = new DOMManager();
	AquaWeb.Render = new Rendering();
	AquaWeb.Cameras = new CameraManager();
	AquaWeb.Scenes = new SceneManager();
	AquaWeb.Terrain = new TerrainManager();
	AquaWeb.Input = new InputManager();
	AquaWeb.Water = new WaterManager();

	if ( AquaWeb.DOM.GetUrlParameter( "debug" ) ) {
		AquaWeb.Debug = new Debug();
		AquaWeb.Debug.InitDebugPanel();
	}
	animate();
}

function animate() {

	requestAnimationFrame( animate );
	
	AquaWeb.Render.Render();
	AquaWeb.DOM.stats.update();
}



