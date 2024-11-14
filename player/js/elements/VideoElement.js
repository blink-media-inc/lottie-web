import {
  extendPrototype,
} from '../utils/functionExtensions';

import BaseElement from './BaseElement';
import TransformElement from './helpers/TransformElement';
import SVGBaseElement from './svgElements/SVGBaseElement';
import HierarchyElement from './helpers/HierarchyElement';
import FrameElement from './helpers/FrameElement';
import RenderableDOMElement from './helpers/RenderableDOMElement';

function IVideoElement(data, globalData, comp) {
  this.assetData = globalData.getAssetData(data.refId);

  if (this.assetData && this.assetData.sid) {
    this.assetData = globalData.slotManager.getProp(this.assetData);
  }

  this.initElement(data, globalData, comp);
  this.sourceRect = {
    top: 0,
    left: 0,
    width: this.assetData.w,
    height: this.assetData.h,
  };
}

extendPrototype([BaseElement, TransformElement, SVGBaseElement, HierarchyElement, FrameElement, RenderableDOMElement], IVideoElement);

IVideoElement.prototype.createContent = function () {
  var assetPath = this.globalData.getAssetsPath(this.assetData);

  this.layerElement.innerHTML = '<foreignObject x="0" y="0" width="' + this.assetData.w + '" height="' + this.assetData.h + '"><video xmlns="http://www.w3.org/1999/xhtml" width="' + this.assetData.w + '" height="' + this.assetData.h + '" loop="true" muted="true" src="' + assetPath + '"></video></foreignObject>';
  this.videoElement = this.layerElement.children[0].children[0];
  this.videoElement._videoDuration = -1;
  this.animationItem = null;
  var comp = this.comp;
  while (!comp.animationItem && comp.comp) {
    comp = comp.comp;
  }
  this.animationItem = comp.animationItem;
  var self = this;
  this.animationItemPauseListener = function () {
    if (!self.videoElement.paused) {
      self.videoElement.pause();
    }
  };
  this.animationItemPlayListener = function () {
    if (self.videoElement.paused) {
      self.videoElement.play();
    }
  };
  this.animationItem.addEventListener('_pause', this.animationItemPauseListener);
  this.animationItem.addEventListener('_play', this.animationItemPlayListener);
  this.videoElement.onloadedmetadata = function () {
    this._videoDuration = this.duration;
    if (!self.animationItem.isPaused) {
      this.play();
    }
  };
};

IVideoElement.prototype.show = function () {
  RenderableDOMElement.prototype.show.call(this);
  this._videoStartFrame = this.globalData.frameNum;
};

IVideoElement.prototype.prepareFrame = function (num) {
  RenderableDOMElement.prototype.prepareFrame.call(this, num);
  if (this.animationItem.isPaused && this.videoElement._videoDuration > -1) {
    this.videoElement.currentTime = ((this.globalData.frameNum - this._videoStartFrame) / this.globalData.frameRate);
  }
};

IVideoElement.prototype.renderFrame = function () {
  RenderableDOMElement.prototype.renderFrame.call(this);
};

IVideoElement.prototype.sourceRectAtTime = function () {
  return this.sourceRect;
};

IVideoElement.prototype.destroy = function () {
  RenderableDOMElement.prototype.destroy.call(this);
  if (this.animationItem) {
    this.animationItem.removeEventListener(this.animationItemPauseListener);
    this.animationItem.removeEventListener(this.animationItemPlayListener);
  }
};

export default IVideoElement;
