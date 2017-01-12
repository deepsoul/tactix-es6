"use strict";

var template = require('../utils/template');
var validBrowser = !navigator.userAgent.match(/(Google Page Speed Insights)/i);

if (!global.HTMLPictureElement) {
    document.createElement('picture');
    document.createElement('source');
}

global.addEventListener('resize', function () {
    render(document.getElementsByTagName('picture'));
}, false);

var devicePixelRatio = global.devicePixelRatio || 1;
var screenMatrix = ['lg', 'md', 'sm', 'xs', 'default'];

var init = {
    ready: false,
    promises: [],
    callbacks: []
};

module.exports = global.picture = {
    parse: function (node) {
        if(!node) {
            node = document.body;
        }
        node = getNativeNode(node);
        if(node.tagName.toLowerCase() === 'picture') {
            registerObserver(node.querySelectorAll('img'));
            render([node]);
        } else {
            registerObserver(node.querySelectorAll('picture img'));
            render(node.querySelectorAll('picture'));
        }
    },

    update: function(node, sources) {
        node = getNativeNode(node);
        sources.forEach(function(source) {
            node.querySelectorAll('source.' + source.type)[0].srcset = source.srcset;
        });
    },

    ready: function(cb) {
        if(init.ready) {
            cb();
        } else {
            init.callbacks.push(cb);
        }
    }
};

document.addEventListener( "DOMContentLoaded", function() {

    var nodes = [].map.call(document.querySelectorAll('picture > img'), function(image) {
        return image.promise;
    });
    Promise.all(nodes).then(function() {
        init.ready = true;
        while(init.callbacks.length > 0) {
            (init.callbacks.shift())();
        }
    });
}, false);

function getNativeNode(node) {
    if (node.get) {
        return node.get(0);
    }
    return node;
}

function registerObserver(images) {
    [].forEach.call(images, function(image) {
        if (!global.HTMLPictureElement) {
            image.addEventListener('load', stopPropagation, false);
        }
        image.promise = new Promise(function(resolve, reject) {
            var tmpl = image.parentNode.querySelector('template');
            if(tmpl) {
                var svgImage = createSVG(tmpl, image);
                image.onload = function(e) {
                    // svgImage.addEventListener('load', function() {
                    //
                    // }, false);
                    updateSVG(svgImage, e.target);
                    resolve(true);
                };
            } else {
                image.onload = resolve;
            }
            image.onerror = reject;
        });
    });
}

function createSVG(tmpl, image) {
    var node = template.getContent(tmpl).cloneNode(true);
    var svgImage = node.querySelector('image');
    image.classList.add('js-hidden');
    image.parentNode.appendChild(node);
    return svgImage;
}

function updateSVG(svgImage, image) {
    svgImage.setAttribute('xlink:href', image.currentSrc || image.src);
    svgImage.setAttribute('width', image.naturalWidth);
    svgImage.setAttribute('height', image.naturalHeight);
    svgImage.parentNode.setAttribute('viewBox', '0 0 ' + image.naturalWidth + ' ' + image.naturalHeight);
    svgImage.parentNode.setAttribute('width', image.naturalWidth);
    svgImage.parentNode.setAttribute('height', image.naturalHeight);
}

function render(pictures) {
    if(validBrowser) {
        if (!global.HTMLPictureElement) {
            var screenSize = getScreenSize();
        }
        pictures = Array.prototype.slice.call(pictures);
        pictures.forEach(function (picture) {
            if (!global.HTMLPictureElement) {
                if (!picture.modified) {
                    removeIE9VideoShim(picture);
                    picture.modified = true;
                }
                showImage(picture, screenSize);
            }
        });
    }
}

var size = null;
function getScreenSize() {
    if(!size) {
        size = document.body.currentStyle || global.getComputedStyle(document.body, ':after');
        if(!size.getPropertyValue('content')) {
            size = global.getComputedStyle(document.body, ':after');
        }
    }
    return screenMatrix.indexOf(size.getPropertyValue('content').replace(/"/g, "").replace(/'/g, ""));
}

/*
 *  Removes the IE9 video shim (conditional comment)
 */
function removeIE9VideoShim(picture) {
    var video = picture.querySelector('video');
    if(video) {
        var vsources = video.getElementsByTagName('source');
        while (vsources.length) {
            picture.insertBefore(vsources[ 0 ], video);
        }
        video.parentNode.removeChild(video);
    }
}

function showImage(picture, screenSize) {
    if(picture.image === undefined) {
        picture.image = picture.querySelector('img');
    } else {
        picture.image.removeEventListener('load', stopPropagation);
    }

    if(picture.image.type === undefined || picture.image.type !== screenMatrix[screenSize]) {
        var source = picture.querySelector('source.' + screenMatrix[screenSize]);
        if(source) {
            loadImage(picture, source);
        } else {
            if(screenSize < 4) {
                showImage(picture, ++screenSize);
            } else {
                throw 'no sources defined';
            }
        }
    }
}

function stopPropagation(e) {
    e.stopImmediatePropagation();
}

function loadImage(picture, source) {
    global.animationFrame.addOnce(function() {
        setSource(picture, source);
    });
    picture.image.type = source.className;
}

function setSource(picture, source) {
    var srcset = source.getAttribute('srcset');
    if(srcset) {
        picture.image.src = getSrcFromSrcSet(srcset);
    } else {
        picture.image.src = source.src;
    }
}

function getSrcFromSrcSet(srcset) {
    var candidates = getCandidates(srcset);
    return getBestCandidate(candidates).url;
}

function getCandidates(srcset) {
    var candidates = srcset.split( /\s*,\s*/ );
    var formattedCandidates = [];

    for ( var i = 0, len = candidates.length; i < len; i++ ) {
        var candidate = candidates[ i ];
        var candidateArr = candidate.split( /\s+/ );
        var sizeDescriptor = candidateArr[ 1 ];
        var resolution;
        if ( sizeDescriptor && ( sizeDescriptor.slice( -1 ) === "w" || sizeDescriptor.slice( -1 ) === "x" ) ) {
            sizeDescriptor = sizeDescriptor.slice( 0, -1 );
        }

        resolution = sizeDescriptor ? parseFloat( sizeDescriptor, 10 ) : 1;

        var formattedCandidate = {
            url: candidateArr[ 0 ],
            resolution: resolution
        };
        formattedCandidates.push( formattedCandidate );
    }
    return formattedCandidates;
}

function getBestCandidate(candidates) {
    candidates.sort(function( a, b ) {
        return b.resolution - a.resolution;
    });
    var candidate, bestCandidate = candidates[0];
    for ( var l=1; l < candidates.length; l++ ) {
        candidate = candidates[ l ];
        if ( candidate.resolution >= Math.round(devicePixelRatio) && candidate.resolution <= bestCandidate.resolution) {
            bestCandidate = candidate;
        } else {
            break;
        }
    }
    return bestCandidate;
}
