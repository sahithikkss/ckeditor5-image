/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module image/widget/utils
 */

import ViewEditableElement from '@ckeditor/ckeditor5-engine/src/view/editableelement';

const widgetSymbol = Symbol( 'isWidget' );
const labelSymbol = Symbol( 'label' );

/**
 * CSS class added to each widget element.
 *
 * @const {String}
 */
export const WIDGET_CLASS_NAME = 'ck-widget';

/**
 * CSS class added to currently selected widget element.
 *
 * @const {String}
 */
export const WIDGET_SELECTED_CLASS_NAME = 'ck-widget_selected';

/**
 * Returns `true` if given {@link module:engine/view/element~Element} is a widget.
 *
 * @param {module:engine/view/element~Element} element
 * @returns {Boolean}
 */
export function isWidget( element ) {
	return !!element.getCustomProperty( widgetSymbol );
}

/**
 * Converts given {@link module:engine/view/element~Element} to widget in following way:
 * * sets `contenteditable` attribute to `true`,
 * * adds custom `getFillerOffset` method returning `null`,
 * * adds `ck-widget` CSS class,
 * * adds custom property allowing to recognize widget elements by using {@link ~isWidget}.
 *
 * @param {module:engine/view/element~Element} element
 * @param {Object} [options]
 * @param {String|Function} [options.label] Element's label provided to {@link ~setLabel} function. It can be passed as
 * a plain string or a function returning a string.
 * @returns {module:engine/view/element~Element} Returns same element.
 */
export function toWidget( element, options ) {
	options = options || {};
	element.setAttribute( 'contenteditable', false );
	element.getFillerOffset = getFillerOffset;
	element.addClass( WIDGET_CLASS_NAME );
	element.setCustomProperty( widgetSymbol, true );

	if ( options.label ) {
		setLabel( element, options.label );
	}

	return element;
}

/**
 * Sets label for given element.
 * It can be passed as a plain string or a function returning a string. Function will be called each time label is retrieved by
 * {@link ~getLabel}.
 *
 * @param {module:engine/view/element~Element} element
 * @param {String|Function} labelOrCreator
 */
export function setLabel( element, labelOrCreator ) {
	element.setCustomProperty( labelSymbol, labelOrCreator );
}

/**
 * Returns label for provided element.
 *
 * @param {module:engine/view/element~Element} element
 * @return {String}
 */
export function getLabel( element ) {
	const labelCreator = element.getCustomProperty( labelSymbol );

	if ( !labelCreator ) {
		return '';
	}

	return typeof labelCreator == 'function' ? labelCreator() : labelCreator;
}

/**
 * Creates nested editable element with proper CSS classes.
 *
 * @param {String} elementName Name of the element to be created.
 * @param {module:engine/view/document~Document} viewDocument
 * @returns {module:engine/view/editableelement~EditableElement}
 */
export function toWidgetEditable( elementName, viewDocument ) {
	const editable = new ViewEditableElement( elementName, { contenteditable: true } );
	editable.addClass( 'ck-editable' );
	editable.document = viewDocument;

	editable.on( 'change:isFocused', ( evt, property, is ) => {
		if ( is ) {
			editable.addClass( 'ck-editable_focused' );
		} else {
			editable.removeClass( 'ck-editable_focused' );
		}
	} );

	return editable;
}

// Default filler offset function applied to all widget elements.
//
// @returns {null}
function getFillerOffset() {
	return null;
}
