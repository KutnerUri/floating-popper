/// <reference types="@testing-library/jest-dom/vitest" />

import React from "react";
import {
  cleanup,
  fireEvent,
  render,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { BasePopper } from "../src/basePopper.tsx";

afterEach(() => {
  cleanup();
});

describe("BasePopper manual control", () => {
  it("notifies parent about open state changes when controlled", async () => {
    const onOpen = vi.fn();

    function Harness() {
      const [open, setOpen] = React.useState(false);

      const handleOpenChange = React.useCallback(
        (next: boolean) => {
          onOpen(next);
          setOpen(next);
        },
        [onOpen]
      );

      return (
        <>
          <BasePopper
            open={open}
            onOpen={handleOpenChange}
            pop="Popover content"
            transitionMs={1}
          >
            <button type="button">Toggle</button>
          </BasePopper>
          <div>Outside</div>
        </>
      );
    }

    const { getByText } = render(<Harness />);
    const anchor = getByText("Toggle");
    const outside = getByText("Outside");

    fireEvent.click(anchor);
    const popper = await waitFor(() => getByText("Popover content"));

    expect(popper).toBeInTheDocument();
    expect(onOpen).toHaveBeenLastCalledWith(true);

    fireEvent.pointerDown(outside);
    fireEvent.click(outside);
    await waitForElementToBeRemoved(() => getByText("Popover content"));

    expect(onOpen).toHaveBeenLastCalledWith(false);
    expect(onOpen).toHaveBeenCalledTimes(2);
  });

  it("closes when parent toggles open to false manually", async () => {
    function Harness() {
      const [open, setOpen] = React.useState(true);

      return (
        <>
          <BasePopper
            open={open}
            onOpen={setOpen}
            pop="Popover content"
            transitionMs={1}
          >
            <button type="button">Toggle</button>
          </BasePopper>

          <button type="button" onClick={() => setOpen(false)}>
            Close manually
          </button>
        </>
      );
    }

    const { getByText } = render(<Harness />);

    const popper = await waitFor(() => getByText("Popover content"));
    expect(popper).toBeInTheDocument();

    fireEvent.click(getByText("Close manually"));
    await waitForElementToBeRemoved(() => getByText("Popover content"));
  });
});
