import {
    AquaWeb,
    THREE,
    Constants
} from './Internal';

export class CameraManager {
    active : THREE.PerspectiveCamera;
    cameras: Map<string, THREE.PerspectiveCamera>;
    
    get distanceToOrigin() {

        return new THREE.Vector3().distanceTo( this.active.position );
    }
    
    constructor() {

        this.cameras = new Map();
	    this.active = this.CreateCamera( "main", 60, window.innerWidth / window.innerHeight, 10, 20000 );
    }

    CreateCamera( name : string, fov : number, aspectRatio : number, near : number, far : number ) {

        let camera = new THREE.PerspectiveCamera( fov, aspectRatio, near, far );
        this.cameras.set( name, camera );
        return camera;
    }

    get waterReflection() : THREE.Camera {

        return this.cameras.get( Constants.REFLECTION_CAM_NAME );
    }

    Get( name : string ) {

        return this.cameras.get( name );
    }

    MirrorYPlane( target, source, offset ) {

        let mirrorCam = this.cameras.get( target );
        let sourceCam = this.cameras.get( source );

        mirrorCam.position.copy( sourceCam.position );
        mirrorCam.position.setY( offset - ( sourceCam.position.y - offset ) );
        mirrorCam.rotation.copy( sourceCam.rotation );
        // mirrorCam.rotateOnAxis( new THREE.Vector3( 1, 0, 0 ), 90 );        

        let sourceCamDir = new THREE.Vector3();
        sourceCam.getWorldDirection(sourceCamDir);

        let mirrorCamDir = new THREE.Vector3();
        mirrorCam.getWorldDirection( mirrorCamDir );
        mirrorCamDir.reflect( new THREE.Vector3( 0, 1, 0 ) );
        
        let mirrorTarget = mirrorCam.position.clone();
        mirrorTarget.add( mirrorCamDir );
        mirrorCam.lookAt( mirrorTarget );

        // mirrorCam.lookAt( )

        if ( AquaWeb.Debug ) {

            

            AquaWeb.Debug.AddPanelContent( "CameraPos", `Cam Pos: 
                ${sourceCam.position.x.toFixed(1)},
                ${sourceCam.position.y.toFixed(1)},
                ${sourceCam.position.z.toFixed(1)}` 
            );
            AquaWeb.Debug.AddPanelContent( "CameraRot", `Cam Rot: 
                ${( THREE.MathUtils.RAD2DEG * sourceCam.rotation.x ).toFixed(1)}, 
                ${( THREE.MathUtils.RAD2DEG * sourceCam.rotation.y ).toFixed(1)}, 
                ${( THREE.MathUtils.RAD2DEG * sourceCam.rotation.z ).toFixed(1)}` 
            );

            AquaWeb.Debug.AddPanelContent( "CameraDir", `Cam Dir:
                ${sourceCamDir.x.toFixed(3)},
                ${sourceCamDir.y.toFixed(3)},
                ${sourceCamDir.z.toFixed(3)}
            ` );
            AquaWeb.Debug.AddPanelContent( "ReflectionCameraPos", `Refl. Cam Pos: 
                ${mirrorCam.position.x.toFixed(1)},
                ${mirrorCam.position.y.toFixed(1)},
                ${mirrorCam.position.z.toFixed(1)}`
            );
            AquaWeb.Debug.AddPanelContent( "ReflCameraRot", `Refl Cam Rot: 
                ${( THREE.MathUtils.RAD2DEG * mirrorCam.rotation.x ).toFixed(1)},
                ${( THREE.MathUtils.RAD2DEG * mirrorCam.rotation.y ).toFixed(1)}, 
                ${( THREE.MathUtils.RAD2DEG * mirrorCam.rotation.z ).toFixed(1)}` 
            );
            AquaWeb.Debug.AddPanelContent( "ReflCameraDir", `Refl Cam Dir:
                ${mirrorCamDir.x.toFixed(3)},
                ${mirrorCamDir.y.toFixed(3)},
                ${mirrorCamDir.z.toFixed(3)}
            ` );
        }

    }
}