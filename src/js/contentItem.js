/**
 * Class representing a content item element (.content__item)
 */
 export class ContentItem {
	// DOM elements
	DOM = {
		// main element (.content__item)
		el: null,
        // title (.content__item-title)
        title: null,
        // title inner (.content__item-title > .oh__inner)
        titleInner: null,
        // imgWrap (.content__item-imgwrap)
        imgWrap : null,
        // image (.content__item-img)
        img : null,
        // caption (.content__item-caption)
        caption: null,
	};
	
	/**
	 * Constructor.
	 * @param {Element} DOM_el - main element (.content__item)
     * @param {PreviewItem} previewItemInstance - PreviewItem (.preview__item)
	 */
	constructor(DOM_el, previewItemInstance) {
        this.previewItem = previewItemInstance;
		this.DOM.el = DOM_el;
        this.DOM.title = this.DOM.el.querySelector('.content__item-title');
        this.DOM.titleInner = this.DOM.title.querySelector('.oh__inner');
        this.DOM.imgWrap = this.DOM.el.querySelector('.content__item-img-wrap');
        this.DOM.img = this.DOM.imgWrap.querySelector('.content__item-img');
        this.DOM.caption = this.DOM.el.querySelector('.content__item-caption');
	}
}
