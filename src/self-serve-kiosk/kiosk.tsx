import { Button, H3, Overlay2 } from "@blueprintjs/core";
import styles from "./kiosk.css";
import { useDrawState } from "../draw-state";
import { useConfigState } from "../config-state";
import { DrawnChart } from "../models/Drawing";
import { memo, useDeferredValue, useState } from "react";
import DrawnSet from "../drawn-set";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "@blueprintjs/icons";

// How the Kiosk screen works:
// 1st screen
// - Welcome screen with info
// 2nd screen
// - Player selection from list. Two copies of the same list are displayed so player 1 and player 2 can select their names.
// 3rd-6th screen
// - Players take turns selecting from the list below. (The higher seed goes first).
// - Header: PLAYER_NAME, choose an option:
//  - I want to be the first to protect a song.
//  - I want protect a song after OTHER_PLAYER_NAME does.
//  - I want to be the first to veto a song.
//  - I want veto a song after OTHER_PLAYER_NAME does.
// 7th-10th screens
// - Players protect and veto drawn songs using their selections from the previous screens.
//  - Note: Protects always happen before vetos.
//  - Example: Player 1 picks first protect and second veto. Player 2 picks second protect and first veto. Resulting order:
//    - Player 1 protects a song
//    - Player 2 protects a song
//    - Player 2 vetos a song
//    - Player 1 vetos a song
// 11th screen
// - Results: Shows a summary of everything chosen from all previous screens.

// Note: In the future this can be made generic by handling options for number of songs drawn, custom rules, etc. 
// For this feature, the number of pages would need to be dynamic and determined using the custom rules.

type Choice = 'first-protect' | 'second-protect' | 'first-veto' | 'second-veto';

interface PlayerSelection {
    player: string;
    selection: Choice;
}

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
    const playerNames = useConfigState((s) => s.playerNames);

    const [currentScreen, setCurrentScreen] = useState(0);
    const [direction, setDirection] = useState(0);

    const [playerSelections, setPlayerSelections] = useState<PlayerSelection[]>([]);

    function handleDraw() {
        useConfigState.setState({ showEligibleCharts: false });
        drawSongs(useConfigState.getState());
    }

    const WelcomeScreen = memo(() => {
        return (
            <div>TODO: some welcome text</div>
        );
    });
    
    const PlayerSelectScreen = memo(() => {
        return (
            <div>TODO: Two lists of the playerNames array, scrollable and selectable. Store both selections in a useState hook. Once both selections are made, the Next button is enabled.</div>
        );
    });
    
    interface ProtectVetoOrderScreenProps {
        player: string;
        step: number
    }
    const ProtectVetoOrderScreen = memo<ProtectVetoOrderScreenProps>(function DrawnSet({ player, step }) {
        return (
            <>
                <div>TODO: Four buttons, only one can be selected at a time. See comment at the top of the file for the options. Once a selection is made, the Next button is enabled.</div>
            </>
        );
    });

    interface CardDrawScreenProps {
        choice: Choice;
    }
    const CardDrawScreen = memo<CardDrawScreenProps>(function DrawnSet({ choice }) {
        return (
            <>
                <div>TODO: Display the five cards drawn. One can be tapped to protect or veto it (based on "choice" prop). Once one is vetoed/protected, the Next button becomes available.</div>
            </>
        );
    });
    
    const ResultsScreen = memo(() => {
        return (
            <div>Just display the resulting three cards that were protected or left alone (two protected cards and one remaining card that wasn't protected or vetoed).</div>
        );
    });
    
        
    const Screen1 = () => <WelcomeScreen />;
    const Screen2 = () => <PlayerSelectScreen />;
    const Screen3 = () => <ProtectVetoOrderScreen player={TODO_higher_seed_player_name_here} step={1} />;
    const Screen4 = () => <ProtectVetoOrderScreen player={TODO_lower_seed_player_name_here} step={2} />;
    const Screen5 = () => <ProtectVetoOrderScreen player={TODO_higher_seed_player_namer_here} step={3} />;
    const Screen6 = () => <ProtectVetoOrderScreen player={TODO_lower_seed_player_name_here} step={4} />;
    const Screen7 = () => <CardDrawScreen choice={'first-protect'} />;
    const Screen8 = () => <CardDrawScreen choice={'second-protect'} />;
    const Screen9 = () => <CardDrawScreen choice={'first-veto'} />;
    const Screen10 = () => <CardDrawScreen choice={'second-veto'} />;
    const Screen11 = () => <ResultsScreen />;
    const screens = [Screen1, Screen2, Screen3, Screen4, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11];

    const goToNext = () => {
        if (currentScreen < screens.length - 1) {
            setDirection(1);
            setCurrentScreen(currentScreen + 1);
        }
    };

    const goToPrevious = () => {
        // TODO: Pop the last PlayerSelection from the list if there are elements in the list
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
                                opacity: { duration: 0.2 },
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