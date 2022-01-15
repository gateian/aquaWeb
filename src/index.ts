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
	AquaWeb.Debug = new Debug();
	AquaWeb.Render = new Rendering();
	AquaWeb.Cameras = new CameraManager();
	AquaWeb.Scenes = new SceneManager();
	AquaWeb.Terrain = new TerrainManager();
	AquaWeb.Input = new InputManager();
	AquaWeb.Water = new WaterManager();

	animate();
}

function animate() {

	requestAnimationFrame( animate );
	
	AquaWeb.Render.Render();
	AquaWeb.DOM.stats.update();
}



