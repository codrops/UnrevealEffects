import { gsap } from 'gsap';
import { preloadImages } from './utils';
import { ContentItem } from './contentItem';
import { PreviewItem } from './previewItem';

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
                duration: 1,
                ease: 'expo',
            },
            onStart: () => {
                bodyEl.classList.add('preview-open');
                gsap.set(previewItem.DOM.el, {
                    clipPath: `circle(0vmax at ${winsize.width/2}px ${winsize.height/2}px)`
                });
                
                gsap.set(previewItem.DOM.img, {scale: 0.8});
                gsap.set(previewItem.DOM.title, {scale: 1.6});
                gsap.set(previewItem.DOM.boxes, {
                    xPercent: pos => pos ? 20 : -20
                });
                gsap.set(backCtrl, {x: '+=15%', opacity: 0});

                previewItem.DOM.el.classList.add('preview__item--current');
            },
            onComplete: () => {
                gsap.set(previewItem.DOM.el, {
                    clipPath: 'none'
                });

                isAnimating = false;
            }
        })
        .addLabel('start', 0)
        .addLabel('preview', 'start+=0.3')
        .to(contentItem.DOM.imgWrap, {
            ease: 'power2',
            scale: 1.2
        }, 'start')
        .to(contentOverlay, {
            ease: 'power2',
            scale: 1
        }, 'start')
        .to(previewItem.DOM.el, {
            duration: 0.9,
            ease: 'power2',
            clipPath: `circle(60vmax at ${winsize.width/2}px ${winsize.height/2}px)`
        }, 'preview')
        .to([previewItem.DOM.img, previewItem.DOM.title], {
            scale: 1,
        }, 'preview')
        .to(previewItem.DOM.boxes, {
            xPercent: 0
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
            scale: 0.95,
            //rotation: 3
        }, 'start')
        .to(contentItem.DOM.img, {
            scale: 1.2,
            //startAt: {filter: 'brightness(100%)'},
            //filter: 'brightness(180%)'
        }, 'start')
        /*
        .to(contentItem.DOM.caption, {
            duration: .05,
            xPercent: () => gsap.utils.random(-2,2),
            yPercent: () => gsap.utils.random(-8,8),
            opacity: () => Math.round(gsap.utils.random(0.4,1)),
            repeat: 3,
            repeatRefresh: true,
            onComplete: () => gsap.set(contentItem.DOM.caption, {xPercent: 0, yPercent: 0, opacity: 1}),
        }, 'start')
        */
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
            scale: 1
        }, 'start')
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
            ease: 'power2',
        },
        onStart: () => {
            gsap.set(previewItem.DOM.el, {
                clipPath: `circle(60vmax at ${winsize.width/2}px ${winsize.height/2}px)`
            });
        },
        onComplete: () => {
            previewItem.DOM.el.classList.remove('preview__item--current');
            bodyEl.classList.remove('preview-open');
            isAnimating = false;
        }
    })
    .addLabel('start', 0)
    .addLabel('content', 'start+=0.2')
    .to(backCtrl, {
        opacity: 0
    }, 'start')
    .to(previewItem.DOM.title, {
        scale: 0.6,
    }, 'start')
    .to(previewItem.DOM.img, {
        scale: 0.9,
    }, 'start')
    .to(previewItem.DOM.el, {
        duration: 0.6,
        clipPath: `circle(0vmax at ${winsize.width/2}px ${winsize.height/2}px)`
    }, 'start')
    .to(contentOverlay, {
        duration: 0.6,
        ease: 'power3.inOut',
        scale: 0
    }, 'content')
    .to(contentItems[current].DOM.imgWrap, {
        startAt: {scale: 1.2},
        scale: 1
    }, 'content');
});

// Preload images
preloadImages('.content__item-img').then(() => document.body.classList.remove('loading'));