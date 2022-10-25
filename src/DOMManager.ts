import Stats from '../node_modules/three/examples/jsm/libs/stats.module.js';
import "../css/global.scss";
import { AquaWeb } from './Internal';
export class DOMManager {
    container: HTMLElement;
    stats: Stats;
    debugParams: Map<string,{"input":HTMLInputElement, "variable":any}>;
    reflectionPowerInput: HTMLInputElement;
    reflectionScaleInput: HTMLInputElement;
    extinctionCoeffInput: HTMLInputElement;
    shaderDistanceInput: HTMLInputElement;
    paramBox: HTMLElement;
    cameraDistanceInput: HTMLInputElement;
    refractionIndicesInput: HTMLInputElement;

    constructor() {

        this.container = document.getElementById( 'container' );
        this.stats = new Stats();
	    this.container.appendChild( this.stats.dom );
        this.paramBox = document.getElementById( 'paramBox' );

        this.debugParams = new Map<string, {"input":HTMLInputElement, "variable":any}>();
    }

    Init() {

        // Reflection Power
        this.reflectionPowerInput = this.InitParameterInput( 'paramReflPower', "Fresnel Power", "1.5", AquaWeb.Render.SetReflectionPower );

        // Reflection scale
        this.reflectionScaleInput = this.InitParameterInput( 'paramReflScale', "Fresnel Scale", "1.1", AquaWeb.Render.SetReflectionScale );

        // Extinction Coefficient
        this.extinctionCoeffInput = this.InitParameterInput( 'paramExtinctionCoeff', "Extinction Coeff", "-0.35", AquaWeb.Render.SetExtinctionCoefficient );

        // Shader Water Distance
        this.shaderDistanceInput = this.InitParameterInput( 'paramShaderDist', "Water Distance", "1.0", AquaWeb.Render.SetShaderWaterDistance )

        // Refraction Indices
        this.refractionIndicesInput = this.InitParameterInput( 'paramRefractionIndices', "Refraction Indices", "1.333", AquaWeb.Render.SetRefractionIndex );
        // Camera Distance
        this.cameraDistanceInput = this.InitDebugParam( 'paramCameraDistance', "Camera Distance", () => { return AquaWeb.Cameras.distanceToOrigin } );
    }

    InitParameterInput( id : string, name : string, defaultVal? : string, updateFunc? : Function ) {

        const inputEl = document.createElement( 'input' );
        inputEl.type = "text";
        inputEl.id = id;
        inputEl.value = defaultVal;
        inputEl.disabled = defaultVal == undefined;

        const label = document.createElement( 'label' );
        label.htmlFor = id;
        label.innerText = name;

        this.paramBox.append( label, inputEl );

        const param = localStorage.getItem( id );

        if ( param ) {

            inputEl.value = param;
            updateFunc( parseFloat( param ) );
        }

        inputEl.addEventListener( "change", ( e ) => {

            updateFunc( parseFloat( ( <HTMLInputElement>e.target).value ) );
           localStorage.setItem( id, ( <HTMLInputElement>e.target ).value )
           
        });

        return inputEl;
    }

    InitDebugParam( id : string, name : string, updateValue : any ) {

        const inputEl = document.createElement( 'input' );
        inputEl.type = "text";
        inputEl.id = id;
        inputEl.readOnly = true;

        const label = document.createElement( 'label' );
        label.htmlFor = id;
        label.innerText = name;

        this.paramBox.append( label, inputEl );

        this.debugParams.set( id, {
            input: inputEl,
            variable: updateValue
        });

        return inputEl;
    }


    Page404() {

        this.container.innerHTML = 'Page does not exist';
    }

    Reset() {

        this.container.innerHTML = '';
    }

    SetContent( html : string ) {

        this.container.innerHTML = html;
    }

    GetUrlParameter( sParam : string ) {

        let paramString = window.location.href.split( "?" )[ 1 ];

        if ( paramString ) {

            let params = paramString.split( "&" );

            for ( let i = 0; i < params.length; i++) {

                const p = params[ i ].split('=');

                if ( p[ 0 ] === sParam )
                {
                    return p[ 1 ] === undefined ? true : decodeURIComponent( p[ 1 ] );
                }
            }
        }

        return undefined;
    }

    CreateElement( elementType : string, parent?: HTMLElement ) : HTMLElement {

        let el = document.createElement( elementType );

        if ( parent ) {
            parent.appendChild( el );
        }
        else {
            this.container.appendChild( el );
        }

        return el;
    }

    AddChild( child : HTMLElement, selector? : string ) {

        if ( selector ) {

            let node = this.container.querySelector( selector );

            if ( node ) {

                node.appendChild( child );
            }
            else {

                console.error( "Could not find HTML Node: " + selector );
            }
        }
        else {

            this.container.appendChild( child );
        }
    }

    LoadTemplate( templateText : string, targetElem? : HTMLElement ) {

        if ( !targetElem ) {

            targetElem = this.container;
        }

        targetElem.innerHTML = templateText;
    }

    InitButton( parent : HTMLElement, selector : string, clickEvent : (this: HTMLButtonElement, ev: MouseEvent) => any ) {

        let button = <HTMLButtonElement>parent.querySelector( selector );

        if ( button ) {

            button.addEventListener( "click", clickEvent );
        }

        return button;
    }

    Update() {

        this.stats.update();

        for ( const [ id, param] of this.debugParams ) {
            
            param.input.value = param.variable();    
        }
    }
}