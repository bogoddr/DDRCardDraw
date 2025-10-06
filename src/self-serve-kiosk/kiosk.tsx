import { Button, H3, Overlay2 } from "@blueprintjs/core";
import styles from "./kiosk.css";
import { useDrawState } from "../draw-state";
import { useConfigState } from "../config-state";
import { DrawnChart } from "../models/Drawing";
import { memo, useDeferredValue, useState } from "react";
import DrawnSet from "../drawn-set";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "@blueprintjs/icons";

// Animation variants for slide transitions
const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
    },
    exit: (direction: number) => ({
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
    }),
};

export const Kiosk: React.FC = props => {
    const [drawings, drawSongs, hasGameData] = useDrawState((s) => [
        s.drawings,
        s.drawSongs,
        !!s.gameData,
    ]);
    const [currentScreen, setCurrentScreen] = useState(0);
    const [direction, setDirection] = useState(0);

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
        
    // Screen components - add your actual screen content here
    const Screen1 = () => <div><H3>Screen 1</H3><p>Welcome to the kiosk</p></div>;
    const Screen2 = () => <div><H3>Screen 2</H3><p>Configuration options</p></div>;
    const Screen3 = () => <><ScrollableDrawings /><Button onClick={handleDraw}>
                    Draw songs
                </Button></>;

    const screens = [Screen1, Screen2, Screen3];


    const goToNext = () => {
        if (currentScreen < screens.length - 1) {
            setDirection(1);
            setCurrentScreen(currentScreen + 1);
        }
    };

    const goToPrevious = () => {
        if (currentScreen > 0) {
            setDirection(-1);
            setCurrentScreen(currentScreen - 1);
        }
    };

    const CurrentScreenComponent = screens[currentScreen];

    return (
        <Overlay2
            backdropClassName={styles.testexample}
            isOpen={true}
            hasBackdrop={true}
        >
            <div className={styles.kioskContainer}>
                <div className={styles.screenContainer}>
                    <AnimatePresence initial={false} custom={direction} mode="wait">
                        <motion.div
                            key={currentScreen}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.0 },
                            }}
                            className={styles.screen}
                        >
                            <CurrentScreenComponent />
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className={styles.navigation}>
                    {currentScreen > 0 && (
                        <Button
                            large
                            icon={<ChevronLeft />}
                            onClick={goToPrevious}
                            text="Previous"
                        />
                    )}
                    <div className={styles.screenIndicator}>
                        {currentScreen + 1} / {screens.length}
                    </div>
                    {currentScreen < screens.length - 1 && (
                        <Button
                            large
                            icon={<ChevronRight />}
                            onClick={goToNext}
                            text="Next"
                            intent="primary"
                        />
                    )}
                </div>
            </div>
        </Overlay2>
    );
};