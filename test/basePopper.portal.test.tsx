/// <reference types="@testing-library/jest-dom/vitest" />

import React from "react";
import {
  cleanup,
  fireEvent,
  render,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { BasePopper } from "../src/basePopper.tsx";

function renderPortalPopper(
  props: Partial<React.ComponentProps<typeof BasePopper>> = {}
) {
  return render(
    <>
      <BasePopper
        pop="Popover content"
        transitionMs={1}
        usePortal="portal-container"
        {...props}
      >
        <button type="button">Click me</button>
      </BasePopper>

      <div>Outsides element</div>

      <div id="portal-container" data-testid="portal-container">
        <div>portal container</div>
      </div>
    </>
  );
}

afterEach(() => {
  cleanup();
});

describe("BasePopper portal behavior", () => {
  it("attaches to a custom portal id when provided", async () => {
    const { getByText, getByTestId } = renderPortalPopper();
    const anchor = getByText("Click me");
    const portalRoot = getByTestId("portal-container");

    fireEvent.click(anchor);

    const popper = await waitFor(() => getByText("Popover content"));

    expect(portalRoot).toContainElement(popper);
  });

  it("still responds to outside clicks while rendered in a portal", async () => {
    const { getByText } = renderPortalPopper();
    const anchor = getByText("Click me");
    const outside = getByText("Outsides element");

    fireEvent.click(anchor);
    await waitFor(() => getByText("Popover content"));

    fireEvent.pointerDown(outside);
    fireEvent.click(outside);
    await waitForElementToBeRemoved(() => getByText("Popover content"));
  });
});
