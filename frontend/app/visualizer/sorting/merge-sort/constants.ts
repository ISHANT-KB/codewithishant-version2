export const ITEM_COUNT = 18;

export const MIN_SPEED = 30;
export const MAX_SPEED = 500;
export const DEFAULT_SPEED = 160;

export const MAX_BAR_HEIGHT = 220;
export const MIN_BAR_HEIGHT = 8;
export const BAR_VALUE_MIN = 10;
export const BAR_VALUE_MAX = 85;  // 10 + 75

export const makeRandomValues = (): number[] =>
  Array.from(
    { length: ITEM_COUNT },
    () => BAR_VALUE_MIN + Math.floor(Math.random() * (BAR_VALUE_MAX - BAR_VALUE_MIN))
  );