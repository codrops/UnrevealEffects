import { gsap } from 'gsap';
import { preloadImages } from './utils';
import { ContentItem } from './contentItem';
import { PreviewItem } from './previewItem';

// Body 
const bodyEl = document.body;

// Content overlay
const contentOverlayInner = document.querySelector('.content__overlay > .overlay__inner');
gsap.set(contentOverlayInner, {
    xPercent: -100
})
// Preview Items
const previewItems = [];
[...document.querySelectorAll('.preview__item')].forEach(previewItem => {
    previewItems.push(new PreviewItem(previewItem));
});

// Content Items
const contentItems = [];
[...document.querySelectorAll('.content__item')].forEach((contentItem, pos) => {
    contentItems.push(new ContentItem(contentItem, previewItems[pos]));
});

// current element
let current = -1;

// check if currently animating
let isAnimating = false;

// Back control
const backCtrl = document.querySelector('.preview__back');

// Events
for (const [pos, contentItem] of contentItems.entries()) {
    
    // click on a content item
    contentItem.DOM.imgWrap.addEventListener('click', () => {
        if ( isAnimating ) return;
        isAnimating = true;

        current = pos;

        const previewItem = previewItems[pos];
        
        gsap.timeline({
            defaults: {
                duration: 1.1,
                ease: 'expo',
            },
            onStart: () => {
                bodyEl.classList.add('preview-open');
                gsap.set(previewItem.DOM.img, {xPercent: 100});
                gsap.set(previewItem.DOM.imgWrap, {xPercent: -102, opacity: 0});

                gsap.set(previewItem.DOM.slideTexts, {yPercent: 100});
                gsap.set(previewItem.DOM.descriptions, {yPercent: 15, opacity: 0});
                
                gsap.set(backCtrl, {x: '+=15%', opacity: 0});

                previewItem.DOM.el.classList.add('preview__item--current');
            },
            onComplete: () => isAnimating = false
        })
        .addLabel('start', 0)
        .addLabel('preview', 'start+=0.3')
        .to(contentOverlayInner, {
            ease: 'power2',
            startAt: {xPercent: -100},
            xPercent: 0
        }, 'start')
        .to([previewItem.DOM.img, previewItem.DOM.imgWrap], {
            xPercent: 0,
        }, 'preview')
        .to(previewItem.DOM.imgWrap, {
            opacity: 1,
        }, 'preview')
        .to(previewItem.DOM.slideTexts, {
            yPercent: 0,
            stagger: 0.05,
        }, 'preview')
        .to(previewItem.DOM.descriptions, {
            ease: 'power2',
            opacity: 1,
            stagger: 0.05,
        }, 'preview')
        .to(previewItem.DOM.descriptions, {
            yPercent: 0,
            stagger: 0.05,
        }, 'preview')
        .to(backCtrl, {
            ease: 'power2',
            opacity: 1,
            x: '-=15%'
        }, 'preview');
    });
    
    // mouseenter / mouseleave effect
    contentItem.DOM.imgWrap.addEventListener('mouseenter', () => {
        gsap.timeline({
            defaults: {
                duration: 0.6,
                ease: 'expo'
            }
        })
        .addLabel('start', 0)
        .set(contentItem.DOM.titleInner, {transformOrigin: '0% 50%'}, 'start')
        .to(contentItem.DOM.titleInner, {
            startAt: {filter: 'blur(0px)'},
            duration: 0.2,
            ease: 'power1.in',
            yPercent: -100,
            rotation: -4,
            filter: 'blur(6px)'
        }, 'start')
        .to(contentItem.DOM.titleInner, {
            startAt: {yPercent: 100, rotation: 4, filter: 'blur(6px)'},
            yPercent: 0,
            rotation: 0,
            filter: 'blur(0px)'
        }, 'start+=0.2')
        .to(contentItem.DOM.imgWrap, {
            scale: 0.95
        }, 'start')
        .to(contentItem.DOM.img, {
            scale: 1.2
        }, 'start')
    });

    contentItem.DOM.imgWrap.addEventListener('mouseleave', () => {
        gsap.timeline({
            defaults: {
                duration: 0.8,
                ease: 'power4'
            }
        })
        .addLabel('start', 0)
        .to([contentItem.DOM.imgWrap, contentItem.DOM.img], {
            scale: 1,
            //rotation: 0
        }, 'start');
    });

}

// Back to grid
backCtrl.addEventListener('click', () => {
    if ( isAnimating ) return;
    isAnimating = true;

    const previewItem = previewItems[current];
    
    gsap.timeline({
        defaults: {
            duration: 1,
            ease: 'power4',
        },
        onComplete: () => {
            previewItem.DOM.el.classList.remove('preview__item--current');
            bodyEl.classList.remove('preview-open');
            isAnimating = false;
        }
    })
    .addLabel('start', 0)
    .to(backCtrl, {
        ease: 'power2',
        opacity: 0
    }, 'start')
    .to(previewItem.DOM.descriptions, {
        ease: 'power2',
        opacity: 0
    }, 'start')
    .to(previewItem.DOM.descriptions, {
        yPercent: 15
    }, 'start')
    .to(previewItem.DOM.slideTexts, {
        yPercent: 100
    }, 'start')
    .to(previewItem.DOM.img, {
        xPercent: -100,
    }, 'start')
    .to(previewItem.DOM.imgWrap, {
        xPercent: 100,
        opacity: 1
    }, 'start')
    .to(contentOverlayInner, {
        ease: 'power2',
        xPercent: 100,
    }, 'start+=0.4')
});

// Preload images
preloadImages('.content__item-img').then(() => document.body.classList.remove('loading'));