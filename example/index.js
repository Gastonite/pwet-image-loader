
import 'pwet/src/polyfills';
import "pwet/src/polyfills/shadow-dom";

import Component from 'pwet/src/component';
import ThrottlingComponentDecorator from 'pwet/src/decorators/throttling';
import ImageLoader from '../src/component';
import { patch } from 'incremental-dom';
import SpinnerImageUrl from 'url-loader!./spinner.gif?mimetype=image/gif';

ImageLoader.maxWait = 1000;

Component.define(Object.assign(ImageLoader, {
  logLevel: 1,
  decorators: [
    ...ImageLoader.decorators,
    ThrottlingComponentDecorator(ImageLoader)
  ],
  dependencies: {
    actions: {
      initializeQueue(component, queue) {

        component.state = Object.assign(component.state, {
          queue,
          loaded: [],
          failed: []
        });
      },
      setQueueStatus(component, status) {

        component.state = Object.assign(component.state, {
          status,
        });
      }
    }
  }
}));

const container = document.getElementById('container');
const imageLoader = document.createElement('x-image-loader');
const spinnerImage = document.createElement('img');

spinnerImage.setAttribute('src', SpinnerImageUrl);
spinnerImage.setAttribute('slot', 'spinner');

imageLoader.appendChild(spinnerImage);

container.appendChild(imageLoader);

imageLoader.src = new Array(42)
  .fill(void 0)
  .map((el, i) => `https://unsplash.it/600?image=${1084 - i}&${+new Date()}`);

imageLoader.addEventListener('progress', ({ detail: { component }}) => {
  const { loaded, failed, queue, progress } = component.state;

  console.log('onProgress', `${loaded.length + failed.length} / ${queue.length} (${progress})`);
});

imageLoader.addEventListener('loaded', ({ detail: { component, image, event }}) => {
  const { loaded, failed } = component.state;

  console.error('onLoaded', `${loaded.length + failed.length}`, image);
});

imageLoader.addEventListener('failed', ({ detail: { component, image, event }}) => {
  const { loaded, failed } = component.state;

  console.error('onFailed', `${loaded.length + failed.length}`, event);
});

imageLoader.addEventListener('complete', ({ detail: { component, image, event }}) => {
  const { loaded, failed, queue } = component.state;

  console.error('onComplete',
    `\n\tloaded: ${loaded.length}/${queue.length}`,
    `\n\tfailed: ${failed.length}/${queue.length}`
  );
});