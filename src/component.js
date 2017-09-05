import { object } from 'pwet/src/attribute';
import Attribute from 'pwet/src/attribute';
import { decorate } from 'pwet/src/utilities';
import StatefulComponent from 'pwet/src/decorators/stateful';
import { assert, isArray, isString, isDeeplyEqual } from 'pwet/src/assertions';
import IDOMComponent from "pwet-idom";
import { renderImage, renderElement, renderSpan, renderStyle, text } from 'idom-util';
import style from './index.css';

const internal = {};

internal.defaults = {
  pipeline: false,
  auto: true
};

internal.unsetListeners = image => image.onerror = image.onabort = image.onload = null;

internal.ImageLoader = (component, { actions: { initializeQueue, setQueueStatus } }) => {

  const _loadImage = (src, index = 0) => {

    const { state, element } = component;
    const { loaded, failed, queue } = state;

    setQueueStatus('loading');
    // component.editState({
    //   status: 'loading',
    // });

    index++;

    const _makeEventHandler = (state, returnValue) => event => {

      internal.unsetListeners(image);

      const { onComplete, pipeline  } = element.properties;

      if (returnValue) {

        element.dispatchEvent(new CustomEvent('loaded', { detail: { component, image, event }}));
        loaded.push(image);

      } else {

        element.dispatchEvent(new CustomEvent('failed', { detail: { component, image, event }}));
        failed.push(image);
      }

      component.render();

      element.dispatchEvent(new CustomEvent('progress', { detail: {
        component,
        progress: Math.floor((100 / queue.length) * (loaded.length + failed.length)),
      }}));
      // onProgress(component, event);
      // method(component, src, state, event);

      if (loaded.length + failed.length === queue.length) {
        setQueueStatus('loaded');
        // component.editState({
        //   status: 'loaded'
        // });

        element.dispatchEvent(new CustomEvent('complete', { detail: {
          component,
          event
        }}));
      }

      if (pipeline && index < queue.length - 1)
        _loadImage(queue[index + 1]);

    };

    const image = new Image();

    image.onerror = image.onabort = _makeEventHandler(state, null);

    image.onload = _makeEventHandler(state, image);

    image.src = src;
  };

  const _slots = {};

  let _spinner;

  const attach = attach => {

    attach(true);

    _slots.spinner = component.element.shadowRoot.querySelector(`slot[name='spinner']`);
    _slots.spinner.addEventListener('slotchange', (event) => {

      const { properties } = element;
      const { duration, container } = properties;

      _spinner = _slots.spinner.assignedNodes()[0];

      if (component.factory.logLevel > 0)
        console.log('_spinner slotchange', _spinner);

      component.render();

    });
  };

  const initialize = (newProperties, initialize) => {

    const { properties } = component.element;

    if (newProperties.src.length > 0 && newProperties.src !== properties.src) {

      const { state, element } = component;

      const { pipeline  } = element.properties;

      if (state.status === 'loading')
        return;

      if (isString(newProperties.src))
        newProperties.src = [newProperties.src];

      assert(isArray(newProperties.src) && newProperties.src.every(isString), `'images' must be an array of string`);

      initializeQueue(newProperties.src);
      // component.editState({
      //   queue: newProperties.src,
      //   loaded: [],
      //   failed: []
      // });

      if (pipeline)
        _loadImage(newProperties.src[0]);

      newProperties.src.forEach(_loadImage);
    }

    initialize(
      !component.isRendered || !isDeeplyEqual(properties, newProperties)
    );

  };

  const update = (newState) => {

    const { state } = component;

    return newState;
  };

  const render = () => {

    const { status, loaded } = component.state;

    // console.error('ImageLoader.render()', state);

    renderStyle(internal.ImageLoader.style);

    _slots.spinner = renderElement('slot', null, ['name', 'spinner'], () => {
      renderSpan(() => text('loading...'))
    });

    let [spinner] = _slots.spinner.assignedNodes();

    if (!spinner)
      spinner = _slots.spinner.assignedNodes({ flatten: true })[0];

    spinner.style.display = (status !== 'loading' || loaded.length > 0)
      ? 'none'
      : 'initial';

    loaded.forEach((image, i) => {
      loaded[i] = renderImage(image.src, i, null, 'class', 'fade')
    });
  };

  return {
    attach,
    update,
    initialize,
    render
  };
};

internal.ImageLoader.properties = {
  src: Attribute.array(),
  pipeline: false
};

internal.ImageLoader.decorators = [
  StatefulComponent,
  IDOMComponent
];

internal.ImageLoader.shadow = { mode: 'open' };

internal.ImageLoader.initialState = {
  status: 'pending',
  loaded: []
};

internal.ImageLoader.style = style;

internal.ImageLoader.tagName = 'x-image-loader';

export default internal.ImageLoader;
