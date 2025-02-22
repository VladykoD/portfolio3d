import { createEvent, createStore, forward } from 'effector';

const setLoadComplete = createEvent<boolean>();
const $loadComplete = createStore<boolean>(false);

forward({
  from: setLoadComplete,
  to: $loadComplete,
});

export { setLoadComplete, $loadComplete };
