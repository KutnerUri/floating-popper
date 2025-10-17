import React from "react";
import BasePopper, { Placement } from "../src";

const slots = {
  // Arrow: "div",
} as const;
const popContainerProps = {
  className: "demo-pop-container",
} as const;
const arrowProps = {
  className: "demo-arrow",
  stroke: "var(--popper-arrow-stroke)",
  strokeWidth: 1,
  tipRadius: 1,
} as const;

type Toggle = boolean | undefined;

export function Example() {
  const [triggerOnHover, setTriggerOnHover] = React.useState<Toggle>(undefined);
  const [enterable, setEnterable] = React.useState(true);
  const [hoverDelay, setHoverDelay] = React.useState(300);

  const [triggerOnClick, setTriggerOnClick] = React.useState<Toggle>(undefined);
  const [triggerOnClickAway, setTriggerOnClickAway] =
    React.useState<Toggle>(undefined);
  const [triggerOnPopper, setTriggerOnPopper] =
    React.useState<Toggle>(undefined);
  const [triggerOnEsc, setTriggerOnEsc] = React.useState<Toggle>(undefined);
  const [referenceEsc, setReferenceEsc] = React.useState<Toggle>(undefined);

  const [disable, setDisable] = React.useState(false);

  const [placement, setPlacement] = React.useState<Placement>("right");
  const [offset, setOffset] = React.useState(8);
  const [viewportPadding, setViewportPadding] = React.useState(4);
  const [autoPlacement, setAutoPlacement] = React.useState<false | "flip">(
    "flip"
  );
  const [autoUpdate, setAutoUpdate] = React.useState(false);
  const [usePortal, setUsePortal] = React.useState(false);
  const [transitionMs, setTransitionMs] = React.useState(210);
  const [arrowPadding, setArrowPadding] = React.useState(6);
  const [showArrow, setShowArrow] = React.useState(true);
  // keep click defaults aligned when toggling hover
  React.useEffect(() => {
    if (triggerOnHover) {
      setTriggerOnClick(undefined);
      setTriggerOnClickAway(undefined);
      setTriggerOnEsc(undefined);
    }
  }, [triggerOnHover]);

  return (
    <div className="container">
      <h1>Floating Tooltip React</h1>

      <p className="lead">A batteries included tooltip component</p>

      {/* References showcase */}
      <div className="refs">
        <BasePopper
          disable={disable}
          placement={placement}
          offset={offset}
          viewportPadding={viewportPadding}
          autoPlacement={autoPlacement}
          autoUpdate={autoUpdate}
          // triggers:
          triggerOnHover={triggerOnHover}
          enterable={enterable}
          hoverDelay={hoverDelay}
          triggerOnClick={triggerOnClick}
          triggerOnClickAway={triggerOnClickAway}
          triggerOnPopper={triggerOnPopper}
          triggerOnEsc={triggerOnEsc}
          referenceEsc={referenceEsc}
          // other options:
          usePortal={usePortal}
          transitionMs={transitionMs}
          // slots:
          slots={slots}
          pop={<div>Hello from Popper 👋</div>}
          popClass="demo-pop"
          popContainerProps={popContainerProps}
          withArrow={showArrow}
          arrowProps={arrowProps}
          arrowPadding={arrowPadding}
        >
          <button type="button" className="demo-btn">
            Reference
          </button>
        </BasePopper>

        <div className="moving-area">
          <div className="moving">
            <BasePopper
              disable={disable}
              placement={placement}
              offset={offset}
              viewportPadding={viewportPadding}
              autoPlacement={autoPlacement}
              autoUpdate={autoUpdate}
              // triggers:
              triggerOnHover={triggerOnHover}
              enterable={enterable}
              hoverDelay={hoverDelay}
              triggerOnClick={triggerOnClick}
              triggerOnClickAway={triggerOnClickAway}
              triggerOnPopper={triggerOnPopper}
              triggerOnEsc={triggerOnEsc}
              referenceEsc={referenceEsc}
              // other options:
              usePortal={usePortal}
              transitionMs={transitionMs}
              // slots:
              slots={slots}
              pop={<div>Moving ref demo 🏃‍♂️</div>}
              popClass="demo-pop"
              popContainerProps={popContainerProps}
              withArrow={showArrow}
              arrowProps={arrowProps}
              arrowPadding={arrowPadding}
            >
              <button type="button" className="demo-btn">
                Moving reference
              </button>
            </BasePopper>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="controls">
          <h2>Triggers</h2>
          <label className="control-row">
            <input
              type="checkbox"
              checked={triggerOnHover}
              onChange={(e) => setTriggerOnHover(e.target.checked)}
            />
            <span>triggerOnHover</span>
          </label>
          <label className="control-row">
            <input
              type="checkbox"
              checked={enterable}
              onChange={(e) => setEnterable(e.target.checked)}
            />
            <span>enterable</span>
          </label>
          <label className="control-row">
            <span>hoverDelay</span>
            <input
              type="number"
              min={0}
              step={50}
              value={hoverDelay}
              onChange={(e) => setHoverDelay(Number(e.target.value))}
            />
          </label>

          <label className="control-row">
            <input
              type="checkbox"
              checked={triggerOnClick}
              onChange={(e) => setTriggerOnClick(e.target.checked)}
              disabled={triggerOnHover}
            />
            <span>triggerOnClick</span>
          </label>
          <label className="control-row">
            <input
              type="checkbox"
              checked={triggerOnClickAway}
              onChange={(e) => setTriggerOnClickAway(e.target.checked)}
              disabled={triggerOnHover}
            />
            <span>triggerOnClickAway</span>
          </label>
          <label className="control-row">
            <input
              type="checkbox"
              checked={triggerOnPopper}
              onChange={(e) => setTriggerOnPopper(e.target.checked)}
            />
            <span>triggerOnPopper</span>
          </label>
          <label className="control-row">
            <input
              type="checkbox"
              checked={triggerOnEsc}
              onChange={(e) => setTriggerOnEsc(e.target.checked)}
              disabled={triggerOnHover}
            />
            <span>triggerOnEsc</span>
          </label>
          <label className="control-row">
            <input
              type="checkbox"
              checked={referenceEsc}
              onChange={(e) => setReferenceEsc(e.target.checked)}
            />
            <span>referenceEsc</span>
          </label>

          <h2>Positioning</h2>
          <label className="control-row">
            <span>placement</span>
            <select
              value={placement}
              onChange={(e) => setPlacement(e.target.value as Placement)}
            >
              {[
                "top",
                "top-start",
                "top-end",
                "bottom",
                "bottom-start",
                "bottom-end",
                "left",
                "left-start",
                "left-end",
                "right",
                "right-start",
                "right-end",
              ].map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
          <label className="control-row">
            <span>offset</span>
            <input
              type="number"
              step={1}
              value={offset}
              onChange={(e) => setOffset(Number(e.target.value))}
            />
          </label>
          <label className="control-row">
            <span>viewportPadding</span>
            <input
              type="number"
              step={1}
              value={viewportPadding}
              onChange={(e) => setViewportPadding(Number(e.target.value))}
            />
          </label>
          <label className="control-row">
            <span>autoPlacement</span>
            <select
              value={autoPlacement ? "flip" : "false"}
              onChange={(e) =>
                setAutoPlacement(e.target.value === "flip" ? "flip" : false)
              }
            >
              <option value="flip">flip</option>
              <option value="false">false</option>
            </select>
          </label>
          <label className="control-row">
            <input
              type="checkbox"
              checked={autoUpdate}
              onChange={(e) => setAutoUpdate(e.target.checked)}
            />
            <span>autoUpdate</span>
          </label>
          <label className="control-row">
            <input
              type="checkbox"
              checked={usePortal}
              onChange={(e) => setUsePortal(e.target.checked)}
            />
            <span>usePortal</span>
          </label>
          <label className="control-row">
            <span>transitionMs</span>
            <input
              type="number"
              step={10}
              min={0}
              value={transitionMs}
              onChange={(e) => setTransitionMs(Number(e.target.value))}
            />
          </label>
          <h2>Arrow</h2>
          <label className="control-row">
            <span>arrowPadding</span>
            <input
              type="number"
              step={1}
              min={0}
              value={arrowPadding}
              onChange={(e) => setArrowPadding(Number(e.target.value))}
            />
          </label>
          <label className="control-row">
            <input
              type="checkbox"
              checked={showArrow}
              onChange={(e) => setShowArrow(e.target.checked)}
            />
            <span>withArrow</span>
          </label>

          <h2>Other</h2>
          <label className="control-row">
            <input
              type="checkbox"
              checked={disable}
              onChange={(e) => setDisable(e.target.checked)}
            />
            <span>disable</span>
          </label>
        </div>
      </div>
    </div>
  );
}
