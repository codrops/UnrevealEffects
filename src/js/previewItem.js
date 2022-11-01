/**
 * Class representing a preview item element (.preview__item)
 */
 export class PreviewItem {
	// DOM elements
	DOM = {
		// main element (.preview__item)
		el: null,
        // image outer (.preview__item-img-outer)
        imgOuter: null,
        // imgWrap (.preview__item-img-wrap)
        imgWrap : null,
        // image (.content__item-img)
        img : null,
        // texts that slide in/out (.oh__inner)
        slideTexts: null,
        // description elements (.preview__item-box-desc)
        descriptions: null,
        // title (.preview__item-title)
        title: null,
        // right and left text boxes (.preview__item-box)
        boxes: null,
	};
	
	/**
	 * Constructor.
	 * @param {Element} DOM_el - main element (.preview__item)
	 */
	constructor(DOM_el) {
		this.DOM.el = DOM_el;
        this.DOM.imgOuter = this.DOM.el.querySelector('.preview__item-img-outer');
        this.DOM.imgWrap = this.DOM.el.querySelector('.preview__item-img-wrap');
        this.DOM.img = this.DOM.el.querySelector('.preview__item-img');
        this.DOM.slideTexts = this.DOM.el.querySelectorAll('.oh__inner');
        this.DOM.descriptions = this.DOM.el.querySelectorAll('.preview__item-box-desc');
        this.DOM.title = this.DOM.el.querySelector('.preview__item-title');
        this.DOM.boxes = this.DOM.el.querySelectorAll('.preview__item-box');
	}
}
