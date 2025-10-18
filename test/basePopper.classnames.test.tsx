/// <reference types="@testing-library/jest-dom/vitest" />

import React from "react";
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { BasePopper } from "../src/basePopper.tsx";

afterEach(() => {
  cleanup();
});

describe.only("BasePopper className forwarding", () => {
  it("applies BasePopper.className to the reference wrapper only", async () => {
    const { getByText } = render(
      <BasePopper pop="Popover content" transitionMs={1} className="ref-class">
        <button type="button">Click me</button>
      </BasePopper>
    );

    const anchor = getByText("Click me");
    const referenceWrapper = anchor.parentElement as HTMLElement;
    expect(referenceWrapper).toHaveClass("ref-class");
  });

  it("composes popProps.className with popClass on the pop surface", async () => {
    const { getByText } = render(
      <BasePopper
        pop="Popover content"
        popClass="pop-class"
        transitionMs={1}
        popProps={{ className: "pop-prop-class" }}
      >
        <button type="button">Click me</button>
      </BasePopper>
    );

    const anchor = getByText("Click me");
    fireEvent.click(anchor);
    const popper = await waitFor(() => getByText("Popover content"));

    expect(popper).toHaveClass("pop-class");
    expect(popper).toHaveClass("pop-prop-class");
  });

  it("applies popContainerProps.className to the floating container element", async () => {
    const { getByText } = render(
      <BasePopper
        pop="Popover content"
        transitionMs={1}
        popContainerProps={{ className: "container-class" }}
      >
        <button type="button">Click me</button>
      </BasePopper>
    );

    const anchor = getByText("Click me");
    fireEvent.click(anchor);
    const popper = await waitFor(() => getByText("Popover content"));

    const container = popper.parentElement as HTMLElement; // outer div wrapping Pop
    expect(container).toHaveClass("container-class");
  });

  it("composes arrowProps.className with arrowClass on the arrow element", async () => {
    const { getByText, container } = render(
      <BasePopper
        pop="Popover content"
        transitionMs={1}
        withArrow
        arrowClass="arrow-class"
        arrowProps={{ className: "arrow-prop-class" }}
      >
        <button type="button">Click me</button>
      </BasePopper>
    );

    const anchor = getByText("Click me");
    fireEvent.click(anchor);
    await waitFor(() => getByText("Popover content"));

    // Find the arrow SVG inside the document
    const arrow = container.querySelector("svg");
    expect(arrow).not.toBeNull();
    expect(arrow).toHaveClass("arrow-class");
    expect(arrow).toHaveClass("arrow-prop-class");
  });
});
