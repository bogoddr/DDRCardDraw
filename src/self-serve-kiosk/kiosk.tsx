import { Button, H3, Overlay2 } from "@blueprintjs/core";
import styles from "./kiosk.css";
import { useDrawState } from "../draw-state";
import { useConfigState } from "../config-state";
import { DrawnChart } from "../models/Drawing";
import { memo, useDeferredValue } from "react";
import DrawnSet from "../drawn-set";

export const Kiosk: React.FC = props => {
    const [drawings, drawSongs, hasGameData] = useDrawState((s) => [
        s.drawings,
        s.drawSongs,
        !!s.gameData,
    ]);

    function handleDraw() {
        useConfigState.setState({ showEligibleCharts: false });
        drawSongs(useConfigState.getState());
    }

    const ScrollableDrawings = memo(() => {
        const drawings = useDeferredValue(useDrawState((s) => s.drawings));
        return (
            <div>
                {drawings.map((d) => (
                    <DrawnSet key={d.id} drawing={d} />
                ))}
            </div>
        );
    });

    return (
        <Overlay2
            backdropClassName={styles.testexample}
            isOpen={true}
            hasBackdrop={true}
        >
            <div className={'testexample'}>
                <H3>I'm an Overlay!</H3>
                <ScrollableDrawings />
                <Button onClick={handleDraw}>
                    Draw songs
                </Button>
            </div>
        </Overlay2>
    );
};