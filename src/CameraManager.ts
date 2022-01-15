import {
    THREE 
} from './Internal';

export class CameraManager {
    active : THREE.PerspectiveCamera;
    cameras: Map<string, THREE.PerspectiveCamera>;

    constructor() {

        this.cameras = new Map();
	    this.active = this.CreateCamera( "main", 60, window.innerWidth / window.innerHeight, 10, 20000 );

    }

    CreateCamera( name : string, fov : number, aspectRatio : number, near : number, far : number ) {

        let camera = new THREE.PerspectiveCamera( fov, aspectRatio, near, far );
        this.cameras.set( name, camera );
        return camera;
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
    }
}