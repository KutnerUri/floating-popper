/// <reference types="@testing-library/jest-dom/vitest" />

import {
  cleanup,
  fireEvent,
  render,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { BasePopper, type BasePopperProps } from "../src/basePopper.tsx";

function renderClickPopper(props: Partial<BasePopperProps> = {}) {
  return render(
    <>
      <BasePopper pop="Popover content" transitionMs={1} {...props}>
        <button type="button">Click me</button>
      </BasePopper>

      <div>Outside element</div>
    </>
  );
}

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("BasePopper click triggers", () => {
  it("opens and closes when clicking the reference", async () => {
    const onOpen = vi.fn();
    const { getByText } = renderClickPopper({ onOpen });
    const anchor = getByText("Click me");

    fireEvent.click(anchor);
    const popper = await waitFor(() => getByText("Popover content"));

    expect(popper).toBeInTheDocument();
    expect(onOpen).toHaveBeenCalledWith(true);

    fireEvent.click(anchor);
    await waitForElementToBeRemoved(() => getByText("Popover content"));

    expect(onOpen).toHaveBeenLastCalledWith(false);
    expect(onOpen).toHaveBeenCalledTimes(2);
  });

  it("does not open when component is disabled", () => {
    const onOpen = vi.fn();
    const { getByText, queryByText } = renderClickPopper({
      disable: true,
      onOpen,
    });
    const anchor = getByText("Click me");

    fireEvent.click(anchor);

    expect(queryByText("Popover content")).toBeNull();
    expect(onOpen).not.toHaveBeenCalled();
  });

  it("closes when clicking outside and invokes onClickOutside", async () => {
    const onOpen = vi.fn();
    const onClickOutside = vi.fn();
    const { getByText } = renderClickPopper({ onOpen, onClickOutside });
    const anchor = getByText("Click me");
    const outside = getByText("Outside element");

    fireEvent.click(anchor);
    await waitFor(() => getByText("Popover content"));

    fireEvent.pointerDown(outside); // apparently it's the trigger
    fireEvent.click(outside);
    await waitForElementToBeRemoved(() => getByText("Popover content"));

    expect(onClickOutside).toHaveBeenCalledTimes(1);
    expect(onOpen).toHaveBeenLastCalledWith(false);
  });

  it("keeps the popper open when triggerOnClickAway is disabled", async () => {
    const onOpen = vi.fn();
    const onClickOutside = vi.fn();
    const { getByText } = renderClickPopper({
      triggerOnClickAway: false,
      onOpen,
      onClickOutside,
    });
    const anchor = getByText("Click me");
    const outside = getByText("Outside element");

    fireEvent.click(anchor);
    await waitFor(() => getByText("Popover content"));
    expect(onOpen).toHaveBeenLastCalledWith(true);

    fireEvent.pointerDown(outside);
    fireEvent.click(outside);

    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(onClickOutside).not.toHaveBeenCalled();
    expect(getByText("Popover content")).toBeInTheDocument();
  });

  it("closes when clicking the popper surface if triggerOnPopper is enabled", async () => {
    const onOpen = vi.fn();
    const onPopperClick = vi.fn();
    const { getByText } = renderClickPopper({
      triggerOnPopper: true,
      onPopperClick,
      onOpen,
    });
    const anchor = getByText("Click me");

    fireEvent.click(anchor);
    const popper = await waitFor(() => getByText("Popover content"));

    fireEvent.click(popper);
    await waitForElementToBeRemoved(() => getByText("Popover content"));

    expect(onPopperClick).toHaveBeenCalledTimes(1);
    expect(onOpen).toHaveBeenCalledTimes(2);
    expect(onOpen).toHaveBeenLastCalledWith(false);
  });

  it("does not close when clicking the popper if triggerOnPopper is disabled", async () => {
    const onPopperClick = vi.fn();
    const { getByText } = renderClickPopper({ onPopperClick });
    const anchor = getByText("Click me");

    fireEvent.click(anchor);
    const popper = await waitFor(() => getByText("Popover content"));

    fireEvent.click(popper);

    await waitFor(() => expect(onPopperClick).toHaveBeenCalledTimes(1));
    expect(getByText("Popover content")).toBeInTheDocument();
  });

  it("closes when pressing Escape", async () => {
    const onOpen = vi.fn();
    const { getByText } = renderClickPopper({ onOpen });
    const anchor = getByText("Click me");

    fireEvent.click(anchor);
    await waitFor(() => getByText("Popover content"));

    fireEvent.keyDown(document, { key: "Escape", code: "Escape" });
    await waitForElementToBeRemoved(() => getByText("Popover content"));

    expect(onOpen).toHaveBeenLastCalledWith(false);
  });

  it("ignores Escape key when triggerOnEsc is disabled", async () => {
    const onOpen = vi.fn();
    const { getByText } = renderClickPopper({ triggerOnEsc: false, onOpen });
    const anchor = getByText("Click me");

    fireEvent.click(anchor);
    await waitFor(() => getByText("Popover content"));
    expect(onOpen).toHaveBeenLastCalledWith(true);

    fireEvent.keyDown(document, { key: "Escape", code: "Escape" });

    await waitFor(() => expect(onOpen).toHaveBeenCalledTimes(1));
    expect(getByText("Popover content")).toBeInTheDocument();
  });
});
