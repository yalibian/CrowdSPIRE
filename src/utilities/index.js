/**
 * Created by Yali on 2/27/17.
 */

import rectOverlap from './rectOverlap';
import cosineSimilarity from './cosineSimilarity';
import softSimilarity from './softSimilarity';
import Model from './model';
import * as d3 from "d3";

// Moving an SVG selection to the front/back
// Thanks to d3-extended (github.com/wbkd/d3-extended)
d3.selection.prototype.moveToFront = function () {
  return this.each(function () {
    this.parentNode.appendChild(this);
  });
};

d3.selection.prototype.moveToBack = function () {
  return this.each(function () {
    let firstChild = this.parentNode.firstChild;
    if (firstChild) {
      this.parentNode.insertBefore(this, firstChild);
    }
  });
};

export {rectOverlap, d3, Model, cosineSimilarity, softSimilarity};
