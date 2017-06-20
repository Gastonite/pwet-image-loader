
import 'pwet/src/polyfills';
import Component from 'pwet/src/component';
import ImageLoader from '../src/component';
import { renderImage, renderStrong } from 'idom-util';
import SpinnerImageUrl from 'url-loader!./spinner.gif?mimetype=image/gif';

ImageLoader.maxWait = 1000;

Component.define(ImageLoader);

const container = document.getElementById('container');
const imageLoader = document.createElement('x-image-loader');

imageLoader.renderSpinner = (component, src) => {
  renderImage(SpinnerImageUrl)
};

container.appendChild(imageLoader);

console.log('===============================');

const src = new Array(42)
  .fill(void 0)
  .map((el, i) => `https://unsplash.it/600?image=${1084 - i}&${+new Date()}`);

imageLoader.pwet.initialize({
  src,
  onProgress(component, src, { index, queue, progress }) {
    console.log(`${index} / ${queue.length} (${progress})`);
  },
  renderImage(component, src) {
    renderImage(src, null, null, 'class', 'fade')
  }
});
