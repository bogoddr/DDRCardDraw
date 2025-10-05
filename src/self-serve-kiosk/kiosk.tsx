
import classNames from "classnames";
import { StrictMode, useCallback, useDeferredValue, useRef, useState } from "react";

import { Button, Classes, Code, H3, H5, Intent, Overlay2, Switch } from "@blueprintjs/core";
import styles from "./kiosk.css";
import { useDrawState } from "../draw-state";
import { useConfigState } from "../config-state";
//import { Example, type ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";

//import type { BlueprintExampleData } from "../../tags/types";

const OVERLAY_EXAMPLE_CLASS = "docs-overlay-example-transition";
const OVERLAY_TALL_CLASS = "docs-overlay-example-tall";

export const Kiosk: React.FC = props => {
    const [autoFocus, setAutoFocus] = useState(true);
    const [canEscapeKeyClose, setCanEscapeKeyClose] = useState(false);
    const [canOutsideClickClose, setCanOutsideClickClose] = useState(false);
    const [enforceFocus, setEnforceFocus] = useState(true);
    const [hasBackdrop, setHasBackdrop] = useState(true);
    const [isOpen, setIsOpen] = useState(true);
    const [usePortal, setUsePortal] = useState(true);
    const [useTallContent, setUseTallContent] = useState(false);

  //const drawings = useDeferredValue(useDrawState((s) => s.drawings));
  //console.log(drawings)

    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleOpen = useCallback(() => setIsOpen(true), [setIsOpen]);

    const handleClose = useCallback(() => {
        setIsOpen(false);
        setUseTallContent(false);
    }, [setIsOpen, setUseTallContent]);

    const focusButton = useCallback(() => buttonRef.current?.focus(), [buttonRef]);

    const [drawings, drawSongs, hasGameData] = useDrawState((s) => [
        s.drawings,
        s.drawSongs,
        !!s.gameData,
    ]);
      function handleDraw() {
        useConfigState.setState({ showEligibleCharts: false });
        drawSongs(useConfigState.getState());
      }

    const classes = classNames(
        Classes.CARD,
        Classes.ELEVATION_4,
        OVERLAY_EXAMPLE_CLASS,
        //props.data.themeName,
        {
            [OVERLAY_TALL_CLASS]: useTallContent,
        },
    );

    const options = (
        <>
            <H5>Props</H5>
            <Switch
                checked={autoFocus}
                label="Auto focus"
            />
            <Switch
                checked={enforceFocus}
                label="Enforce focus"
            />
            <Switch
                checked={canOutsideClickClose}
                label="Click outside to close"
            />
            <Switch
                checked={canEscapeKeyClose}
                label="Escape key to close"
            />
            <Switch
                checked={hasBackdrop}
                label="Has backdrop"
            />
        </>
    );

    console.log(drawings)

    return (
      <>
                <Button ref={buttonRef} onClick={handleOpen} text="Show overlay" />
                {isOpen ? (
                <Overlay2
                    onClose={handleClose}
                    //className={Classes.OVERLAY_SCROLL_CONTAINER}
                    backdropClassName={styles.testexample}
                    {...{
                        autoFocus,
                        canEscapeKeyClose,
                        canOutsideClickClose,
                        enforceFocus,
                        hasBackdrop,
                        isOpen,
                        usePortal,
                    }}
                >
                    <div className={'testexample'}>
                        <H3>I'm an Overlay!</H3>
                        <p>
                            This is a simple container with some inline styles to position it on the
                            screen. Its CSS transitions are customized for this example only to
                            demonstrate how easily custom transitions can be implemented.
                        </p>
                        <p>
                            Click the "Focus button" below to transfer focus to the "Show overlay"
                            trigger button outside of this overlay. If persistent focus is enabled,
                            focus will be constrained to the overlay. Use the <Code>tab</Code> key
                            to move to the next focusable element to illustrate this effect.
                        </p>
                        <p>
                            Click the "Make me scroll" button below to make this overlay's content
                            really tall, which will make the overlay's container (but not the page)
                            scrollable
                        </p>
                        <br />
                        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                            <Button
                                intent={Intent.DANGER}
                                onClick={handleClose}
                                style={{ margin: "" }}
                            >
                                Close
                            </Button>
                            <Button onClick={focusButton} style={{ margin: "" }}>
                                Focus button
                            </Button>
                            <Button
                                onClick={handleDraw}
                                icon="double-chevron-down"
                                endIcon="double-chevron-down"
                                active={useTallContent}
                                style={{ margin: "" }}
                            >
                                draw songs
                            </Button>
                        </div>
                    </div>
                </Overlay2>
                ) : <></>}
                </>
    );
};