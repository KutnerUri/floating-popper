# floating-tooltip-react

Headless, ergonomic popper primitive for React (tooltips, popovers, menus) built on top of `@floating-ui/react`.

`BasePopper` wires up positioning and interactions for you, while leaving rendering and styling completely in your hands.

## Features

- Hover, click, click-away, Escape, and reference re-click behaviors
- Controlled and uncontrolled modes with a simple `onOpen(boolean)` callback
- Enterable hover with polygon-safe close and configurable `hoverDelay`
- Smooth transitions via `useTransitionStyles`; optional portal support
- Fully customizable: provide your own `pop` node, classes, styles, and wrapper via `slots.Pop`
- No CSS or design assumptions—drop into any design system

## Installation

```bash
npm install floating-tooltip-react @floating-ui/react
```

## Quick Start

As simple as passing children and a `pop` prop. Add triggers as necessary.

```tsx
import React from "react";
import BasePopper from "floating-tooltip-react";

function App() {
  return (
    <BasePopper triggerOnHover pop="Hello, World!">
      <span>Hover over me</span>
    </BasePopper>
  );
}
```

## DOM structure

For ref handling, the popper renders its own div. Beyond that, it’s as minimal as possible.

```tsx
<BasePopper
  className="my-popper"
  popClass="my-pop"
  pop={<div className="pop-component">Pop content</div>}
>
  <button type="button" className="reference">
    Reference element
  </button>
</BasePopper>

{/* -- becomes --> */}

<div class="my-popper">
  <button type="button" class="reference">
    Reference element
  </button>

  <div
    /* positioned container (Floating UI styles applied inline) */
    style="position: absolute; top: 100px; left: 200px; transform: translate3d(0px, 6px, 0px);"
  >
    <div class="my-pop" /* your pop wrapper via slots.Pop */>
      <div class="pop-component">Pop content</div> {/* your pop node */}
    </div>
  </div>
</div>
```
## API Reference

Rendering

| Prop                | Type                                   | Default | Description                                                                                 |
| ------------------- | -------------------------------------- | ------- | ------------------------------------------------------------------------------------------- |
| `pop`               | `Element`                      | —       | Floating content to render. Required.                                                       |
| `popProps`          | `div props` | —       | Props for the pop element (e.g., `className`, `role`).                                      |
| `popContainerProps` | `div props` | —       | Props for the positioned container. Inline styles from Floating UI are merged with `style`. |
| `slots.Pop`         | `Component`                    | `"div"` | Override the default pop wrapper element.                                                   |

State & Control

| Prop      | Type                      | Default               | Description                                                 |
| --------- | ------------------------- | --------------------- | ----------------------------------------------------------- |
| `open`    | `boolean`                 | `false` | Explicit open state. When set, component is controlled.     |
| `onOpen`  | `(open: boolean) => void` | —                     | Called when internal triggers request an open state change. |
| `disable` | `boolean`                 | `false`               | Disable all triggers.                                       |

Triggers

| Prop                 | Type      | Default           | Description                                                   |
| -------------------- | --------- | ----------------- | ------------------------------------------------------------- |
| `triggerOnHover`     | `boolean` | `false`           | Open/close on hover; disables click triggers by default.      |
| `enterable`          | `boolean` | `true`            | Keep open while hovering the popper; uses polygon-safe close. |
| `hoverDelay`         | `number`  | `300`             | Delay before changing open on hover (ms).                     |
| `referenceEsc`       | `boolean` | `false`           | Close when clicking the reference while open. (when click is disabled) |
| `triggerOnClick`     | `boolean` | `!triggerOnHover` | Toggle on reference click.                                    |
| `triggerOnClickAway` | `boolean` | `!triggerOnHover` | Close on outside click.                                       |
| `triggerOnPopper`    | `boolean` | `false`           | Close when clicking the popper itself.                        |
| `triggerOnEsc`       | `boolean` | `!triggerOnHover` | Close on Escape.                                              |

Positioning & Transitions

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `placement` | `Placement` | — | Desired placement (e.g., "top", "bottom-start"). |
| `offset` | `number` | `6` | Gap between reference and popper. |
| `viewportPadding` | `Padding` | `4` | Minimal distance from viewport edges. |
| `autoPlacement` | `'flip' or false` | `"flip"` | Automatic placement strategy. |
| `autoUpdate` | `boolean` | `false` | Continuously update position (useful with portals or moving targets). |
| `usePortal` | `boolean or string` | `false` | Render in a Floating UI portal; pass an `id` string to target a specific node. |
| `transitionMs` | `number` | `210` | Enter/exit duration in ms. |
| `transitionStyles` | `UseTransitionStylesProps` | — | Override `useTransitionStyles` configuration. |

Events

| Prop | Type | Description |
| --- | --- | --- |
| `onPopperClick` | `(event: React.MouseEvent) => void` | Fired when the pop surface is clicked. |
| `onClickOutside` | `(event: Event or undefined) => void` | Fired on outside click (if that trigger is enabled). |
| `onReferenceEsc` | `(event: Event or undefined) => void` | Fired when closing by clicking the reference (while open). |

## Contributing

Issues and PRs are welcome!
