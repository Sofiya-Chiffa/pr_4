import * as THREE from 'three';

export class ObjectManager {

	constructor( scene ) {
		this.scene = scene;
		this.placed = [];
		this.selected = null;
		this.currentModelTemplate = null;
	}

	setTemplate( model ) {
		this.currentModelTemplate = model;
	}

	place( matrix ) {
		if ( ! this.currentModelTemplate ) return null;

		const model = this.currentModelTemplate.clone( true );
		matrix.decompose( model.position, model.quaternion, model.scale );
		model.scale.setScalar( 0.05 );
		model.userData.isPlaced = true;

		this.scene.add( model );
		this.placed.push( model );
		this.selected = model;
		return model;
	}

	// --- команды UI ---

	rotateSelected( deltaY ) {
		if ( ! this.selected ) return;
		this.selected.rotation.y += deltaY;
	}

	scaleSelected( factor ) {
		if ( ! this.selected ) return;
		this.selected.scale.multiplyScalar( factor );
	}

	setSelectedColor( hex ) {
		if ( ! this.selected ) return;
		this.selected.traverse( ( o ) => {
			if ( o.isMesh && o.material ) {
				const mats = Array.isArray( o.material ) ? o.material : [ o.material ];
				for ( const m of mats ) {
					if ( m.color ) m.color.set( hex );
					m.needsUpdate = true;
				}
			}
		} );
	}

	removeSelected() {
		if ( ! this.selected ) return;
		this.scene.remove( this.selected );
		this.placed = this.placed.filter( ( o ) => o !== this.selected );
		this.selected = this.placed[ this.placed.length - 1 ] || null;
	}

	selectLast() {
		this.selected = this.placed[ this.placed.length - 1 ] || null;
	}

}
