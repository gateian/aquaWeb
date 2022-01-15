import { AquaWeb } from "./Internal";

export class Debug {

    debugLines: any[];
    frameCount: number;
    panelEl: HTMLDivElement;

    constructor() {

        this.debugLines = [];
        this.frameCount = 0;
    }

    DrawLine(name, vertices, targetView, color="white") {

        if (!vertices) {
            console.error("Please supply vertices to draw!");
            return;
        }

        if (!targetView) {
            console.error("No view defined for drawing lines in");
            return;
        }

        if (!this.debugLines[name]) {

            var MAX_POINTS = 500;

            // geometry
            // @ts-ignore
            var geometry = new THREE.BufferGeometry();

            // attributes
            var positions = new Float32Array( MAX_POINTS * 3 ); // 3 vertices per point

            this.UpdateLinePoints(positions, vertices);

            // @ts-ignore
            geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );

            // draw range
            var drawCount = 2; // draw the first 2 points, only
            geometry.setDrawRange( 0, vertices.length );

            // material
            // @ts-ignore
            var material = new THREE.LineBasicMaterial( { color: color, linewidth: 3 } );

        
    // @ts-ignore
            var line = new THREE.Line( geometry, material );
    
            targetView.add(line);

            this.debugLines[name] = line;
        }
        else {

            this.UpdateLinePoints(this.debugLines[name].geometry.attributes.position.array, vertices);
            this.debugLines[name].geometry.setDrawRange(0, vertices.length);
            this.debugLines[name].geometry.attributes.position.needsUpdate = true;
        }

        
    }

    UpdateLinePoints(buffer, newPoints) {

        let count = 0;
        
        for(let i = 0; i < newPoints.length; i++) {

            buffer[count++] = newPoints[i].x;
            buffer[count++] = newPoints[i].y;
            buffer[count++] = newPoints[i].z;
        }

    }

    Update () {

        this.frameCount++;
    }    

    Log(msg, stackTrace = false) {

        console.log(this.frameCount + ":" + msg);

        if (stackTrace) { 
            console.trace(); 
        }
    }

    InitDebugPanel() {

        this.panelEl = document.createElement( "div" );
        this.panelEl.classList.add( "minimised" );
        this.panelEl.id = "DebugPanel";
        AquaWeb.DOM.AddChild( this.panelEl );

        let minMaxButton = document.createElement( "button" );
        minMaxButton.id = "DebugMinMaxBtn";
        minMaxButton.classList.add( "minimised" );
        minMaxButton.addEventListener( "click", ( e ) => {

            if ( minMaxButton.classList.contains( "minimised" ) ) {

                minMaxButton.classList.remove( "minimised" );
                this.panelEl.classList.remove( "minimised" );
            }
            else {

                minMaxButton.classList.add( "minimised" );
                this.panelEl.classList.add( "minimised" );
            }
        });
        this.panelEl.appendChild( minMaxButton );
    }

    AddPanelContent( key : string, content : string ) {

        if ( !this.panelEl ) {
            return;
        }

        let debugItem;

        for ( let i = 0; i < this.panelEl.children.length; i++ ) {

            const child = <HTMLDivElement>this.panelEl.children[ i ];
            
            if ( child.dataset.key == key ) {

                debugItem = child;
                break;
            }
        }

        if ( !debugItem ) {

            debugItem = document.createElement( "div" );
            debugItem.className = "debugItem";
            debugItem.dataset.key = key;
            this.panelEl.appendChild( debugItem );
        }

        debugItem.innerHTML = content;
    }
}