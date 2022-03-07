/*!
 * Imgviewer.js v1.1.2
 * undefined
 *
 * Copyright 2015-present zhan
 * Released under the MIT license
 *
 * Date: 2022-03-07T05:10:41.121Z
 */

var DEFAULTS = {
  /**
   * Enable a modal backdrop, specify `static` for a backdrop
   * which doesn't close the modal on click.
   * @type {boolean}
   */
  backdrop: true,

  /**
   * Show the button on the top-right of the viewer.
   * @type {boolean}
   */
  button: true,

  /**
   * Show the navbar.
   * @type {boolean | number}
   */
  navbar: true,

  /**
   * Specify the visibility and the content of the title.
   * @type {boolean | number | Function | Array}
   */
  title: true,

  /**
   * Show the toolbar.
   * @type {boolean | number | Object}
   */
  toolbar: true,

  /**
   * Custom class name(s) to add to the viewer's root element.
   * @type {string}
   */
  className: '',

  /**
   * Define where to put the viewer in modal mode.
   * @type {string | Element}
   */
  container: 'body',

  /**
   * Filter the images for viewing. Return true if the image is viewable.
   * @type {Function}
   */
  filter: null,

  /**
   * Enable to request fullscreen when play.
   * @type {boolean}
   */
  fullscreen: true,

  /**
   * Define the extra attributes to inherit from the original image.
   * @type {Array}
   */
  inheritedAttributes: ['crossOrigin', 'decoding', 'isMap', 'loading', 'referrerPolicy', 'sizes', 'srcset', 'useMap'],

  /**
   * Define the initial index of image for viewing.
   * @type {number}
   */
  initialViewIndex: 0,

  /**
   * Enable inline mode.
   * @type {boolean}
   */
  inline: false,

  /**
   * The amount of time to delay between automatically cycling an image when playing.
   * @type {number}
   */
  interval: 5000,

  /**
   * Enable keyboard support.
   * @type {boolean}
   */
  keyboard: true,

  /**
   * Indicate if show a loading spinner when load image or not.
   * @type {boolean}
   */
  loading: true,

  /**
   * Indicate if enable loop viewing or not.
   * @type {boolean}
   */
  loop: true,

  /**
   * Min width of the viewer in inline mode.
   * @type {number}
   */
  minWidth: 200,

  /**
   * Min height of the viewer in inline mode.
   * @type {number}
   */
  minHeight: 100,

  /**
   * Enable to move the image.
   * @type {boolean}
   */
  movable: true,

  /**
   * Enable to rotate the image.
   * @type {boolean}
   */
  rotatable: true,

  /**
   * Enable to scale the image.
   * @type {boolean}
   */
  scalable: true,

  /**
   * Enable to zoom the image.
   * @type {boolean}
   */
  zoomable: true,

  /**
   * Enable to zoom the current image by dragging on the touch screen.
   * @type {boolean}
   */
  zoomOnTouch: true,

  /**
   * Enable to zoom the image by wheeling mouse.
   * @type {boolean}
   */
  zoomOnWheel: true,

  /**
   * Enable to slide to the next or previous image by swiping on the touch screen.
   * @type {boolean}
   */
  slideOnTouch: true,

  /**
   * Indicate if toggle the image size between its natural size
   * and initial size when double click on the image or not.
   * @type {boolean}
   */
  toggleOnDblclick: true,

  /**
   * Show the tooltip with image ratio (percentage) when zoom in or zoom out.
   * @type {boolean}
   */
  tooltip: true,

  /**
   * Enable CSS3 Transition for some special elements.
   * @type {boolean}
   */
  transition: true,

  /**
   * Define the CSS `z-index` value of viewer in modal mode.
   * @type {number}
   */
  zIndex: 2015,

  /**
   * Define the CSS `z-index` value of viewer in inline mode.
   * @type {number}
   */
  zIndexInline: 0,

  /**
   * Define the ratio when zoom the image by wheeling mouse.
   * @type {number}
   */
  zoomRatio: 0.1,

  /**
   * Define the min ratio of the image when zoom out.
   * @type {number}
   */
  minZoomRatio: 0.01,

  /**
   * Define the max ratio of the image when zoom in.
   * @type {number}
   */
  maxZoomRatio: 100,

  /**
   * Define where to get the original image URL for viewing.
   * @type {string | Function}
   */
  url: 'src',

  /**
   * Event shortcuts.
   * @type {Function}
   */
  ready: null,
  show: null,
  shown: null,
  hide: null,
  hidden: null,
  view: null,
  viewed: null,
  zoom: null,
  zoomed: null,
  play: null,
  stop: null
};

var TEMPLATE = '<div class="viewer-container-custom"><div class="viewer-container" touch-action="none">' + '<div class="viewer-previewBox"><div class="viewer-preview"></div></div>' + '<div class="viewer-canvas"></div>' + '<div class="viewer-artwork"><a target="_black">查看原图</a></div>' + '<div class="viewer-footer">' + '<div class="viewer-title"></div>' + '<div class="viewer-toolbar"></div>' + '<div class="viewer-tip">提示：使用方向键 ↑ ↓ 键切换上一笔、下一笔费用，使用方向键 ← → 在多张图片中进行切换。</div>' + '<div class="viewer-navbar">' + '<ul class="viewer-list"></ul>' + '</div>' + '</div>' + '<div class="viewer-tooltip"></div>' + '<div role="button" class="viewer-button" data-viewer-action="mix"></div>' + '<div class="viewer-player"></div>' + '</div></div>';

const IS_BROWSER = typeof window !== 'undefined' && typeof window.document !== 'undefined';
const WINDOW = IS_BROWSER ? window : {};
const IS_TOUCH_DEVICE = IS_BROWSER && WINDOW.document.documentElement ? 'ontouchstart' in WINDOW.document.documentElement : false;
const HAS_POINTER_EVENT = IS_BROWSER ? 'PointerEvent' in WINDOW : false;
const NAMESPACE = 'viewer'; // Actions

const ACTION_MOVE = 'move';
const ACTION_SWITCH = 'switch';
const ACTION_ZOOM = 'zoom'; // Classes

const CLASS_ACTIVE = `${NAMESPACE}-active`;
const CLASS_CLOSE = `${NAMESPACE}-close`;
const CLASS_FADE = `${NAMESPACE}-fade`;
const CLASS_FIXED = `${NAMESPACE}-fixed`;
const CLASS_FULLSCREEN = `${NAMESPACE}-fullscreen`;
const CLASS_FULLSCREEN_EXIT = `${NAMESPACE}-fullscreen-exit`;
const CLASS_HIDE = `${NAMESPACE}-hide`;
const CLASS_HIDE_MD_DOWN = `${NAMESPACE}-hide-md-down`;
const CLASS_HIDE_SM_DOWN = `${NAMESPACE}-hide-sm-down`;
const CLASS_HIDE_XS_DOWN = `${NAMESPACE}-hide-xs-down`;
const CLASS_IN = `${NAMESPACE}-in`;
const CLASS_INVISIBLE = `${NAMESPACE}-invisible`;
const CLASS_LOADING = `${NAMESPACE}-loading`;
const CLASS_MOVE = `${NAMESPACE}-move`;
const CLASS_OPEN = `${NAMESPACE}-open`;
const CLASS_SHOW = `${NAMESPACE}-show`;
const CLASS_TRANSITION = `${NAMESPACE}-transition`; // Events

const EVENT_CLICK = 'click';
const EVENT_DBLCLICK = 'dblclick';
const EVENT_DRAG_START = 'dragstart';
const EVENT_HIDDEN = 'hidden';
const EVENT_HIDE = 'hide';
const EVENT_KEY_DOWN = 'keydown';
const EVENT_LOAD = 'load';
const EVENT_TOUCH_START = IS_TOUCH_DEVICE ? 'touchstart' : 'mousedown';
const EVENT_TOUCH_MOVE = IS_TOUCH_DEVICE ? 'touchmove' : 'mousemove';
const EVENT_TOUCH_END = IS_TOUCH_DEVICE ? 'touchend touchcancel' : 'mouseup';
const EVENT_POINTER_DOWN = HAS_POINTER_EVENT ? 'pointerdown' : EVENT_TOUCH_START;
const EVENT_POINTER_MOVE = HAS_POINTER_EVENT ? 'pointermove' : EVENT_TOUCH_MOVE;
const EVENT_POINTER_UP = HAS_POINTER_EVENT ? 'pointerup pointercancel' : EVENT_TOUCH_END;
const EVENT_READY = 'ready';
const EVENT_RESIZE = 'resize';
const EVENT_SHOW = 'show';
const EVENT_SHOWN = 'shown';
const EVENT_TRANSITION_END = 'transitionend';
const EVENT_VIEW = 'view';
const EVENT_VIEWED = 'viewed';
const EVENT_WHEEL = 'wheel';
const EVENT_ZOOM = 'zoom';
const EVENT_ZOOMED = 'zoomed';
const EVENT_PLAY = 'play';
const EVENT_STOP = 'stop'; // Data keys

const DATA_ACTION = `${NAMESPACE}Action`; // RegExps

const REGEXP_SPACES = /\s\s*/; // Misc

const BUTTONS = ['zoom-in', 'zoom-out', 'one-to-one', 'reset', 'prev', 'play', 'next', 'rotate-left', 'rotate-right', 'flip-horizontal', 'flip-vertical'];

/**
 * Check if the given value is a string.
 * @param {*} value - The value to check.
 * @returns {boolean} Returns `true` if the given value is a string, else `false`.
 */

function isString(value) {
  return typeof value === 'string';
}
/**
 * Check if the given value is not a number.
 */

const isNaN = Number.isNaN || WINDOW.isNaN;
/**
 * Check if the given value is a number.
 * @param {*} value - The value to check.
 * @returns {boolean} Returns `true` if the given value is a number, else `false`.
 */

function isNumber(value) {
  return typeof value === 'number' && !isNaN(value);
}
/**
 * Check if the given value is undefined.
 * @param {*} value - The value to check.
 * @returns {boolean} Returns `true` if the given value is undefined, else `false`.
 */

function isUndefined(value) {
  return typeof value === 'undefined';
}
/**
 * Check if the given value is an object.
 * @param {*} value - The value to check.
 * @returns {boolean} Returns `true` if the given value is an object, else `false`.
 */

function isObject(value) {
  return typeof value === 'object' && value !== null;
}
const {
  hasOwnProperty
} = Object.prototype;
/**
 * Check if the given value is a plain object.
 * @param {*} value - The value to check.
 * @returns {boolean} Returns `true` if the given value is a plain object, else `false`.
 */

function isPlainObject(value) {
  if (!isObject(value)) {
    return false;
  }

  try {
    const {
      constructor
    } = value;
    const {
      prototype
    } = constructor;
    return constructor && prototype && hasOwnProperty.call(prototype, 'isPrototypeOf');
  } catch (error) {
    return false;
  }
}
/**
 * Check if the given value is a function.
 * @param {*} value - The value to check.
 * @returns {boolean} Returns `true` if the given value is a function, else `false`.
 */

function isFunction(value) {
  return typeof value === 'function';
}
/**
 * Iterate the given data.
 * @param {*} data - The data to iterate.
 * @param {Function} callback - The process function for each element.
 * @returns {*} The original data.
 */

function forEach(data, callback) {
  if (data && isFunction(callback)) {
    if (Array.isArray(data) || isNumber(data.length)
    /* array-like */
    ) {
      const {
        length
      } = data;
      let i;

      for (i = 0; i < length; i += 1) {
        if (callback.call(data, data[i], i, data) === false) {
          break;
        }
      }
    } else if (isObject(data)) {
      Object.keys(data).forEach(key => {
        callback.call(data, data[key], key, data);
      });
    }
  }

  return data;
}
/**
 * Extend the given object.
 * @param {*} obj - The object to be extended.
 * @param {*} args - The rest objects which will be merged to the first object.
 * @returns {Object} The extended object.
 */

const assign = Object.assign || function assign(obj, ...args) {
  if (isObject(obj) && args.length > 0) {
    args.forEach(arg => {
      if (isObject(arg)) {
        Object.keys(arg).forEach(key => {
          obj[key] = arg[key];
        });
      }
    });
  }

  return obj;
};
const REGEXP_SUFFIX = /^(?:width|height|left|top|marginLeft|marginTop)$/;
/**
 * Apply styles to the given element.
 * @param {Element} element - The target element.
 * @param {Object} styles - The styles for applying.
 */

function setStyle(element, styles) {
  const {
    style
  } = element;
  forEach(styles, (value, property) => {
    if (REGEXP_SUFFIX.test(property) && isNumber(value)) {
      value += 'px';
    }

    style[property] = value;
  });
}
/**
 * Escape a string for using in HTML.
 * @param {String} value - The string to escape.
 * @returns {String} Returns the escaped string.
 */

function escapeHTMLEntities(value) {
  return isString(value) ? value.replace(/&(?!amp;|quot;|#39;|lt;|gt;)/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;') : value;
}
/**
 * Check if the given element has a special class.
 * @param {Element} element - The element to check.
 * @param {string} value - The class to search.
 * @returns {boolean} Returns `true` if the special class was found.
 */

function hasClass(element, value) {
  if (!element || !value) {
    return false;
  }

  return element.classList ? element.classList.contains(value) : element.className.indexOf(value) > -1;
}
/**
 * Add classes to the given element.
 * @param {Element} element - The target element.
 * @param {string} value - The classes to be added.
 */

function addClass(element, value) {
  if (!element || !value) {
    return;
  }

  if (isNumber(element.length)) {
    forEach(element, elem => {
      addClass(elem, value);
    });
    return;
  }

  if (element.classList) {
    element.classList.add(value);
    return;
  }

  const className = element.className.trim();

  if (!className) {
    element.className = value;
  } else if (className.indexOf(value) < 0) {
    element.className = `${className} ${value}`;
  }
}
/**
 * Remove classes from the given element.
 * @param {Element} element - The target element.
 * @param {string} value - The classes to be removed.
 */

function removeClass(element, value) {
  if (!element || !value) {
    return;
  }

  if (isNumber(element.length)) {
    forEach(element, elem => {
      removeClass(elem, value);
    });
    return;
  }

  if (element.classList) {
    element.classList.remove(value);
    return;
  }

  if (element.className.indexOf(value) >= 0) {
    element.className = element.className.replace(value, '');
  }
}
/**
 * Add or remove classes from the given element.
 * @param {Element} element - The target element.
 * @param {string} value - The classes to be toggled.
 * @param {boolean} added - Add only.
 */

function toggleClass(element, value, added) {
  if (!value) {
    return;
  }

  if (isNumber(element.length)) {
    forEach(element, elem => {
      toggleClass(elem, value, added);
    });
    return;
  } // IE10-11 doesn't support the second parameter of `classList.toggle`


  if (added) {
    addClass(element, value);
  } else {
    removeClass(element, value);
  }
}
const REGEXP_HYPHENATE = /([a-z\d])([A-Z])/g;
/**
 * Transform the given string from camelCase to kebab-case
 * @param {string} value - The value to transform.
 * @returns {string} The transformed value.
 */

function hyphenate(value) {
  return value.replace(REGEXP_HYPHENATE, '$1-$2').toLowerCase();
}
/**
 * Get data from the given element.
 * @param {Element} element - The target element.
 * @param {string} name - The data key to get.
 * @returns {string} The data value.
 */

function getData(element, name) {
  if (isObject(element[name])) {
    return element[name];
  }

  if (element.dataset) {
    return element.dataset[name];
  }

  return element.getAttribute(`data-${hyphenate(name)}`);
}
/**
 * Set data to the given element.
 * @param {Element} element - The target element.
 * @param {string} name - The data key to set.
 * @param {string} data - The data value.
 */

function setData(element, name, data) {
  if (isObject(data)) {
    element[name] = data;
  } else if (element.dataset) {
    element.dataset[name] = data;
  } else {
    element.setAttribute(`data-${hyphenate(name)}`, data);
  }
}

const onceSupported = (() => {
  let supported = false;

  if (IS_BROWSER) {
    let once = false;

    const listener = () => {};

    const options = Object.defineProperty({}, 'once', {
      get() {
        supported = true;
        return once;
      },

      /**
       * This setter can fix a `TypeError` in strict mode
       * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Getter_only}
       * @param {boolean} value - The value to set
       */
      set(value) {
        once = value;
      }

    });
    WINDOW.addEventListener('test', listener, options);
    WINDOW.removeEventListener('test', listener, options);
  }

  return supported;
})();
/**
 * Remove event listener from the target element.
 * @param {Element} element - The event target.
 * @param {string} type - The event type(s).
 * @param {Function} listener - The event listener.
 * @param {Object} options - The event options.
 */


function removeListener(element, type, listener, options = {}) {
  let handler = listener;
  type.trim().split(REGEXP_SPACES).forEach(event => {
    if (!onceSupported) {
      const {
        listeners
      } = element;

      if (listeners && listeners[event] && listeners[event][listener]) {
        handler = listeners[event][listener];
        delete listeners[event][listener];

        if (Object.keys(listeners[event]).length === 0) {
          delete listeners[event];
        }

        if (Object.keys(listeners).length === 0) {
          delete element.listeners;
        }
      }
    }

    element.removeEventListener(event, handler, options);
  });
}
/**
 * Add event listener to the target element.
 * @param {Element} element - The event target.
 * @param {string} type - The event type(s).
 * @param {Function} listener - The event listener.
 * @param {Object} options - The event options.
 */

function addListener(element, type, listener, options = {}) {
  let handler = listener;
  type.trim().split(REGEXP_SPACES).forEach(event => {
    if (options.once && !onceSupported) {
      const {
        listeners = {}
      } = element;

      handler = (...args) => {
        delete listeners[event][listener];
        element.removeEventListener(event, handler, options);
        listener.apply(element, args);
      };

      if (!listeners[event]) {
        listeners[event] = {};
      }

      if (listeners[event][listener]) {
        element.removeEventListener(event, listeners[event][listener], options);
      }

      listeners[event][listener] = handler;
      element.listeners = listeners;
    }

    element.addEventListener(event, handler, options);
  });
}
/**
 * Dispatch event on the target element.
 * @param {Element} element - The event target.
 * @param {string} type - The event type(s).
 * @param {Object} data - The additional event data.
 * @param {Object} options - The additional event options.
 * @returns {boolean} Indicate if the event is default prevented or not.
 */

function dispatchEvent(element, type, data, options) {
  let event; // Event and CustomEvent on IE9-11 are global objects, not constructors

  if (isFunction(Event) && isFunction(CustomEvent)) {
    event = new CustomEvent(type, {
      bubbles: true,
      cancelable: true,
      detail: data,
      ...options
    });
  } else {
    event = document.createEvent('CustomEvent');
    event.initCustomEvent(type, true, true, data);
  }

  return element.dispatchEvent(event);
}
/**
 * Get the offset base on the document.
 * @param {Element} element - The target element.
 * @returns {Object} The offset data.
 */

function getOffset(element) {
  const box = element.getBoundingClientRect();
  return {
    left: box.left + (window.pageXOffset - document.documentElement.clientLeft),
    top: box.top + (window.pageYOffset - document.documentElement.clientTop)
  };
}
/**
 * Get transforms base on the given object.
 * @param {Object} obj - The target object.
 * @returns {string} A string contains transform values.
 */

function getTransforms({
  rotate,
  scaleX,
  scaleY,
  translateX,
  translateY
}) {
  const values = [];

  if (isNumber(translateX) && translateX !== 0) {
    values.push(`translateX(${translateX}px)`);
  }

  if (isNumber(translateY) && translateY !== 0) {
    values.push(`translateY(${translateY}px)`);
  } // Rotate should come first before scale to match orientation transform


  if (isNumber(rotate) && rotate !== 0) {
    values.push(`rotate(${rotate}deg)`);
  }

  if (isNumber(scaleX) && scaleX !== 1) {
    values.push(`scaleX(${scaleX})`);
  }

  if (isNumber(scaleY) && scaleY !== 1) {
    values.push(`scaleY(${scaleY})`);
  }

  const transform = values.length ? values.join(' ') : 'none';
  return {
    WebkitTransform: transform,
    msTransform: transform,
    transform
  };
}
/**
 * Get an image name from an image url.
 * @param {string} url - The target url.
 * @example
 * // picture.jpg
 * getImageNameFromURL('https://domain.com/path/to/picture.jpg?size=1280×960')
 * @returns {string} A string contains the image name.
 */

function getImageNameFromURL(url) {
  return isString(url) ? decodeURIComponent(url.replace(/^.*\//, '').replace(/[?&#].*$/, '')) : '';
}
const IS_SAFARI = WINDOW.navigator && /(Macintosh|iPhone|iPod|iPad).*AppleWebKit/i.test(WINDOW.navigator.userAgent);
/**
 * Get an image's natural sizes.
 * @param {string} image - The target image.
 * @param {Object} options - The viewer options.
 * @param {Function} callback - The callback function.
 * @returns {HTMLImageElement} The new image.
 */

function getImageNaturalSizes(image, options, callback) {
  const newImage = document.createElement('img'); // Modern browsers (except Safari)

  if (image.naturalWidth && !IS_SAFARI) {
    callback(image.naturalWidth, image.naturalHeight);
    return newImage;
  }

  const body = document.body || document.documentElement;

  newImage.onload = () => {
    callback(newImage.width, newImage.height);

    if (!IS_SAFARI) {
      body.removeChild(newImage);
    }
  };

  forEach(options.inheritedAttributes, name => {
    const value = image.getAttribute(name);

    if (value !== null) {
      newImage.setAttribute(name, value);
    }
  });
  newImage.src = image.src; // iOS Safari will convert the image automatically
  // with its orientation once append it into DOM

  if (!IS_SAFARI) {
    newImage.style.cssText = 'left:0;' + 'max-height:none!important;' + 'max-width:none!important;' + 'min-height:0!important;' + 'min-width:0!important;' + 'opacity:0;' + 'position:absolute;' + 'top:0;' + 'z-index:-1;';
    body.appendChild(newImage);
  }

  return newImage;
}
/**
 * Get the related class name of a responsive type number.
 * @param {string} type - The responsive type.
 * @returns {string} The related class name.
 */

function getResponsiveClass(type) {
  switch (type) {
    case 2:
      return CLASS_HIDE_XS_DOWN;

    case 3:
      return CLASS_HIDE_SM_DOWN;

    case 4:
      return CLASS_HIDE_MD_DOWN;

    default:
      return '';
  }
}
/**
 * Get the max ratio of a group of pointers.
 * @param {string} pointers - The target pointers.
 * @returns {number} The result ratio.
 */

function getMaxZoomRatio(pointers) {
  const pointers2 = { ...pointers
  };
  const ratios = [];
  forEach(pointers, (pointer, pointerId) => {
    delete pointers2[pointerId];
    forEach(pointers2, pointer2 => {
      const x1 = Math.abs(pointer.startX - pointer2.startX);
      const y1 = Math.abs(pointer.startY - pointer2.startY);
      const x2 = Math.abs(pointer.endX - pointer2.endX);
      const y2 = Math.abs(pointer.endY - pointer2.endY);
      const z1 = Math.sqrt(x1 * x1 + y1 * y1);
      const z2 = Math.sqrt(x2 * x2 + y2 * y2);
      const ratio = (z2 - z1) / z1;
      ratios.push(ratio);
    });
  });
  ratios.sort((a, b) => Math.abs(a) < Math.abs(b));
  return ratios[0];
}
/**
 * Get a pointer from an event object.
 * @param {Object} event - The target event object.
 * @param {boolean} endOnly - Indicates if only returns the end point coordinate or not.
 * @returns {Object} The result pointer contains start and/or end point coordinates.
 */

function getPointer({
  pageX,
  pageY
}, endOnly) {
  const end = {
    endX: pageX,
    endY: pageY
  };
  return endOnly ? end : {
    timeStamp: Date.now(),
    startX: pageX,
    startY: pageY,
    ...end
  };
}
/**
 * Get the center point coordinate of a group of pointers.
 * @param {Object} pointers - The target pointers.
 * @returns {Object} The center point coordinate.
 */

function getPointersCenter(pointers) {
  let pageX = 0;
  let pageY = 0;
  let count = 0;
  forEach(pointers, ({
    startX,
    startY
  }) => {
    pageX += startX;
    pageY += startY;
    count += 1;
  });
  pageX /= count;
  pageY /= count;
  return {
    pageX,
    pageY
  };
}

var render = {
  render() {
    this.initContainer();
    this.initViewer();
    this.initList();
    this.renderViewer();
  },

  initBody() {
    const {
      ownerDocument
    } = this.element;
    const body = ownerDocument.body || ownerDocument.documentElement;
    this.body = body || document.body;

    if (this.options.container) {
      let container = ownerDocument.querySelector(this.options.container);

      if (!container) {
        this.body = container;
      }
    }

    this.scrollbarWidth = window.innerWidth - ownerDocument.documentElement.clientWidth;
    this.initialBodyPaddingRight = body.style ? body.style.paddingRight : 0;
    this.initialBodyComputedPaddingRight = window.getComputedStyle(body).paddingRight;
  },

  initContainer() {
    this.containerData = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    if (this.options.container) {
      const {
        ownerDocument
      } = this.element;
      let container = ownerDocument.querySelector(this.options.container);

      if (container) {
        this.containerData.width = container.clientWidth;
        this.containerData.height = this.options.hideClose ? container.clientHeight - (this.images.length > 1 ? 140 : 0) : container.clientHeight;
      }
    }
  },

  initViewer() {
    const {
      options,
      parent
    } = this;
    let viewerData;

    if (options.inline) {
      viewerData = {
        width: Math.max(parent.offsetWidth, options.minWidth),
        height: Math.max(parent.offsetHeight, options.minHeight)
      };
      this.parentData = viewerData;
    }

    if (this.fulled || !viewerData) {
      viewerData = this.containerData;
    }

    this.viewerData = assign({}, viewerData);
  },

  renderViewer() {
    if (this.options.inline && !this.fulled) {
      setStyle(this.viewer, this.viewerData);
    }
  },

  initList() {
    const {
      element,
      options,
      list
    } = this;
    const items = []; // initList may be called in this.update, so should keep idempotent

    list.innerHTML = '';
    forEach(this.images, (image, index) => {
      const {
        src
      } = image;
      const alt = image.alt || getImageNameFromURL(src);
      const url = this.getImageURL(image);

      if (src || url) {
        const item = document.createElement('li');
        const img = document.createElement('img');
        forEach(options.inheritedAttributes, name => {
          const value = image.getAttribute(name);

          if (value !== null) {
            img.setAttribute(name, value);
          }
        });
        img.src = src || url;
        img.alt = alt;
        img.setAttribute('data-index', index);
        img.setAttribute('data-original-url', url || src);
        img.setAttribute('data-viewer-action', 'view');
        img.setAttribute('role', 'button');
        item.appendChild(img);
        list.appendChild(item);
        items.push(item);
      }
    });
    this.items = items;
    forEach(items, item => {
      const image = item.firstElementChild;
      setData(image, 'filled', true);

      if (options.loading) {
        addClass(item, CLASS_LOADING);
      }

      addListener(image, EVENT_LOAD, event => {
        if (options.loading) {
          removeClass(item, CLASS_LOADING);
        }

        this.loadImage(event);
      }, {
        once: true
      });
    });

    if (options.transition) {
      addListener(element, EVENT_VIEWED, () => {
        addClass(list, CLASS_TRANSITION);
      }, {
        once: true
      });
    }
  },

  renderList(index) {
    const i = index || this.index;
    const width = this.items[i].offsetWidth || 30;
    const outerWidth = width + 1; // 1 pixel of `margin-left` width
    // Place the active item in the center of the screen

    setStyle(this.list, assign({
      width: outerWidth * this.length
    }, getTransforms({
      translateX: (this.viewerData.width - width) / 2 - outerWidth * i
    })));
  },

  resetList() {
    const {
      list
    } = this;
    list.innerHTML = '';
    removeClass(list, CLASS_TRANSITION);
    setStyle(list, getTransforms({
      translateX: 0
    }));
  },

  initImage(done) {
    const {
      options,
      image,
      viewerData
    } = this;
    const footerHeight = this.footer.offsetHeight;
    const viewerWidth = viewerData.width;
    const viewerHeight = Math.max(viewerData.height - footerHeight, footerHeight);
    const oldImageData = this.imageData || {};
    let sizingImage;
    this.imageInitializing = {
      abort: () => {
        sizingImage.onload = null;
      }
    };
    sizingImage = getImageNaturalSizes(image, options, (naturalWidth, naturalHeight) => {
      const aspectRatio = naturalWidth / naturalHeight;
      let width = viewerWidth;
      let height = viewerHeight;
      this.imageInitializing = false;

      if (viewerHeight * aspectRatio > viewerWidth) {
        height = viewerWidth / aspectRatio;
      } else {
        width = viewerHeight * aspectRatio;
      }

      width = Math.min(width * 0.9, naturalWidth);
      height = Math.min(height * 0.9, naturalHeight);
      const imageData = {
        naturalWidth,
        naturalHeight,
        aspectRatio,
        ratio: width / naturalWidth,
        width,
        height,
        left: (viewerWidth - width) / 2,
        top: (viewerHeight - height) / 2
      };
      const initialImageData = assign({}, imageData);

      if (options.rotatable) {
        imageData.rotate = oldImageData.rotate || 0;
        initialImageData.rotate = 0;
      }

      if (options.scalable) {
        imageData.scaleX = oldImageData.scaleX || 1;
        imageData.scaleY = oldImageData.scaleY || 1;
        initialImageData.scaleX = 1;
        initialImageData.scaleY = 1;
      }

      this.imageData = imageData;
      this.initialImageData = initialImageData;

      if (done) {
        done();
      }
    });
  },

  renderImage(done) {
    const {
      image,
      imageData
    } = this;
    setStyle(image, assign({
      width: imageData.width,
      height: imageData.height,
      // XXX: Not to use translateX/Y to avoid image shaking when zooming
      marginLeft: imageData.left,
      marginTop: imageData.top
    }, getTransforms(imageData)));

    if (done) {
      if ((this.viewing || this.zooming) && this.options.transition) {
        const onTransitionEnd = () => {
          this.imageRendering = false;
          done();
        };

        this.imageRendering = {
          abort: () => {
            removeListener(image, EVENT_TRANSITION_END, onTransitionEnd);
          }
        };
        addListener(image, EVENT_TRANSITION_END, onTransitionEnd, {
          once: true
        });
      } else {
        done();
      }
    }
  },

  resetImage() {
    // this.image only defined after viewed
    if (this.viewing || this.viewed) {
      const {
        image
      } = this;

      if (this.viewing) {
        this.viewing.abort();
      }

      image.parentNode.removeChild(image);
      this.image = null;
    }
  }

};

var events = {
  bind() {
    const {
      options,
      viewer,
      canvas
    } = this;
    const document = this.element.ownerDocument;
    addListener(viewer, EVENT_CLICK, this.onClick = this.click.bind(this));
    addListener(viewer, EVENT_DRAG_START, this.onDragStart = this.dragstart.bind(this));
    addListener(canvas, EVENT_POINTER_DOWN, this.onPointerDown = this.pointerdown.bind(this));
    addListener(document, EVENT_POINTER_MOVE, this.onPointerMove = this.pointermove.bind(this));
    addListener(document, EVENT_POINTER_UP, this.onPointerUp = this.pointerup.bind(this));
    addListener(document, EVENT_KEY_DOWN, this.onKeyDown = this.keydown.bind(this));
    addListener(window, EVENT_RESIZE, this.onResize = this.resize.bind(this));

    if (options.zoomable && options.zoomOnWheel) {
      addListener(viewer, EVENT_WHEEL, this.onWheel = this.wheel.bind(this), {
        passive: false,
        capture: true
      });
    }

    if (options.toggleOnDblclick) {
      addListener(canvas, EVENT_DBLCLICK, this.onDblclick = this.dblclick.bind(this));
    }
  },

  unbind() {
    const {
      options,
      viewer,
      canvas
    } = this;
    const document = this.element.ownerDocument;
    removeListener(viewer, EVENT_CLICK, this.onClick);
    removeListener(viewer, EVENT_DRAG_START, this.onDragStart);
    removeListener(canvas, EVENT_POINTER_DOWN, this.onPointerDown);
    removeListener(document, EVENT_POINTER_MOVE, this.onPointerMove);
    removeListener(document, EVENT_POINTER_UP, this.onPointerUp);
    removeListener(document, EVENT_KEY_DOWN, this.onKeyDown);
    removeListener(window, EVENT_RESIZE, this.onResize);

    if (options.zoomable && options.zoomOnWheel) {
      removeListener(viewer, EVENT_WHEEL, this.onWheel, {
        passive: false,
        capture: true
      });
    }

    if (options.toggleOnDblclick) {
      removeListener(canvas, EVENT_DBLCLICK, this.onDblclick);
    }
  }

};

var handlers = {
  click(event) {
    const {
      target
    } = event;
    const {
      options,
      imageData
    } = this;
    const action = getData(target, DATA_ACTION); // Cancel the emulated click when the native click event was triggered.

    if (IS_TOUCH_DEVICE && event.isTrusted && target === this.canvas) {
      clearTimeout(this.clickCanvasTimeout);
    }

    if (target.parentElement.className.indexOf("previewItem") >= 0 || target.className.indexOf("previewItem") >= 0) {
      document.querySelector(".previewItem.active").className = "previewItem";
      let index = target.parentElement.getAttribute("index") || target.getAttribute("index");
      document.querySelectorAll(".previewItem")[index].className = "previewItem active";
      this.view(index);
      return;
    }

    switch (action) {
      case 'mix':
        if (this.played) {
          this.stop();
        } else if (options.inline) {
          if (this.fulled) {
            this.exit();
          } else {
            this.full();
          }
        } else {
          if (!options.hideClose) {
            this.hide();
          }
        }

        break;

      case 'hide':
        this.hide();
        break;

      case 'view':
        this.view(getData(target, 'index'));
        break;

      case 'zoom-in':
        this.zoom(0.1, true);
        break;

      case 'zoom-out':
        this.zoom(-0.1, true);
        break;

      case 'one-to-one':
        this.toggle();
        break;

      case 'reset':
        this.reset();
        break;

      case 'prev':
        this.prev(options.loop);
        break;

      case 'play':
        this.play(options.fullscreen);
        break;

      case 'next':
        this.next(options.loop);
        break;

      case 'rotate-left':
        this.rotate(-90);
        break;

      case 'rotate-right':
        this.rotate(90);
        break;

      case 'flip-horizontal':
        this.scaleX(-imageData.scaleX || -1);
        break;

      case 'flip-vertical':
        this.scaleY(-imageData.scaleY || -1);
        break;

      default:
        if (this.played) {
          this.stop();
        }

    }
  },

  dblclick(event) {
    event.preventDefault();

    if (this.viewed && event.target === this.image) {
      // Cancel the emulated double click when the native dblclick event was triggered.
      if (IS_TOUCH_DEVICE && event.isTrusted) {
        clearTimeout(this.doubleClickImageTimeout);
      }

      this.toggle();
    }
  },

  load() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = false;
    }

    const {
      element,
      options,
      image,
      index,
      viewerData
    } = this;
    removeClass(image, CLASS_INVISIBLE);

    if (options.loading) {
      removeClass(this.canvas, CLASS_LOADING);
    }

    image.style.cssText = 'height:0;' + `margin-left:${viewerData.width / 2}px;` + `margin-top:${viewerData.height / 2}px;` + 'max-width:none!important;' + 'position:absolute;' + 'width:0;';
    this.initImage(() => {
      toggleClass(image, CLASS_MOVE, options.movable);
      toggleClass(image, CLASS_TRANSITION, options.transition);
      this.renderImage(() => {
        this.viewed = true;
        this.viewing = false;

        if (isFunction(options.viewed)) {
          addListener(element, EVENT_VIEWED, options.viewed, {
            once: true
          });
        }

        dispatchEvent(element, EVENT_VIEWED, {
          originalImage: this.images[index],
          index,
          image
        }, {
          cancelable: false
        });
      });
    });
  },

  loadImage(event) {
    const image = event.target;
    const parent = image.parentNode;
    const parentWidth = parent.offsetWidth || 30;
    const parentHeight = parent.offsetHeight || 50;
    const filled = !!getData(image, 'filled');
    getImageNaturalSizes(image, this.options, (naturalWidth, naturalHeight) => {
      const aspectRatio = naturalWidth / naturalHeight;
      let width = parentWidth;
      let height = parentHeight;

      if (parentHeight * aspectRatio > parentWidth) {
        if (filled) {
          width = parentHeight * aspectRatio;
        } else {
          height = parentWidth / aspectRatio;
        }
      } else if (filled) {
        height = parentWidth / aspectRatio;
      } else {
        width = parentHeight * aspectRatio;
      }

      setStyle(image, assign({
        width,
        height
      }, getTransforms({
        translateX: (parentWidth - width) / 2,
        translateY: (parentHeight - height) / 2
      })));
    });
  },

  keydown(event) {
    const {
      options
    } = this;

    if (!this.fulled || !options.keyboard) {
      return;
    }

    switch (event.keyCode || event.which || event.charCode) {
      // Escape
      case 27:
        if (this.played) {
          this.stop();
        } else if (options.inline) {
          if (this.fulled) {
            this.exit();
          }
        } else {
          this.hide();
        }

        break;
      // Space

      case 32:
        if (this.played) {
          this.stop();
        }

        break;
      // ArrowLeft

      case 37:
        this.prev(options.loop);
        break;
      // ArrowUp

      case 38:
        // Prevent scroll on Firefox
        event.preventDefault(); // Zoom in
        // this.zoom(options.zoomRatio, true);

        break;
      // ArrowRight

      case 39:
        this.next(options.loop);
        break;
      // ArrowDown

      case 40:
        // Prevent scroll on Firefox
        event.preventDefault(); // Zoom out
        // this.zoom(-options.zoomRatio, true);

        break;
      // Ctrl + 0

      case 48: // Fall through
      // Ctrl + 1
      // eslint-disable-next-line no-fallthrough

      case 49:
        if (event.ctrlKey) {
          event.preventDefault();
          this.toggle();
        }

        break;
    }
  },

  dragstart(event) {
    if (event.target.tagName.toLowerCase() === 'img') {
      event.preventDefault();
    }
  },

  pointerdown(event) {
    const {
      options,
      pointers
    } = this;
    const {
      buttons,
      button
    } = event;

    if (!this.viewed || this.showing || this.viewing || this.hiding // Handle mouse event and pointer event and ignore touch event
    || (event.type === 'mousedown' || event.type === 'pointerdown' && event.pointerType === 'mouse') && ( // No primary button (Usually the left button)
    isNumber(buttons) && buttons !== 1 || isNumber(button) && button !== 0 // Open context menu
    || event.ctrlKey)) {
      return;
    } // Prevent default behaviours as page zooming in touch devices.


    event.preventDefault();

    if (event.changedTouches) {
      forEach(event.changedTouches, touch => {
        pointers[touch.identifier] = getPointer(touch);
      });
    } else {
      pointers[event.pointerId || 0] = getPointer(event);
    }

    let action = options.movable ? ACTION_MOVE : false;

    if (options.zoomOnTouch && options.zoomable && Object.keys(pointers).length > 1) {
      action = ACTION_ZOOM;
    } else if (options.slideOnTouch && (event.pointerType === 'touch' || event.type === 'touchstart') && this.isSwitchable()) {
      action = ACTION_SWITCH;
    }

    if (options.transition && (action === ACTION_MOVE || action === ACTION_ZOOM)) {
      removeClass(this.image, CLASS_TRANSITION);
    }

    this.action = action;
  },

  pointermove(event) {
    const {
      pointers,
      action
    } = this;

    if (!this.viewed || !action) {
      return;
    }

    event.preventDefault();

    if (event.changedTouches) {
      forEach(event.changedTouches, touch => {
        assign(pointers[touch.identifier] || {}, getPointer(touch, true));
      });
    } else {
      assign(pointers[event.pointerId || 0] || {}, getPointer(event, true));
    }

    this.change(event);
  },

  pointerup(event) {
    const {
      options,
      action,
      pointers
    } = this;
    let pointer;

    if (event.changedTouches) {
      forEach(event.changedTouches, touch => {
        pointer = pointers[touch.identifier];
        delete pointers[touch.identifier];
      });
    } else {
      pointer = pointers[event.pointerId || 0];
      delete pointers[event.pointerId || 0];
    }

    if (!action) {
      return;
    }

    event.preventDefault();

    if (options.transition && (action === ACTION_MOVE || action === ACTION_ZOOM)) {
      addClass(this.image, CLASS_TRANSITION);
    }

    this.action = false; // Emulate click and double click in touch devices to support backdrop and image zooming (#210).

    if (IS_TOUCH_DEVICE && action !== ACTION_ZOOM && pointer && Date.now() - pointer.timeStamp < 500) {
      clearTimeout(this.clickCanvasTimeout);
      clearTimeout(this.doubleClickImageTimeout);

      if (options.toggleOnDblclick && this.viewed && event.target === this.image) {
        if (this.imageClicked) {
          this.imageClicked = false; // This timeout will be cleared later when a native dblclick event is triggering

          this.doubleClickImageTimeout = setTimeout(() => {
            dispatchEvent(this.image, EVENT_DBLCLICK);
          }, 50);
        } else {
          this.imageClicked = true; // The default timing of a double click in Windows is 500 ms

          this.doubleClickImageTimeout = setTimeout(() => {
            this.imageClicked = false;
          }, 500);
        }
      } else {
        this.imageClicked = false;

        if (options.backdrop && options.backdrop !== 'static' && event.target === this.canvas) {
          // This timeout will be cleared later when a native click event is triggering
          this.clickCanvasTimeout = setTimeout(() => {
            dispatchEvent(this.canvas, EVENT_CLICK);
          }, 50);
        }
      }
    }
  },

  resize() {
    if (!this.isShown || this.hiding) {
      return;
    }

    if (this.fulled) {
      this.close();
      this.initBody();
      this.open();
    }

    this.initContainer();
    this.initViewer();
    this.renderViewer();
    this.renderList();

    if (this.viewed) {
      this.initImage(() => {
        this.renderImage();
      });
    }

    if (this.played) {
      if (this.options.fullscreen && this.fulled && !(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement)) {
        this.stop();
        return;
      }

      forEach(this.player.getElementsByTagName('img'), image => {
        addListener(image, EVENT_LOAD, this.loadImage.bind(this), {
          once: true
        });
        dispatchEvent(image, EVENT_LOAD);
      });
    }
  },

  wheel(event) {
    if (!this.viewed) {
      return;
    }

    event.preventDefault(); // Limit wheel speed to prevent zoom too fast

    if (this.wheeling) {
      return;
    }

    this.wheeling = true;
    setTimeout(() => {
      this.wheeling = false;
    }, 50);
    const ratio = Number(this.options.zoomRatio) || 0.1;
    let delta = 1;

    if (event.deltaY) {
      delta = event.deltaY > 0 ? 1 : -1;
    } else if (event.wheelDelta) {
      delta = -event.wheelDelta / 120;
    } else if (event.detail) {
      delta = event.detail > 0 ? 1 : -1;
    }

    this.zoom(-delta * ratio, true, event);
  }

};

var methods = {
  /** Show the viewer (only available in modal mode)
   * @param {boolean} [immediate=false] - Indicates if show the viewer immediately or not.
   * @returns {Viewer} this
   */
  show(immediate = false) {
    const {
      element,
      options
    } = this;

    if (options.inline || this.showing || this.isShown || this.showing) {
      return this;
    }

    if (!this.ready) {
      this.build();

      if (this.ready) {
        this.show(immediate);
      }

      return this;
    }

    if (isFunction(options.show)) {
      addListener(element, EVENT_SHOW, options.show, {
        once: true
      });
    }

    if (dispatchEvent(element, EVENT_SHOW) === false || !this.ready) {
      return this;
    }

    if (this.hiding) {
      this.transitioning.abort();
    }

    this.showing = true;
    this.open();
    const {
      viewer
    } = this;
    removeClass(viewer, CLASS_HIDE);

    if (options.transition && !immediate) {
      const shown = this.shown.bind(this);
      this.transitioning = {
        abort: () => {
          removeListener(viewer, EVENT_TRANSITION_END, shown);
          removeClass(viewer, CLASS_IN);
        }
      };
      addClass(viewer, CLASS_TRANSITION); // Force reflow to enable CSS3 transition

      viewer.initialOffsetWidth = viewer.offsetWidth;
      addListener(viewer, EVENT_TRANSITION_END, shown, {
        once: true
      });
      addClass(viewer, CLASS_IN);
    } else {
      addClass(viewer, CLASS_IN);
      this.shown();
    }

    return this;
  },

  /**
   * Hide the viewer (only available in modal mode)
   * @param {boolean} [immediate=false] - Indicates if hide the viewer immediately or not.
   * @returns {Viewer} this
   */
  hide(immediate = false) {
    const {
      element,
      options
    } = this;

    if (options.inline || this.hiding || !(this.isShown || this.showing)) {
      return this;
    }

    if (isFunction(options.hide)) {
      addListener(element, EVENT_HIDE, options.hide, {
        once: true
      });
    }

    if (dispatchEvent(element, EVENT_HIDE) === false) {
      return this;
    }

    if (this.showing) {
      if (this.transitioning) {
        this.transitioning.abort();
      }
    }

    this.hiding = true;

    if (this.played) {
      this.stop();
    } else if (this.viewing) {
      this.viewing.abort();
    }

    const {
      viewer,
      image
    } = this;

    const hideImmediately = () => {
      removeClass(viewer, CLASS_IN);
      this.hidden();
    };

    if (options.transition && !immediate) {
      const onViewerTransitionEnd = event => {
        // Ignore all propagating `transitionend` events (#275).
        if (event && event.target === viewer) {
          removeListener(viewer, EVENT_TRANSITION_END, onViewerTransitionEnd);
          this.hidden();
        }
      };

      const onImageTransitionEnd = () => {
        // In case of show the viewer by `viewer.show(true)` previously (#407).
        if (hasClass(viewer, CLASS_TRANSITION)) {
          addListener(viewer, EVENT_TRANSITION_END, onViewerTransitionEnd);
          removeClass(viewer, CLASS_IN);
        } else {
          hideImmediately();
        }
      };

      this.transitioning = {
        abort: () => {
          if (this.viewed && hasClass(image, CLASS_TRANSITION)) {
            removeListener(image, EVENT_TRANSITION_END, onImageTransitionEnd);
          } else if (hasClass(viewer, CLASS_TRANSITION)) {
            removeListener(viewer, EVENT_TRANSITION_END, onViewerTransitionEnd);
          }
        }
      }; // In case of hiding the viewer when holding on the image (#255),
      // note that the `CLASS_TRANSITION` class will be removed on pointer down.

      if (this.viewed && hasClass(image, CLASS_TRANSITION)) {
        addListener(image, EVENT_TRANSITION_END, onImageTransitionEnd, {
          once: true
        });
        this.zoomTo(0, false, false, true);
      } else {
        onImageTransitionEnd();
      }
    } else {
      hideImmediately();
    }

    return this;
  },

  /**
   * View one of the images with image's index
   * @param {number} index - The index of the image to view.
   * @returns {Viewer} this
   */
  view(index = this.options.initialViewIndex) {
    index = Number(index) || 0;

    if (this.hiding || this.played || index < 0 || index >= this.length || this.viewed && index === this.index) {
      return this;
    }

    if (!this.isShown) {
      this.index = index;
      return this.show();
    }

    if (this.viewing) {
      this.viewing.abort();
    }

    const {
      element,
      options,
      title,
      canvas
    } = this;
    const item = this.items[index];
    const img = item.querySelector('img');
    const url = getData(img, 'originalUrl');
    const alt = img.getAttribute('alt');
    const image = document.createElement('img');
    forEach(options.inheritedAttributes, name => {
      const value = img.getAttribute(name);

      if (value !== null) {
        image.setAttribute(name, value);
      }
    });
    image.src = url;
    image.alt = alt;

    if (isFunction(options.view)) {
      addListener(element, EVENT_VIEW, options.view, {
        once: true
      });
    }

    if (dispatchEvent(element, EVENT_VIEW, {
      originalImage: this.images[index],
      index,
      image
    }) === false || !this.isShown || this.hiding || this.played) {
      return this;
    }

    this.image = image;
    removeClass(this.items[this.index], CLASS_ACTIVE);
    addClass(item, CLASS_ACTIVE);
    this.viewed = false;
    this.index = index;
    this.imageData = {};
    addClass(image, CLASS_INVISIBLE);

    if (options.loading) {
      addClass(canvas, CLASS_LOADING);
    }

    canvas.innerHTML = '';
    canvas.appendChild(image); // Center current item

    this.renderList(); // Clear title

    title.innerHTML = ''; // Generate title after viewed

    const onViewed = () => {
      const {
        imageData
      } = this;
      const render = Array.isArray(options.title) ? options.title[1] : options.title;
      title.innerHTML = escapeHTMLEntities(isFunction(render) ? render.call(this, image, imageData) : `${alt} (${imageData.naturalWidth} × ${imageData.naturalHeight})`);
    };

    let onLoad;
    addListener(element, EVENT_VIEWED, onViewed, {
      once: true
    });
    this.viewing = {
      abort: () => {
        removeListener(element, EVENT_VIEWED, onViewed);

        if (image.complete) {
          if (this.imageRendering) {
            this.imageRendering.abort();
          } else if (this.imageInitializing) {
            this.imageInitializing.abort();
          }
        } else {
          // Cancel download to save bandwidth.
          image.src = '';
          removeListener(image, EVENT_LOAD, onLoad);

          if (this.timeout) {
            clearTimeout(this.timeout);
          }
        }
      }
    };

    if (image.complete) {
      this.load();
    } else {
      addListener(image, EVENT_LOAD, onLoad = this.load.bind(this), {
        once: true
      });

      if (this.timeout) {
        clearTimeout(this.timeout);
      } // Make the image visible if it fails to load within 1s


      this.timeout = setTimeout(() => {
        removeClass(image, CLASS_INVISIBLE);
        this.timeout = false;
      }, 1000);
    }

    return this;
  },

  /**
   * View the previous image
   * @param {boolean} [loop=false] - Indicate if view the last one
   * when it is the first one at present.
   * @returns {Viewer} this
   */
  prev(loop = false) {
    let index = this.index - 1;

    if (index < 0) {
      index = loop ? this.length - 1 : 0;
    }

    document.querySelector(".previewItem.active").className = "previewItem";
    document.querySelectorAll(".previewItem")[index].className = "previewItem active";
    this.view(index);
    return this;
  },

  /**
   * View the next image
   * @param {boolean} [loop=false] - Indicate if view the first one
   * when it is the last one at present.
   * @returns {Viewer} this
   */
  next(loop = false) {
    const maxIndex = this.length - 1;
    let index = this.index + 1;

    if (index > maxIndex) {
      index = loop ? 0 : maxIndex;
    }

    document.querySelector(".previewItem.active").className = "previewItem";
    document.querySelectorAll(".previewItem")[index].className = "previewItem active";
    this.view(index);
    return this;
  },

  /**
   * Move the image with relative offsets.
   * @param {number} offsetX - The relative offset distance on the x-axis.
   * @param {number} offsetY - The relative offset distance on the y-axis.
   * @returns {Viewer} this
   */
  move(offsetX, offsetY) {
    const {
      imageData
    } = this;
    this.moveTo(isUndefined(offsetX) ? offsetX : imageData.left + Number(offsetX), isUndefined(offsetY) ? offsetY : imageData.top + Number(offsetY));
    return this;
  },

  /**
   * Move the image to an absolute point.
   * @param {number} x - The x-axis coordinate.
   * @param {number} [y=x] - The y-axis coordinate.
   * @returns {Viewer} this
   */
  moveTo(x, y = x) {
    const {
      imageData
    } = this;
    x = Number(x);
    y = Number(y);

    if (this.viewed && !this.played && this.options.movable) {
      let changed = false;

      if (isNumber(x)) {
        imageData.left = x;
        changed = true;
      }

      if (isNumber(y)) {
        imageData.top = y;
        changed = true;
      }

      if (changed) {
        this.renderImage();
      }
    }

    return this;
  },

  /**
   * Zoom the image with a relative ratio.
   * @param {number} ratio - The target ratio.
   * @param {boolean} [hasTooltip=false] - Indicates if it has a tooltip or not.
   * @param {Event} [_originalEvent=null] - The original event if any.
   * @returns {Viewer} this
   */
  zoom(ratio, hasTooltip = false, _originalEvent = null) {
    const {
      imageData
    } = this;
    ratio = Number(ratio);

    if (ratio < 0) {
      ratio = 1 / (1 - ratio);
    } else {
      ratio = 1 + ratio;
    }

    this.zoomTo(imageData.width * ratio / imageData.naturalWidth, hasTooltip, _originalEvent);
    return this;
  },

  /**
   * Zoom the image to an absolute ratio.
   * @param {number} ratio - The target ratio.
   * @param {boolean} [hasTooltip=false] - Indicates if it has a tooltip or not.
   * @param {Event} [_originalEvent=null] - The original event if any.
   * @param {Event} [_zoomable=false] - Indicates if the current zoom is available or not.
   * @returns {Viewer} this
   */
  zoomTo(ratio, hasTooltip = false, _originalEvent = null, _zoomable = false) {
    const {
      element,
      options,
      pointers,
      imageData
    } = this;
    const {
      width,
      height,
      left,
      top,
      naturalWidth,
      naturalHeight
    } = imageData;
    ratio = Math.max(0, ratio);

    if (isNumber(ratio) && this.viewed && !this.played && (_zoomable || options.zoomable)) {
      if (!_zoomable) {
        const minZoomRatio = Math.max(0.01, options.minZoomRatio);
        const maxZoomRatio = Math.min(100, options.maxZoomRatio);
        ratio = Math.min(Math.max(ratio, minZoomRatio), maxZoomRatio);
      }

      if (_originalEvent && options.zoomRatio >= 0.055 && ratio > 0.95 && ratio < 1.05) {
        ratio = 1;
      }

      const newWidth = naturalWidth * ratio;
      const newHeight = naturalHeight * ratio;
      const offsetWidth = newWidth - width;
      const offsetHeight = newHeight - height;
      const oldRatio = width / naturalWidth;

      if (isFunction(options.zoom)) {
        addListener(element, EVENT_ZOOM, options.zoom, {
          once: true
        });
      }

      if (dispatchEvent(element, EVENT_ZOOM, {
        ratio,
        oldRatio,
        originalEvent: _originalEvent
      }) === false) {
        return this;
      }

      this.zooming = true;

      if (_originalEvent) {
        const offset = getOffset(this.viewer);
        const center = pointers && Object.keys(pointers).length ? getPointersCenter(pointers) : {
          pageX: _originalEvent.pageX,
          pageY: _originalEvent.pageY
        }; // Zoom from the triggering point of the event

        imageData.left -= offsetWidth * ((center.pageX - offset.left - left) / width);
        imageData.top -= offsetHeight * ((center.pageY - offset.top - top) / height);
      } else {
        // Zoom from the center of the image
        imageData.left -= offsetWidth / 2;
        imageData.top -= offsetHeight / 2;
      }

      imageData.width = newWidth;
      imageData.height = newHeight;
      imageData.ratio = ratio;
      this.renderImage(() => {
        this.zooming = false;

        if (isFunction(options.zoomed)) {
          addListener(element, EVENT_ZOOMED, options.zoomed, {
            once: true
          });
        }

        dispatchEvent(element, EVENT_ZOOMED, {
          ratio,
          oldRatio,
          originalEvent: _originalEvent
        }, {
          cancelable: false
        });
      });

      if (hasTooltip) {
        this.tooltip();
      }
    }

    return this;
  },

  /**
   * Rotate the image with a relative degree.
   * @param {number} degree - The rotate degree.
   * @returns {Viewer} this
   */
  rotate(degree) {
    this.rotateTo((this.imageData.rotate || 0) + Number(degree));
    return this;
  },

  /**
   * Rotate the image to an absolute degree.
   * @param {number} degree - The rotate degree.
   * @returns {Viewer} this
   */
  rotateTo(degree) {
    const {
      imageData
    } = this;
    degree = Number(degree);

    if (isNumber(degree) && this.viewed && !this.played && this.options.rotatable) {
      imageData.rotate = degree;
      this.renderImage();
    }

    return this;
  },

  /**
   * Scale the image on the x-axis.
   * @param {number} scaleX - The scale ratio on the x-axis.
   * @returns {Viewer} this
   */
  scaleX(scaleX) {
    this.scale(scaleX, this.imageData.scaleY);
    return this;
  },

  /**
   * Scale the image on the y-axis.
   * @param {number} scaleY - The scale ratio on the y-axis.
   * @returns {Viewer} this
   */
  scaleY(scaleY) {
    this.scale(this.imageData.scaleX, scaleY);
    return this;
  },

  /**
   * Scale the image.
   * @param {number} scaleX - The scale ratio on the x-axis.
   * @param {number} [scaleY=scaleX] - The scale ratio on the y-axis.
   * @returns {Viewer} this
   */
  scale(scaleX, scaleY = scaleX) {
    const {
      imageData
    } = this;
    scaleX = Number(scaleX);
    scaleY = Number(scaleY);

    if (this.viewed && !this.played && this.options.scalable) {
      let changed = false;

      if (isNumber(scaleX)) {
        imageData.scaleX = scaleX;
        changed = true;
      }

      if (isNumber(scaleY)) {
        imageData.scaleY = scaleY;
        changed = true;
      }

      if (changed) {
        this.renderImage();
      }
    }

    return this;
  },

  /**
   * Play the images
   * @param {boolean} [fullscreen=false] - Indicate if request fullscreen or not.
   * @returns {Viewer} this
   */
  play(fullscreen = false) {
    if (!this.isShown || this.played) {
      return this;
    }

    const {
      element,
      options
    } = this;

    if (isFunction(options.play)) {
      addListener(element, EVENT_PLAY, options.play, {
        once: true
      });
    }

    if (dispatchEvent(element, EVENT_PLAY) === false) {
      return this;
    }

    const {
      player
    } = this;
    const onLoad = this.loadImage.bind(this);
    const list = [];
    let total = 0;
    let index = 0;
    this.played = true;
    this.onLoadWhenPlay = onLoad;

    if (fullscreen) {
      this.requestFullscreen();
    }

    addClass(player, CLASS_SHOW);
    forEach(this.items, (item, i) => {
      const img = item.querySelector('img');
      const image = document.createElement('img');
      image.src = getData(img, 'originalUrl');
      image.alt = img.getAttribute('alt');
      image.referrerPolicy = img.referrerPolicy;
      total += 1;
      addClass(image, CLASS_FADE);
      toggleClass(image, CLASS_TRANSITION, options.transition);

      if (hasClass(item, CLASS_ACTIVE)) {
        addClass(image, CLASS_IN);
        index = i;
      }

      list.push(image);
      addListener(image, EVENT_LOAD, onLoad, {
        once: true
      });
      player.appendChild(image);
    });

    if (isNumber(options.interval) && options.interval > 0) {
      const play = () => {
        this.playing = setTimeout(() => {
          removeClass(list[index], CLASS_IN);
          index += 1;
          index = index < total ? index : 0;
          addClass(list[index], CLASS_IN);
          play();
        }, options.interval);
      };

      if (total > 1) {
        play();
      }
    }

    return this;
  },

  // Stop play
  stop() {
    if (!this.played) {
      return this;
    }

    const {
      element,
      options
    } = this;

    if (isFunction(options.stop)) {
      addListener(element, EVENT_STOP, options.stop, {
        once: true
      });
    }

    if (dispatchEvent(element, EVENT_STOP) === false) {
      return this;
    }

    const {
      player
    } = this;
    this.played = false;
    clearTimeout(this.playing);
    forEach(player.getElementsByTagName('img'), image => {
      removeListener(image, EVENT_LOAD, this.onLoadWhenPlay);
    });
    removeClass(player, CLASS_SHOW);
    player.innerHTML = '';
    this.exitFullscreen();
    return this;
  },

  // Enter modal mode (only available in inline mode)
  full() {
    const {
      options,
      viewer,
      image,
      list
    } = this;

    if (!this.isShown || this.played || this.fulled || !options.inline) {
      return this;
    }

    this.fulled = true;
    this.open();
    addClass(this.button, CLASS_FULLSCREEN_EXIT);

    if (options.transition) {
      removeClass(list, CLASS_TRANSITION);

      if (this.viewed) {
        removeClass(image, CLASS_TRANSITION);
      }
    }

    addClass(viewer, CLASS_FIXED);
    viewer.setAttribute('style', '');
    setStyle(viewer, {
      zIndex: options.zIndex
    });
    this.initContainer();
    this.viewerData = assign({}, this.containerData);
    this.renderList();

    if (this.viewed) {
      this.initImage(() => {
        this.renderImage(() => {
          if (options.transition) {
            setTimeout(() => {
              addClass(image, CLASS_TRANSITION);
              addClass(list, CLASS_TRANSITION);
            }, 0);
          }
        });
      });
    }

    return this;
  },

  // Exit modal mode (only available in inline mode)
  exit() {
    const {
      options,
      viewer,
      image,
      list
    } = this;

    if (!this.isShown || this.played || !this.fulled || !options.inline) {
      return this;
    }

    this.fulled = false;
    this.close();
    removeClass(this.button, CLASS_FULLSCREEN_EXIT);

    if (options.transition) {
      removeClass(list, CLASS_TRANSITION);

      if (this.viewed) {
        removeClass(image, CLASS_TRANSITION);
      }
    }

    removeClass(viewer, CLASS_FIXED);
    setStyle(viewer, {
      zIndex: options.zIndexInline
    });
    this.viewerData = assign({}, this.parentData);
    this.renderViewer();
    this.renderList();

    if (this.viewed) {
      this.initImage(() => {
        this.renderImage(() => {
          if (options.transition) {
            setTimeout(() => {
              addClass(image, CLASS_TRANSITION);
              addClass(list, CLASS_TRANSITION);
            }, 0);
          }
        });
      });
    }

    return this;
  },

  // Show the current ratio of the image with percentage
  tooltip() {
    const {
      options,
      tooltipBox,
      imageData
    } = this;

    if (!this.viewed || this.played || !options.tooltip) {
      return this;
    }

    tooltipBox.textContent = `${Math.round(imageData.ratio * 100)}%`;

    if (!this.tooltipping) {
      if (options.transition) {
        if (this.fading) {
          dispatchEvent(tooltipBox, EVENT_TRANSITION_END);
        }

        addClass(tooltipBox, CLASS_SHOW);
        addClass(tooltipBox, CLASS_FADE);
        addClass(tooltipBox, CLASS_TRANSITION); // Force reflow to enable CSS3 transition

        tooltipBox.initialOffsetWidth = tooltipBox.offsetWidth;
        addClass(tooltipBox, CLASS_IN);
      } else {
        addClass(tooltipBox, CLASS_SHOW);
      }
    } else {
      clearTimeout(this.tooltipping);
    }

    this.tooltipping = setTimeout(() => {
      if (options.transition) {
        addListener(tooltipBox, EVENT_TRANSITION_END, () => {
          removeClass(tooltipBox, CLASS_SHOW);
          removeClass(tooltipBox, CLASS_FADE);
          removeClass(tooltipBox, CLASS_TRANSITION);
          this.fading = false;
        }, {
          once: true
        });
        removeClass(tooltipBox, CLASS_IN);
        this.fading = true;
      } else {
        removeClass(tooltipBox, CLASS_SHOW);
      }

      this.tooltipping = false;
    }, 1000);
    return this;
  },

  // Toggle the image size between its natural size and initial size
  toggle() {
    if (this.imageData.ratio === 1) {
      this.zoomTo(this.initialImageData.ratio, true);
    } else {
      this.zoomTo(1, true);
    }

    return this;
  },

  // Reset the image to its initial state
  reset() {
    if (this.viewed && !this.played) {
      this.imageData = assign({}, this.initialImageData);
      this.renderImage();
    }

    return this;
  },

  // Update viewer when images changed
  update() {
    const {
      element,
      options,
      isImg
    } = this; // Destroy viewer if the target image was deleted

    if (isImg && !element.parentNode) {
      return this.destroy();
    }

    const images = [];
    forEach(isImg ? [element] : element.querySelectorAll('img'), image => {
      if (isFunction(options.filter)) {
        if (options.filter.call(this, image)) {
          images.push(image);
        }
      } else if (this.getImageURL(image)) {
        images.push(image);
      }
    });

    if (!images.length) {
      return this;
    }

    this.images = images;
    this.length = images.length;

    if (this.ready) {
      const changedIndexes = [];
      forEach(this.items, (item, i) => {
        const img = item.querySelector('img');
        const image = images[i];

        if (image && img) {
          if (image.src !== img.src // Title changed (#408)
          || image.alt !== img.alt) {
            changedIndexes.push(i);
          }
        } else {
          changedIndexes.push(i);
        }
      });
      setStyle(this.list, {
        width: 'auto'
      });
      this.initList();

      if (this.isShown) {
        if (this.length) {
          if (this.viewed) {
            const changedIndex = changedIndexes.indexOf(this.index);

            if (changedIndex >= 0) {
              this.viewed = false;
              this.view(Math.max(Math.min(this.index - changedIndex, this.length - 1), 0));
            } else {
              // Reactivate the current viewing item after reset the list.
              addClass(this.items[this.index], CLASS_ACTIVE);
            }
          }
        } else {
          this.image = null;
          this.viewed = false;
          this.index = 0;
          this.imageData = {};
          this.canvas.innerHTML = '';
          this.title.innerHTML = '';
        }
      }
    } else {
      this.build();
    }

    return this;
  },

  // Destroy the viewer
  destroy() {
    const {
      element,
      options
    } = this;

    if (!element[NAMESPACE]) {
      return this;
    }

    this.destroyed = true;

    if (this.ready) {
      if (this.played) {
        this.stop();
      }

      if (options.inline) {
        if (this.fulled) {
          this.exit();
        }

        this.unbind();
      } else if (this.isShown) {
        if (this.viewing) {
          if (this.imageRendering) {
            this.imageRendering.abort();
          } else if (this.imageInitializing) {
            this.imageInitializing.abort();
          }
        }

        if (this.hiding) {
          if (this.transitioning) {
            this.transitioning.abort();
          }
        }

        this.hidden();
      } else if (this.showing) {
        if (this.transitioning) {
          this.transitioning.abort();
        }

        this.hidden();
      }

      this.ready = false;
      this.viewer.parentNode.removeChild(this.viewer);
    } else if (options.inline) {
      if (this.delaying) {
        this.delaying.abort();
      } else if (this.initializing) {
        this.initializing.abort();
      }
    }

    if (!options.inline) {
      removeListener(element, EVENT_CLICK, this.onStart);
    }

    element[NAMESPACE] = undefined;
    return this;
  }

};

var others = {
  getImageURL(image) {
    let {
      url
    } = this.options;

    if (isString(url)) {
      url = image.getAttribute(url);
    } else if (isFunction(url)) {
      url = url.call(this, image);
    } else {
      url = '';
    }

    return url;
  },

  open() {
    const {
      body
    } = this;
    addClass(body, CLASS_OPEN);

    if (body && body.style) {
      body.style.paddingRight = `${this.scrollbarWidth + (parseFloat(this.initialBodyComputedPaddingRight) || 0)}px`;
    }
  },

  close() {
    const {
      body
    } = this;
    removeClass(body, CLASS_OPEN);

    if (body && body.style) {
      body.style.paddingRight = this.initialBodyPaddingRight;
    }
  },

  shown() {
    const {
      element,
      options
    } = this;
    this.fulled = true;
    this.isShown = true;
    this.render();
    this.bind();
    this.showing = false;

    if (isFunction(options.shown)) {
      addListener(element, EVENT_SHOWN, options.shown, {
        once: true
      });
    }

    if (dispatchEvent(element, EVENT_SHOWN) === false) {
      return;
    }

    if (this.ready && this.isShown && !this.hiding) {
      this.view(this.index);
    }
  },

  hidden() {
    const {
      element,
      options
    } = this;
    this.fulled = false;
    this.viewed = false;
    this.isShown = false;
    this.close();
    this.unbind();
    addClass(this.viewer, CLASS_HIDE);
    this.resetList();
    this.resetImage();
    this.hiding = false;

    if (!this.destroyed) {
      if (isFunction(options.hidden)) {
        addListener(element, EVENT_HIDDEN, options.hidden, {
          once: true
        });
      }

      dispatchEvent(element, EVENT_HIDDEN, null, {
        cancelable: false
      });
    }
  },

  requestFullscreen() {
    const document = this.element.ownerDocument;

    if (this.fulled && !(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement)) {
      const {
        documentElement
      } = document; // Element.requestFullscreen()

      if (documentElement.requestFullscreen) {
        documentElement.requestFullscreen();
      } else if (documentElement.webkitRequestFullscreen) {
        documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      } else if (documentElement.mozRequestFullScreen) {
        documentElement.mozRequestFullScreen();
      } else if (documentElement.msRequestFullscreen) {
        documentElement.msRequestFullscreen();
      }
    }
  },

  exitFullscreen() {
    const document = this.element.ownerDocument;

    if (this.fulled && (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement)) {
      // Document.exitFullscreen()
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  },

  change(event) {
    const {
      options,
      pointers
    } = this;
    const pointer = pointers[Object.keys(pointers)[0]];
    const offsetX = pointer.endX - pointer.startX;
    const offsetY = pointer.endY - pointer.startY;

    switch (this.action) {
      // Move the current image
      case ACTION_MOVE:
        this.move(offsetX, offsetY);
        break;
      // Zoom the current image

      case ACTION_ZOOM:
        this.zoom(getMaxZoomRatio(pointers), false, event);
        break;

      case ACTION_SWITCH:
        {
          this.action = 'switched';
          const absoluteOffsetX = Math.abs(offsetX);

          if (absoluteOffsetX > 1 && absoluteOffsetX > Math.abs(offsetY)) {
            // Empty `pointers` as `touchend` event will not be fired after swiped in iOS browsers.
            this.pointers = {};

            if (offsetX > 1) {
              this.prev(options.loop);
            } else if (offsetX < -1) {
              this.next(options.loop);
            }
          }

          break;
        }
    } // Override


    forEach(pointers, p => {
      p.startX = p.endX;
      p.startY = p.endY;
    });
  },

  isSwitchable() {
    const {
      imageData,
      viewerData
    } = this;
    return this.length > 1 && imageData.left >= 0 && imageData.top >= 0 && imageData.width <= viewerData.width && imageData.height <= viewerData.height;
  }

};

const AnotherViewer = WINDOW.Viewer;

class Viewer {
  /**
   * Create a new Viewer.
   * @param {Element} element - The target element for viewing.
   * @param {Object} [options={}] - The configuration options.
   */
  constructor(element, options = {}) {
    if (!element || element.nodeType !== 1) {
      throw new Error('The first argument is required and must be an element.');
    }

    this.element = element;
    this.options = assign({}, DEFAULTS, isPlainObject(options) && options);
    this.action = false;
    this.fading = false;
    this.fulled = false;
    this.hiding = false;
    this.imageClicked = false;
    this.imageData = {};
    this.index = this.options.initialViewIndex;
    this.isImg = false;
    this.isShown = false;
    this.length = 0;
    this.played = false;
    this.playing = false;
    this.pointers = {};
    this.ready = false;
    this.showing = false;
    this.timeout = false;
    this.tooltipping = false;
    this.viewed = false;
    this.viewing = false;
    this.wheeling = false;
    this.zooming = false;
    this.init();
  }

  init() {
    const {
      element,
      options
    } = this;

    if (element[NAMESPACE]) {
      return;
    }

    element[NAMESPACE] = this;
    const isImg = element.tagName.toLowerCase() === 'img';
    const images = [];
    forEach(isImg ? [element] : element.querySelectorAll('img'), image => {
      if (isFunction(options.filter)) {
        if (options.filter.call(this, image)) {
          images.push(image);
        }
      } else if (this.getImageURL(image)) {
        images.push(image);
      }
    });
    this.isImg = isImg;
    this.length = images.length;
    this.images = images;
    this.initBody(); // Override `transition` option if it is not supported

    if (isUndefined(document.createElement(NAMESPACE).style.transition)) {
      options.transition = false;
    }

    if (options.inline) {
      let count = 0;

      const progress = () => {
        count += 1;

        if (count === this.length) {
          let timeout;
          this.initializing = false;
          this.delaying = {
            abort: () => {
              clearTimeout(timeout);
            }
          }; // build asynchronously to keep `this.viewer` is accessible in `ready` event handler.

          timeout = setTimeout(() => {
            this.delaying = false;
            this.build();
          }, 0);
        }
      };

      this.initializing = {
        abort: () => {
          forEach(images, image => {
            if (!image.complete) {
              removeListener(image, EVENT_LOAD, progress);
            }
          });
        }
      };
      forEach(images, image => {
        if (image.complete) {
          progress();
        } else {
          addListener(image, EVENT_LOAD, progress, {
            once: true
          });
        }
      });
    } else {
      addListener(element, EVENT_CLICK, this.onStart = ({
        target
      }) => {
        if (target.tagName.toLowerCase() === 'img' && (!isFunction(options.filter) || options.filter.call(this, target))) {
          this.view(this.images.indexOf(target));
        }
      });
    }
  }

  build() {
    if (this.ready) {
      return;
    }

    const {
      element,
      options
    } = this;
    const parent = element.parentNode;
    const template = document.createElement('div');
    template.innerHTML = TEMPLATE;
    const viewer = template.querySelector(`.${NAMESPACE}-container`);
    const title = viewer.querySelector(`.${NAMESPACE}-title`);
    const toolbar = viewer.querySelector(`.${NAMESPACE}-toolbar`);
    const navbar = viewer.querySelector(`.${NAMESPACE}-navbar`);
    const button = viewer.querySelector(`.${NAMESPACE}-button`);
    const canvas = viewer.querySelector(`.${NAMESPACE}-canvas`);
    const preview = viewer.querySelector(`.${NAMESPACE}-preview`);
    this.parent = parent;
    this.viewer = viewer;
    this.title = title;
    this.toolbar = toolbar;
    this.navbar = navbar;
    this.button = button;
    this.canvas = canvas;
    this.footer = viewer.querySelector(`.${NAMESPACE}-footer`);
    this.tooltipBox = viewer.querySelector(`.${NAMESPACE}-tooltip`);
    this.player = viewer.querySelector(`.${NAMESPACE}-player`);
    this.list = viewer.querySelector(`.${NAMESPACE}-list`);
    addClass(title, !options.title ? CLASS_HIDE : getResponsiveClass(Array.isArray(options.title) ? options.title[0] : options.title));
    addClass(navbar, !options.navbar ? CLASS_HIDE : getResponsiveClass(options.navbar));
    toggleClass(button, CLASS_HIDE, !options.button);

    if (options.backdrop) {
      addClass(viewer, `${NAMESPACE}-backdrop`);

      if (!options.inline && options.backdrop !== 'static') {
        setData(canvas, DATA_ACTION, 'hide');
      }
    }

    if (isString(options.className) && options.className) {
      // In case there are multiple class names
      options.className.split(REGEXP_SPACES).forEach(className => {
        addClass(viewer, className);
      });
    }

    if (options.toolbar) {
      const list = document.createElement('ul');
      const custom = isPlainObject(options.toolbar);
      const zoomButtons = BUTTONS.slice(0, 3);
      const rotateButtons = BUTTONS.slice(7, 9);
      const scaleButtons = BUTTONS.slice(9);

      if (!custom) {
        addClass(toolbar, getResponsiveClass(options.toolbar));
      }

      forEach(custom ? options.toolbar : BUTTONS, (value, index) => {
        const deep = custom && isPlainObject(value);
        const name = custom ? hyphenate(index) : value;
        const show = deep && !isUndefined(value.show) ? value.show : value;

        if (!show || !options.zoomable && zoomButtons.indexOf(name) !== -1 || !options.rotatable && rotateButtons.indexOf(name) !== -1 || !options.scalable && scaleButtons.indexOf(name) !== -1) {
          return;
        }

        const size = deep && !isUndefined(value.size) ? value.size : value;
        const click = deep && !isUndefined(value.click) ? value.click : value;
        const item = document.createElement('li');
        item.setAttribute('role', 'button');
        addClass(item, `${NAMESPACE}-${name}`);

        if (!isFunction(click)) {
          setData(item, DATA_ACTION, name);
        }

        if (isNumber(show)) {
          addClass(item, getResponsiveClass(show));
        }

        if (['small', 'large'].indexOf(size) !== -1) {
          addClass(item, `${NAMESPACE}-${size}`);
        } else if (name === 'play') {
          addClass(item, `${NAMESPACE}-large`);
        }

        if (isFunction(click)) {
          addListener(item, EVENT_CLICK, click);
        }

        list.appendChild(item);
      });
      toolbar.appendChild(list);
    } else {
      addClass(toolbar, CLASS_HIDE);
    }

    if (!options.rotatable) {
      const rotates = toolbar.querySelectorAll('li[class*="rotate"]');
      addClass(rotates, CLASS_INVISIBLE);
      forEach(rotates, rotate => {
        toolbar.appendChild(rotate);
      });
    }

    if (options.inline) {
      addClass(button, CLASS_FULLSCREEN);
      setStyle(viewer, {
        zIndex: options.zIndexInline
      });

      if (window.getComputedStyle(parent).position === 'static') {
        setStyle(parent, {
          position: 'relative'
        });
      }

      parent.insertBefore(viewer, element.nextSibling);
    } else {
      if (!options.hideClose) {
        addClass(button, CLASS_CLOSE);
      } else {
        preview.innerHTML = null;

        if (this.images.length > 1) {
          this.images.forEach((img, i) => {
            if (img) {
              img.removeAttribute("style");
              let div = document.createElement("div");

              if (this.index == i) {
                div.className = "previewItem active";
              } else {
                div.className = "previewItem";
              }

              div.setAttribute("index", i);
              div.appendChild(img);
              preview.appendChild(div);
            }
          });
        } else {
          preview.parentElement.remove();
        }

        button.remove();
      }

      addClass(viewer, CLASS_FIXED);
      addClass(viewer, CLASS_FADE);
      addClass(viewer, CLASS_HIDE);
      setStyle(viewer, {
        zIndex: options.zIndex
      });
      let {
        container
      } = options;

      if (isString(container)) {
        container = element.ownerDocument.querySelector(container);
      }

      if (!container) {
        container = this.body || document.body;
      }

      container.appendChild(viewer);
    }

    if (options.inline) {
      this.render();
      this.bind();
      this.isShown = true;
    }

    this.ready = true;

    if (isFunction(options.ready)) {
      addListener(element, EVENT_READY, options.ready, {
        once: true
      });
    }

    if (dispatchEvent(element, EVENT_READY) === false) {
      this.ready = false;
      return;
    }

    if (this.ready && options.inline) {
      this.view(this.index);
    }
  }
  /**
   * Get the no conflict viewer class.
   * @returns {Viewer} The viewer class.
   */


  static noConflict() {
    window.Viewer = AnotherViewer;
    return Viewer;
  }
  /**
   * Change the default options.
   * @param {Object} options - The new default options.
   */


  static setDefaults(options) {
    assign(DEFAULTS, isPlainObject(options) && options);
  }

}

assign(Viewer.prototype, render, events, handlers, methods, others);

export { Viewer as default };
