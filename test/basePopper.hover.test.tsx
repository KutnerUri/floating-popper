/// <reference types="@testing-library/jest-dom/vitest" />

import {
  act,
  cleanup,
  fireEvent,
  render,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BasePopper } from "../src/basePopper.tsx";

function renderHoverPopper(props = {}) {
  return render(
    <>
      <BasePopper
        triggerOnHover
        pop="Popover content"
        transitionMs={1}
        hoverDelay={1}
        {...props}
      >
        <button type="button">Hover me</button>
      </BasePopper>

      <div>Another element</div>
    </>
  );
}

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("BasePopper hover triggers", () => {
  it("opens after the configured hover delay", async () => {
    const onOpen = vi.fn();
    const { getByText } = renderHoverPopper({ onOpen });
    const anchor = getByText("Hover me");

    fireEvent.mouseMove(anchor);
    fireEvent.mouseEnter(anchor);

    const popper = await waitFor(() => getByText("Popover content"));

    expect(popper).toBeInTheDocument();
    expect(onOpen).toHaveBeenCalledWith(true);
    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it("does not o  pen when hover triggers are disabled", async () => {
    vi.useFakeTimers();
    const onOpen = vi.fn();
    const { getByText, queryByText } = renderHoverPopper({
      triggerOnHover: false,
      onOpen,
    });
    const anchor = getByText("Hover me");

    fireEvent.mouseMove(anchor);
    fireEvent.mouseEnter(anchor);
    await act(async () => await vi.advanceTimersByTimeAsync(10));

    const result = queryByText("Popover content");
    expect(result).toBeNull();
    expect(onOpen).not.toHaveBeenCalled();
  });

  it("ignores hover events when component is disabled", async () => {
    vi.useFakeTimers();
    const onOpen = vi.fn();
    const { getByText, queryByText } = renderHoverPopper({
      disable: true,
      onOpen,
    });
    const anchor = getByText("Hover me");

    fireEvent.mouseMove(anchor);
    fireEvent.mouseEnter(anchor);
    await act(async () => await vi.advanceTimersByTimeAsync(10));

    const result = queryByText("Popover content");
    expect(result).toBeNull();
    expect(onOpen).not.toHaveBeenCalled();
  });

  it("closes when the pointer leaves the anchor and popper is not enterable", async () => {
    const onOpen = vi.fn();
    const { getByText } = renderHoverPopper({ enterable: false, onOpen });
    const anchor = getByText("Hover me");

    fireEvent.mouseEnter(anchor);
    fireEvent.mouseMove(anchor);

    await waitFor(() => getByText("Popover content"));

    if (anchor.parentElement) fireEvent.mouseLeave(anchor.parentElement);

    await waitForElementToBeRemoved(() => getByText("Popover content"), {
      timeout: 10,
    });

    expect(onOpen).toHaveBeenNthCalledWith(1, true);
    expect(onOpen).toHaveBeenLastCalledWith(false);
  });

  it('keeps the popper open when moving to the popper if "enterable" is true', async () => {
    vi.useFakeTimers();
    const onOpen = vi.fn();
    const { getByText } = renderHoverPopper({ enterable: true, onOpen });
    const anchor = getByText("Hover me");

    fireEvent.mouseEnter(anchor);
    fireEvent.mouseMove(anchor);

    await act(() => vi.advanceTimersByTimeAsync(10));
    let popper = getByText("Popover content"); // sanity - did open

    if (anchor.parentElement) fireEvent.mouseLeave(anchor.parentElement);
    fireEvent.mouseMove(popper);
    fireEvent.mouseEnter(popper);

    await act(() => vi.advanceTimersByTimeAsync(10));

    // verify is still open
    expect(popper).toBeInTheDocument();
  });
});

describe("BasePopper referenceEsc trigger", () => {
  it("closes when the reference is clicked and referenceEsc is enabled", async () => {
    const onOpen = vi.fn();
    const onReferenceEsc = vi.fn();
    const { getByText } = renderHoverPopper({
      triggerOnHover: true,
      referenceEsc: true,
      onOpen,
      onReferenceEsc,
    });
    const anchor = getByText("Hover me");
    const root = anchor.parentElement;
    expect(root).not.toBeNull();
    fireEvent.mouseEnter(anchor.parentElement!);

    await waitFor(() => getByText("Popover content"));

    fireEvent.pointerDown(anchor);

    await waitForElementToBeRemoved(() => getByText("Popover content"));
    expect(onOpen).toBeCalledTimes(2);
    expect(onOpen).toHaveBeenLastCalledWith(false);
  });

  it("remains open when referenceEsc is disabled", async () => {
    const onOpen = vi.fn();
    const { getByText } = renderHoverPopper({
      triggerOnHover: true,
      referenceEsc: false,
      onOpen,
    });
    const anchor = getByText("Hover me");
    const root = anchor.parentElement;
    expect(root).not.toBeNull();
    fireEvent.mouseEnter(anchor.parentElement!);
    const popper = await waitFor(() => getByText("Popover content"));

    fireEvent.pointerDown(anchor);

    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(onOpen).toHaveBeenLastCalledWith(true);
    expect(popper).toBeInTheDocument();
  });
});
