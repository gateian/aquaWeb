import Stats from '../node_modules/three/examples/jsm/libs/stats.module.js';
import "../css/global.scss";
export class DOMManager {
    container: HTMLElement;
    stats: Stats;

    constructor() {

        this.container = document.getElementById( 'container' );
        this.stats = new Stats();
	    this.container.appendChild( this.stats.dom );
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
}