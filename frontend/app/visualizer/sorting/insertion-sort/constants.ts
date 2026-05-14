export const ITEM_COUNT = 20;

export const MIN_SPEED = 30;
export const MAX_SPEED = 500;
export const DEFAULT_SPEED = 140;

export const MAX_BAR_HEIGHT = 220;
export const MIN_BAR_HEIGHT = 8;
export const BAR_VALUE_MIN = 8;
export const BAR_VALUE_MAX = 92;

export const makeRandomValues = (): number[] =>
  Array.from(
    { length: ITEM_COUNT },
    () => BAR_VALUE_MIN + Math.floor(Math.random() * (BAR_VALUE_MAX - BAR_VALUE_MIN))
  );