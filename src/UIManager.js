export class UIManager {

	constructor( objectManager ) {

		this.objectManager = objectManager;

		const panel = document.createElement( 'div' );
		panel.id = 'ui-panel';
		panel.innerHTML = `
			<label>Цвет:
				<input type="color" id="ui-color" value="#ff8844">
			</label>
			<button id="ui-rot-l">↺</button>
			<button id="ui-rot-r">↻</button>
			<button id="ui-scale-up">+</button>
			<button id="ui-scale-down">−</button>
			<button id="ui-remove">Удалить</button>
		`;
		document.body.appendChild( panel );

		panel.querySelector( '#ui-color' ).addEventListener( 'input', ( e ) => {
			this.objectManager.setSelectedColor( e.target.value );
		} );

		panel.querySelector( '#ui-rot-l' ).addEventListener( 'click', () => {
			this.objectManager.rotateSelected( - Math.PI / 8 );
		} );

		panel.querySelector( '#ui-rot-r' ).addEventListener( 'click', () => {
			this.objectManager.rotateSelected( Math.PI / 8 );
		} );

		panel.querySelector( '#ui-scale-up' ).addEventListener( 'click', () => {
			this.objectManager.scaleSelected( 1.2 );
		} );

		panel.querySelector( '#ui-scale-down' ).addEventListener( 'click', () => {
			this.objectManager.scaleSelected( 0.8 );
		} );

		panel.querySelector( '#ui-remove' ).addEventListener( 'click', () => {
			this.objectManager.removeSelected();
		} );

	}

}
