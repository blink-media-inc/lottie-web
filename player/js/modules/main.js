import { setLocationHref, setWebWorker } from '../main';
import animationManager from '../animation/AnimationManager';
import {
  setDefaultCurveSegments,
  getDefaultCurveSegments,
  roundValues,
  setIdPrefix,
  setSubframeEnabled,
  setExpressionsPlugin,
} from '../utils/common';
import PropertyFactory from '../utils/PropertyFactory';
import ShapePropertyFactory from '../utils/shapes/ShapeProperty';
import Matrix from '../3rd_party/transformation-matrix';

const lottie = {};
var standalone = '__[STANDALONE]__';
var animationData = '__[ANIMATIONDATA]__';
var renderer = '';

/* IFTRUE_INCLUDE_ADVANCED */
function setLocation(href) {
  setLocationHref(href);
}

function searchAnimations() {
  if (standalone === true) {
    animationManager.searchAnimations(animationData, standalone, renderer);
  } else {
    animationManager.searchAnimations();
  }
}
/* FITRUE_INCLUDE_ADVANCED */

function setSubframeRendering(flag) {
  setSubframeEnabled(flag);
}

function setPrefix(prefix) {
  setIdPrefix(prefix);
}

function loadAnimation(params) {
  if (standalone === true) {
    params.animationData = JSON.parse(animationData);
  }
  return animationManager.loadAnimation(params);
}

function setQuality(value) {
  if (typeof value === 'string') {
    switch (value) {
      case 'high':
        setDefaultCurveSegments(200);
        break;
      default:
      case 'medium':
        setDefaultCurveSegments(50);
        break;
      case 'low':
        setDefaultCurveSegments(10);
        break;
    }
  } else if (!isNaN(value) && value > 1) {
    setDefaultCurveSegments(value);
  }
  if (getDefaultCurveSegments() >= 50) {
    roundValues(false);
  } else {
    roundValues(true);
  }
}

function inBrowser() {
  return typeof navigator !== 'undefined';
}

function installPlugin(type, plugin) {
  if (type === 'expressions') {
    setExpressionsPlugin(plugin);
  }
}

function getFactory(name) {
  switch (name) {
    case 'propertyFactory':
      return PropertyFactory;
    case 'shapePropertyFactory':
      return ShapePropertyFactory;
    case 'matrix':
      return Matrix;
    default:
      return null;
  }
}

/* IFTRUE_INCLUDE_ADVANCED */
lottie.play = animationManager.play;
lottie.pause = animationManager.pause;
lottie.setLocationHref = setLocation;
lottie.togglePause = animationManager.togglePause;
lottie.setSpeed = animationManager.setSpeed;
lottie.setDirection = animationManager.setDirection;
lottie.stop = animationManager.stop;
lottie.searchAnimations = searchAnimations;
lottie.registerAnimation = animationManager.registerAnimation;
/* FITRUE_INCLUDE_ADVANCED */
lottie.loadAnimation = loadAnimation;
lottie.setSubframeRendering = setSubframeRendering;
/* IFTRUE_INCLUDE_ADVANCED */
lottie.resize = animationManager.resize;
// lottie.start = start;
lottie.goToAndStop = animationManager.goToAndStop;
/* FITRUE_INCLUDE_ADVANCED */
lottie.destroy = animationManager.destroy;
lottie.setQuality = setQuality;
lottie.inBrowser = inBrowser;
lottie.installPlugin = installPlugin;
lottie.freeze = animationManager.freeze;
lottie.unfreeze = animationManager.unfreeze;
/* IFTRUE_INCLUDE_AUDIO */
lottie.setVolume = animationManager.setVolume;
lottie.mute = animationManager.mute;
lottie.unmute = animationManager.unmute;
/* FITRUE_INCLUDE_AUDIO */
/* IFTRUE_INCLUDE_ADVANCED */
lottie.getRegisteredAnimations = animationManager.getRegisteredAnimations;
/* FITRUE_INCLUDE_ADVANCED */
lottie.useWebWorker = setWebWorker;
lottie.setIDPrefix = setPrefix;
lottie.__getFactory = getFactory;
lottie.version = '[[BM_VERSION]]';

/* IFTRUE_INCLUDE_ADVANCED */
function checkReady() {
  if (document.readyState === 'complete') {
    clearInterval(readyStateCheckInterval);
    searchAnimations();
  }
}
/* FITRUE_INCLUDE_ADVANCED */

function getQueryVariable(variable) {
  var vars = queryString.split('&');
  for (var i = 0; i < vars.length; i += 1) {
    var pair = vars[i].split('=');
    if (decodeURIComponent(pair[0]) == variable) { // eslint-disable-line eqeqeq
      return decodeURIComponent(pair[1]);
    }
  }
  return null;
}
var queryString = '';
if (standalone) {
  var scripts = document.getElementsByTagName('script');
  var index = scripts.length - 1;
  var myScript = scripts[index] || {
    src: '',
  };
  queryString = myScript.src ? myScript.src.replace(/^[^\?]+\??/, '') : ''; // eslint-disable-line no-useless-escape
  renderer = getQueryVariable('renderer');
}
/* IFTRUE_INCLUDE_ADVANCED */
var readyStateCheckInterval = setInterval(checkReady, 100);
/* FITRUE_INCLUDE_ADVANCED */

// this adds bodymovin to the window object for backwards compatibility
try {
  if (!(typeof exports === 'object' && typeof module !== 'undefined')
    && !(typeof define === 'function' && define.amd) // eslint-disable-line no-undef
  ) {
    window.bodymovin = lottie;
  }
} catch (err) {
  //
}
export default lottie;
