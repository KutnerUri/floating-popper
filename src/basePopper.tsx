import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset as offsetMiddleware,
  OpenChangeReason,
  Padding,
  Placement,
  safePolygon,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useHover,
  useInteractions,
  useRole,
  useTransitionStyles,
  UseTransitionStylesProps,
  arrow as arrowMiddleware,
  FloatingArrow,
} from "@floating-ui/react";
import type { FloatingArrowProps } from "@floating-ui/react";
import React, { MouseEvent } from "react";

import { useControlled } from "./useControlled";

export type { Placement };
export type Triggers = {
  /** disable all triggers */
  disable?: boolean;

  /** open while hovering over children */
  triggerOnHover?: boolean;
  /** keep the popper open while hovering over it */
  enterable?: boolean;
  /** wait before changing the `open` state, in milliseconds */
  hoverDelay?: number;

  /** open/close when clicking on children */
  triggerOnClick?: boolean;
  /** close when clicking outside */
  triggerOnClickAway?: boolean;
  /** close when clicking on the popper */
  triggerOnPopper?: boolean;
  /** close when pressing Escape */
  triggerOnEsc?: boolean;
  /** close when clicking the reference element */
  referenceEsc?: boolean;
};

type PopProps = React.HTMLAttributes<HTMLDivElement> &
  React.RefAttributes<HTMLDivElement> & {};

type ArrowProps = React.DetailedHTMLProps<
  React.HTMLAttributes<Element>,
  Element
> &
  Pick<
    FloatingArrowProps,
    | "context"
    | "ref"
    | "width"
    | "height"
    | "tipRadius"
    | "staticOffset"
    | "d"
    | "stroke"
    | "strokeWidth"
  >;

export interface BasePopperProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Triggers {
  /** content rendered inside the floating surface */
  pop: React.ReactNode;
  /** Props forwarded to the floating surface component */
  popProps?: React.HTMLAttributes<HTMLDivElement>;
  /** Props applied to the floating container element */
  popContainerProps?: React.HTMLAttributes<HTMLDivElement>;
  /** convenience className applied to the popper element */
  popClass?: string;
  /** Slot overrides for internal components */
  slots?: {
    Pop?: React.ComponentType<PopProps>;
    Arrow?: React.ComponentType<ArrowProps>;
  };

  // arrow:

  /** whether to show the arrow */
  withArrow?: boolean;
  /** padding for the arrow middleware (distance from edges/corners) */
  arrowPadding?: number | Padding;
  /** convenience className applied to the arrow element */
  arrowClass?: string;
  /** Props forwarded to the arrow element */
  arrowProps?: Omit<ArrowProps, "ref" | "context">;

  // manual control:

  /** Explicitly set open/closed state for the popper */
  open?: boolean;
  /** Fired whenever internal triggers request a change to the open state */
  onOpen?: (open: boolean) => void;
  /** offset popper from the children */
  offset?: number;
  /** minimal distance from the edge of the screen */
  viewportPadding?: Padding;
  /** Desired placement relative to the reference element */
  placement?: Placement;
  /** Auto placement strategy; set to "flip" to allow flipping */
  autoPlacement?: false | "flip";
  /** Continuously update position. (Useful when the target moves, and when using portal) */
  autoUpdate?: boolean;
  /** Render the popper inside a portal or a specified container */
  usePortal?: boolean | string;
  /** time to fade in/out in milliseconds */
  transitionMs?: number;

  // reactions:

  /** Called when the popper surface is clicked */
  onPopperClick?: (event: MouseEvent<Element>) => void;
  /** Called when the user interacts outside of the popper */
  onClickOutside?: (event: Event | undefined) => void;
  /** called when closing when clicking on the reference element (on hover) */
  onReferenceEsc?: (event: Event | undefined) => void;

  /** Overrides for the transition animation returned by `useTransitionStyles` */
  transitionStyles?: UseTransitionStylesProps;
}

/** Generic and Agnostic Popper */
export function BasePopper(props: BasePopperProps) {
  const {
    pop,
    popProps,
    popContainerProps,
    popClass,
    open: propsOpen,
    onOpen,
    disable,
    slots: {
      Pop = "div",
      Arrow = FloatingArrow as React.ComponentType<ArrowProps>,
    } = {},

    offset = 6,
    viewportPadding = 4,
    placement,
    autoPlacement = "flip",
    autoUpdate: propsAutoUpdate = false,
    usePortal,
    transitionMs = 210,
    transitionStyles: transitionProps,

    triggerOnHover = false,
    enterable = true,
    hoverDelay = 300,

    triggerOnClick = !triggerOnHover,
    triggerOnClickAway = !triggerOnHover,
    triggerOnPopper = false,
    triggerOnEsc = !triggerOnHover,
    referenceEsc = false,
    onPopperClick,
    onClickOutside,
    onReferenceEsc,

    withArrow,
    arrowPadding,
    arrowClass,
    arrowProps,

    ...rest
  } = props;

  // prevent popper from reopening when closing on reference click
  // could pass from props if needed
  const triggerOnHoverMove = !referenceEsc;

  const [open, setOpen] = useControlled({
    value: propsOpen,
    onChange: onOpen,
    defaultValue: false,
  });

  const handleOpenChange = React.useCallback(
    (open: boolean, event?: Event, reason?: OpenChangeReason) => {
      if (reason === "outside-press") onClickOutside?.(event);
      if (reason === "reference-press") onReferenceEsc?.(event);
      setOpen?.(open);
    },
    [onClickOutside, onReferenceEsc, setOpen]
  );

  const arrowRef = React.useRef<SVGSVGElement | null>(null);

  const { refs, floatingStyles, context } = useFloating({
    placement,
    open: open && disable !== true,
    onOpenChange: handleOpenChange,
    whileElementsMounted: propsAutoUpdate ? autoUpdate : undefined,
    middleware: [
      // offset pushes the popper away from the anchor
      offsetMiddleware(offset),
      // flip flips the popper to the other side
      // if there is not enough space (along main axis)
      autoPlacement === "flip" && flip(),
      // shift pushes the popper away from the edge of the screen (along secondary axis)
      autoPlacement === "flip" && shift({ padding: viewportPadding }),
      // arrow points from the popper to the reference (only when enabled)
      withArrow && arrowMiddleware({ element: arrowRef, padding: arrowPadding }),
    ],
  });

  const role = useRole(context, {
    enabled: !disable,
  });
  const hoverAction = useHover(context, {
    enabled: !disable && triggerOnHover,
    delay: enterable ? hoverDelay : 0, // quickFix for hovering over pop when enterable={false}
    handleClose: enterable ? safePolygon() : undefined,
    move: triggerOnHoverMove,
  });
  const clickAction = useClick(context, {
    enabled: !disable && !triggerOnHover && triggerOnClick,
  });
  const dismissAction = useDismiss(context, {
    outsidePress: !disable && !triggerOnHover && triggerOnClickAway,
    escapeKey: !disable && !triggerOnHover && triggerOnEsc,
    referencePress: !disable && referenceEsc && !triggerOnClick, // triggerOnClick already closes on click
  });

  const { isMounted, styles: transitionStyles } = useTransitionStyles(context, {
    duration: transitionMs,
    ...transitionProps,
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    role,
    hoverAction,
    clickAction,
    dismissAction,
  ]);

  const handlePopperClick = (e: MouseEvent<Element, globalThis.MouseEvent>) => {
    const res = onPopperClick?.(e);
    if (triggerOnPopper) setOpen?.(false);
    return res;
  };

  let actualPop = (
    <div
      ref={refs.setFloating}
      {...getFloatingProps(popContainerProps)}
      style={{
        ...popContainerProps?.style,
        ...floatingStyles,
      }}
    >
      <Pop
        {...popProps}
        className={[popProps?.className, popClass].filter(Boolean).join(" ")}
        onClick={handlePopperClick}
        style={{
          ...transitionStyles,
          ...popProps?.style,
        }}
      >
        {pop}
        {withArrow && (
          <Arrow
          tipRadius={1}
            {...arrowProps}
            context={context}
            ref={arrowRef}
            className={arrowClass}
          />
        )}
      </Pop>
    </div>
  );

  if (usePortal)
    actualPop = (
      <FloatingPortal
        id={typeof usePortal === "string" ? usePortal : undefined}
      >
        {actualPop}
      </FloatingPortal>
    );

  return (
    <>
      <div ref={refs.setReference} {...getReferenceProps({ ...rest })}>
        {props.children}
      </div>
      {isMounted && actualPop}
    </>
  );
}
