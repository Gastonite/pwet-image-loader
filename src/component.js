import { object } from 'pwet/src/attribute';
import Attribute from 'pwet/src/attribute';
import { noop } from 'pwet/src/utilities';
import Throttle from 'lodash.throttle';
import StatefulComponent from 'pwet/src/decorators/stateful';
import { assert, isArray, isString, isDeeplyEqual } from 'pwet/src/assertions';

const internal = {};

internal.defaults = {
  pipeline: false,
  auto: true
};

internal.unsetListeners = image => image.onerror = image.onabort = image.onload = null;

internal.ImageLoader = (component) => {

  const _loadImage = (src, index = 0) => {

    const { state, properties } = component;
    const { status, loaded, failed, queue } = state;
    const { onComplete, onProgress, pipeline, onError, onLoad  } = properties;

    component.editState({
      status: 'loading',
    });

    index++;

    const _makeEventHandler = (state, returnValue) => event => {

      internal.unsetListeners(image);

      const method = !returnValue ? onError : onLoad;
      const array = !returnValue ? failed : loaded;

      array.push(image);

      component.editState({
        loaded,
        progress: Math.floor((100 / queue.length) * (loaded.length + failed.length)),
        status: 'loading'
      });

      onProgress(component, src, state, event);
      method(component, src, state, event);

      if (loaded.length + failed.length === queue.length) {

        component.editState({
          status: 'loaded'
        });

        onComplete(component, loaded, failed);
      }

      if (pipeline && index < queue.length - 1)
        _loadImage(queue[index + 1]);

    };

    const image = new Image();

    image.onerror = image.onabort = _makeEventHandler(state, null);

    image.onload = _makeEventHandler(state, image);

    image.src = src;

  };

  const attach = attach => {

    attach(!component.isRendered);
  };

  const initialize = (newProperties, initialize) => {

    const { properties } = component.properties;

    if (newProperties.src.length > 0 && newProperties.src !== properties.src) {

      const { state, properties  } = component;
      const { pipeline  } = properties;

      if (state.status === 'loading')
        return;

      if (isString(newProperties.src))
        newProperties.src = [newProperties.src];

      assert(isArray(newProperties.src) && newProperties.src.every(isString), `'images' must be an array of string`);

      component.editState({
        queue: newProperties.src,
        loaded: [],
        failed: []
      });

      if (pipeline)
        _loadImage(newProperties.src[0]);

      newProperties.src.forEach(_loadImage);
    }

    initialize(
      !component.isRendered || !isDeeplyEqual(properties, newProperties)
    );

  };

  const update = (newState, update) => {

    const { state } = component;

    update(true);
  };

  const render = () => {
    const { state, properties } = component;
    const { status, loaded } = state;
    const { renderImages, renderSpinner } = properties;

    if (status === 'pending' || (status === 'loading' && loaded.length < 1))
      return void renderSpinner(component);

    renderImages(component, loaded);
  };

  return {
    attach,
    update,
    initialize,
    render: Throttle(render, internal.ImageLoader.maxWait)
  };
};

internal.ImageLoader.create = StatefulComponent;

internal.ImageLoader.properties = {
  src: Attribute.array(),
  pipeline: false,
  onLoad: noop,
  onError: noop,
  onComplete(component, loaded, failed) {
    console.log(`default onComplete() loaded:${loaded.length} failed:${failed.length}`);
  },
  onProgress: noop,
  renderImages: ({ element }, images) => images.map(image => element.appendChild(image)),
  renderSpinner: ({ element }) => element.innerText = 'loading...'
};

internal.ImageLoader.initialState = {
  status: 'pending',
  loaded: []
};

internal.ImageLoader.maxWait = 250;

internal.ImageLoader.tagName = 'x-image-loader';

export default internal.ImageLoader;
