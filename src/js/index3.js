import { gsap } from 'gsap';
import { preloadImages } from './utils';
import { ContentItem } from './contentItem';
import { PreviewItem } from './previewItem';
import { Flip } from 'gsap/Flip';
gsap.registerPlugin(Flip);

// Body 
const bodyEl = document.body;

// window sizes
let winsize = {width: window.innerWidth, height: window.innerHeight};
// update on resize
window.addEventListener('resize', () => {
    winsize = {width: window.innerWidth, height: window.innerHeight};
});

// Content overlay
const contentOverlay = document.querySelector('.content__overlay');

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

// true if preview is shown (after clicking one content item)
let inPreview = false;

// check if currently animating
let isAnimating = false;

// Back control
const backCtrl = document.querySelector('.preview__back');

// Events
for (const [pos, contentItem] of contentItems.entries()) {
    
    // click on a content item
    contentItem.DOM.imgWrap.addEventListener('click', () => {
        if ( inPreview || isAnimating ) return;
        isAnimating = true;

        current = pos;

        const previewItem = previewItems[pos];
        
        gsap.timeline({
            defaults: {
                duration: 0.8,
                ease: 'power4.inOut',
            },
            onStart: () => {
                inPreview = true;
                bodyEl.classList.add('preview-open');
                gsap.set(contentItem.DOM.el, {zIndex: 10});

                gsap.set(contentOverlay, {
                    transformOrigin: current%2 ? '0% 100%' : '0% 0%',
                    scaleX: contentItem.DOM.el.offsetWidth/winsize.width,
                    scaleY: 0,
                    x: contentItem.DOM.el.offsetLeft
                });

                gsap.set(previewItem.DOM.slideTexts, {yPercent: 100});
                gsap.set(previewItem.DOM.descriptions, {
                    xPercent: pos => pos ? -5 : 5, 
                    opacity: 0
                });
                
                gsap.set(backCtrl, {x: '+=15%', opacity: 0});

                previewItem.DOM.el.classList.add('preview__item--current');
            },
            onComplete: () => isAnimating = false
        })
        .addLabel('start', 0)
        .addLabel('content', 'start+=0.6')
        .to(contentItem.DOM.titleInner, {
            yPercent: current%2 ? -100 : 100
        }, 'start')
        .to(contentItem.DOM.caption, {
            yPercent: current%2 ? -10 : 10,
            opacity: 0
        }, 'start')
        .to(contentOverlay, {
            scaleY: 1
        }, 'start')
        .to(contentOverlay, {
            scaleX: 1,
            x: 0
        }, 'content')
        .add(() => {
            const flipstate = Flip.getState(contentItem.DOM.imgWrap);
            previewItem.DOM.imgOuter.appendChild(contentItem.DOM.imgWrap);
            Flip.from(flipstate, {
                duration: 0.8,
                ease: 'power4.inOut',
                absolute: true,
            });
        }, 'content')
        .to(previewItem.DOM.slideTexts, {
            duration: 1.1,
            ease: 'expo',
            yPercent: 0
        }, 'content+=0.3')
        .to(previewItem.DOM.descriptions, {
            duration: 1.1,
            ease: 'expo',
            opacity: 1,
            xPercent: 0
        }, 'content+=0.3')
        .to(backCtrl, {
            opacity: 1,
            x: '-=15%'
        }, 'content');
    });
    
    // mouseenter / mouseleave effect
    contentItem.DOM.imgWrap.addEventListener('mouseenter', () => {
        if ( inPreview ) return;

        gsap.timeline({
            defaults: {
                duration: 0.8,
                ease: 'power4'
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
        if ( inPreview ) return;

        gsap.timeline({
            defaults: {
                duration: 0.8,
                ease: 'power4'
            }
        })
        .addLabel('start', 0)
        .to([contentItem.DOM.imgWrap, contentItem.DOM.img], {
            scale: 1,
        }, 'start');
    });

}

// Back to grid
backCtrl.addEventListener('click', () => {
    if ( isAnimating ) return;
    isAnimating = true;

    const previewItem = previewItems[current];
    const contentItem = contentItems[current];

    gsap.timeline({
        defaults: {
            duration: 0.8,
            ease: 'power4.inOut',
        },
        onComplete: () => {
            previewItem.DOM.el.classList.remove('preview__item--current');
            bodyEl.classList.remove('preview-open');
            gsap.set(contentItem.DOM.el, {zIndex: 1});
            inPreview = false;
            isAnimating = false;
        }
    })
    .addLabel('start', 0)
    .addLabel('content', 'start+=0.7')
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
    .add(() => {
        const flipstate = Flip.getState(contentItem.DOM.imgWrap);
        contentItem.DOM.el.insertBefore(contentItem.DOM.imgWrap, contentItem.DOM.el.children[1]);
        Flip.from(flipstate, {
            duration: 0.8,
            ease: 'power4.inOut',
            absolute: true,
        });
    }, 'start')
    .to(contentOverlay, {
        scaleX: contentItem.DOM.el.offsetWidth/winsize.width,
        x: contentItem.DOM.el.offsetLeft
    }, 'start')
    .to(contentOverlay, {
        scaleY: 0
    }, 'start+=0.6')
    .to(contentItem.DOM.titleInner, {
        yPercent: 0
    }, 'start+=0.6')
    .to(contentItem.DOM.caption, {
        yPercent: 0,
        opacity: 1
    }, 'start+=0.6')
});

// Preload images
preloadImages('.content__item-img').then(() => document.body.classList.remove('loading'));