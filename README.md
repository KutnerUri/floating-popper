# floating-tooltip-react

`BasePopper` is a headless, batteries-included primitive for building tooltips, dropdowns, menus, and any floating surface in React. It wraps the excellent [`@floating-ui/react`](https://floating-ui.com/) toolkit with pragmatic defaults so you can focus on styling and copy instead of wiring up interactions.

## Why it helps

- Handles hover, click, outside-clicks, escape, and enterable hover behavior out of the box.
- Allows easy override with fully controlled mode, so you can integrate it with local state and other conditions.
- Includes transition helpers and Floating UI portals to keep positioning correct even outside the root tree.
- Leaves rendering fully customizable via `pop`, `popProps`, `popContainerProps`, and slot overrides.
- Minimal - no CSS, icons, or assumptions about your design system.

## Installation

```bash
npm install floating-tooltip-react @floating-ui/react
```

## Quick start

Wrap any element you want with `<FloatingPopper>`. The `pop` prop renders the floating surface. Combine triggers (hover, click, click-away) to match your UX, and style everything with your own CSS or design tokens.

```tsx
import FloatingPopper from "floating-tooltip-react";

export function SomeComponent() {
  return (
    <FloatingPopper triggerOnHover pop="Hello, World!">
      <span>Hover over me</span>
    </FloatingPopper>
  );
}
```

### Applying styles

Create a local wrapper and style however you like:

```tsx
import FloatingPopper from "floating-tooltip-react";
import { BasePopperProps } from "floating-tooltip-react";

const slots = {
  Pop: TooltipCard,
};

export function Popper(props: BasePopperProps) {
  const isInModal = useIsInModal();

  return (
    <FloatingPopper
      {...props}
      slots={slots}
      popperClass={isInModal ? "priorityZIndex" : "regularZIndex"}
    />
  );
}
```

### Controlled menu example

```tsx
import BasePopper from "floating-tooltip-react";

export function UserMenu() {
  const [open, setOpen] = React.useState(false);

  // Auto-close the menu after 5 seconds
  useEffect(() => {
    if (!open) return;
    const tid = useTimeout(() => setOpen(false), 5000);
    return () => clearTimeout(tid);
  }, [open]);

  return (
    <BasePopper
      open={open}
      onOpen={setOpen}
      pop={
        <div className="menu">
          <button type="button">Profile</button>
          <button type="button">Log out</button>
        </div>
      }
    >
      <button type="button" className="avatar">
        Open menu
      </button>
    </BasePopper>
  );
}
```

When `open` is supplied the component becomes fully controlled. You can still use `onOpen` to react to user interactions.

### Triggers

The Floating Tooltip component implements many of the FloatingUI's interactions out of the box:

- `triggerOnHover`: open/close on hover (mouseEnter/mouseLeave), automatically turns off the the click triggers.
  - `hoverDelay`: delay in ms before opening on hover (default `200`).
  - `enterable`: allow moving the pointer between the anchor and the popper, keeping the popper open when the mouse enters it (polygon-safe).
  - `referenceEsc`: close when clicking on the reference element
- `triggerOnClick`: toggle open/close on click of the reference element.
- `triggerOnClickAway`: close when clicking outside the reference or popper.
- `triggerOnPopper`: toggle open/close on click of the popper itself.
- `triggerOnEsc`: close when pressing Escape.
- `disable`: Turn off all triggers

On each trigger the `onOpen` callback is called with the next open state.
Additionally, `onPopperClick`, `onClickOutside`, and `onReferenceEsc` are called on those specific events.

### Positioning and appearance

- `placement`: Desired placement (`"top"`, `"bottom-start"`, etc.).
- `offset`: Distance in pixels between the reference element and the popper (defaults to `6`).
- `viewportPadding`: Minimum distance from viewport edges.
- `autoPlacement`: sets the automatic positioning strategy.
  - `false` - No automatic repositioning - the popper will be placed according to `placement` even if it overflows the viewport.
  - `"flip"` - change `placement` to the opposite side (main axis) when there is not enough space. Will try to push away from the edges of the viewport on the secondary axis.
- `autoUpdate`: Continuously keep positioning up to date when the reference moves (useful when portaled).
- `transitionMs` and `transitionStyles`: Customize enter/exit transitions powered by `useTransitionStyles`.

## Peer dependencies

Make sure `@floating-ui/react` is installed in your project.
Should work with React 17, 18, and 19.

## Contributing

Issues and pull requests are welcome!
