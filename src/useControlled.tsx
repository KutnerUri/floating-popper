import React from "react";

type useControlledOptions<T, F> = {
  value?: T;
  defaultValue?: T;
  onChange?: F;
};

/**
 * extend state from prop with local state.
 * uses local state when value is undefined, update both local state and prop state on changes
 */
export function useControlled<T, F extends (val: T, ...payload: any[]) => any>({
  value,
  defaultValue,
  onChange,
}: useControlledOptions<T, F>): [T | undefined, F | undefined, boolean] {
  const [uncontrolledValue, setUncontrolledValue] =
    React.useState(defaultValue);

  const handleUncontrolledChange = (val: T, ...payload: any[]) => {
    setUncontrolledValue(val);
    return onChange?.(val, ...payload);
  };

  if (value !== void 0) {
    return [value, handleUncontrolledChange as F, true];
  }

  return [uncontrolledValue, handleUncontrolledChange as F, false];
}
