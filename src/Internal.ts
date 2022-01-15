import { Debug } from './Debug';
import { DOMManager } from './DOMManager';
import { Rendering } from './Rendering';
import { InputManager } from './InputManager';
import { CameraManager } from './CameraManager';
import { SceneManager } from './SceneManager';
import { TerrainManager } from './TerrainManager';
import { WaterManager } from './WaterManager';

export class AquaWeb {
    static Debug : Debug;
    static DOM : DOMManager;
    static Render : Rendering;
    static Input : InputManager;
    static Cameras : CameraManager;
    static Scenes : SceneManager;
    static Terrain : TerrainManager;
    static Water : WaterManager;
}



export * as Constants from './Constants';
export * as THREE from 'three';
export * from './Debug';
export * from './DOMManager';
export * from './Rendering';
export * from './InputManager';
export * from './CameraManager';
export * from './SceneManager';
export * from './TerrainManager';
export * from './WaterManager';