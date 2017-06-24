
import 'pwet/src/polyfills';
import Component from 'pwet/src/component';
import ImageLoader from '../src/component';
import { renderImage } from 'idom-util';
import { patch } from 'incremental-dom';
import SpinnerImageUrl from 'url-loader!./spinner.gif?mimetype=image/gif';

ImageLoader.maxWait = 1000;

Component.define(ImageLoader);

const container = document.getElementById('container');
const imageLoader = document.createElement('x-image-loader');

imageLoader.renderSpinner = ({ element }, src) => patch(element, () => renderImage(SpinnerImageUrl));

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
  renderImages({ element }, images) {

    patch(element, () => {

      images.forEach((image, i) => {
        images[i] = renderImage(image.src, i, null, 'class', 'fade')
      });
    });
  }
});
