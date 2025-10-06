import {
  Button,
  Checkbox,
  Classes,
  FormGroup,
  InputGroup,
  NumericInput,
  TagInput,
} from "@blueprintjs/core";
import { ReactNode, useState } from "react";
import { useConfigState } from "../config-state";
import { useIntl } from "../hooks/useIntl";
import { DiagramTree, DragHandleVertical, Person, Plus, Trash } from "@blueprintjs/icons";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styles from "./controls.css";

interface SortablePlayerItemProps {
  id: string;
  name: string;
  index: number;
  onRemove: (index: number) => void;
}

function SortablePlayerItem({ id, name, index, onRemove }: SortablePlayerItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    display: 'flex',
    alignItems: 'center',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={styles.sortablePlayerItem}
    >
      <Button
        minimal
        icon={<DragHandleVertical />}
        {...attributes}
        {...listeners}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      />
      <div className="sortable-player-seed" style={{paddingRight: 10}}>{index + 1}</div>
      <div className="sortable-player-name">{name}</div>
      <Button
        minimal
        icon={<Trash />}
        onClick={() => onRemove(index)}
        intent="danger"
      />
    </div>
  );
}

export function PlayerNamesControls() {
  const { t } = useIntl();
  const playerNames = useConfigState((s) => s.playerNames);
  const updateConfig = useConfigState((s) => s.update);
  const [newPlayerName, setNewPlayerName] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = playerNames.indexOf(active.id as string);
      const newIndex = playerNames.indexOf(over.id as string);

      updateConfig({
        playerNames: arrayMove(playerNames, oldIndex, newIndex),
      });
    }
  }

  function addPlayer() {
    const trimmedName = newPlayerName.trim();
    if (trimmedName && !playerNames.includes(trimmedName)) {
      updateConfig((prev) => ({
        playerNames: [...prev.playerNames, trimmedName],
      }));
      setNewPlayerName("");
    }
  }

  function removePlayer(index: number) {
    updateConfig((prev) => {
      const next = prev.playerNames.slice();
      next.splice(index, 1);
      return { playerNames: next };
    });
  }

  return (
    <>
      <ShowLabelsToggle />
      <PlayersPerDraw />
      <FormGroup label={t("controls.addPlayerLabel")}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <InputGroup
            large
            leftIcon={<Person />}
            placeholder="Enter player name..."
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addPlayer();
              }
            }}
          />
          <Button
            large
            icon={<Plus />}
            intent="primary"
            onClick={addPlayer}
          />
        </div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={playerNames}
            strategy={verticalListSortingStrategy}
          >
            <div className="sortable-player-list">
              {playerNames.map((name, index) => (
                <SortablePlayerItem
                  key={name}
                  id={name}
                  name={name}
                  index={index}
                  onRemove={removePlayer}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </FormGroup>
      <TournamentLabelEditor />
    </>
  );
}

function ShowLabelsToggle() {
  const update = useConfigState((s) => s.update);
  const enabled = useConfigState((s) => s.showPlayerAndRoundLabels);
  const { t } = useIntl();

  return (
    <Checkbox
      checked={enabled}
      onChange={(e) =>
        update({ showPlayerAndRoundLabels: e.currentTarget.checked })
      }
      label={t("controls.playerLabels")}
    />
  );
}

function PlayersPerDraw() {
  const update = useConfigState((s) => s.update);
  const ppd = useConfigState((s) => s.defaultPlayersPerDraw);
  const { t } = useIntl();

  return (
    <FormGroup label={t("controls.playersPerDraw")}>
      <NumericInput
        type="number"
        inputMode="numeric"
        value={ppd}
        large
        min={0}
        style={{ width: "58px" }}
        onValueChange={(next) => update({ defaultPlayersPerDraw: next })}
      />
    </FormGroup>
  );
}

function TournamentLabelEditor() {
  const { t } = useIntl();
  const tournamentRounds = useConfigState((s) => s.tournamentRounds);
  const updateConfig = useConfigState((s) => s.update);

  function addLabels(names: string[]) {
    updateConfig((prev) => {
      const next = prev.tournamentRounds.slice();
      for (const name of names) {
        if (!next.includes(name)) {
          next.push(name);
        }
      }
      if (next.length !== prev.tournamentRounds.length) {
        return { tournamentRounds: next };
      }
      return {};
    });
  }
  function removeLabel(_name: ReactNode, index: number) {
    updateConfig((prev) => {
      const next = prev.tournamentRounds.slice();
      next.splice(index, 1);
      return { tournamentRounds: next };
    });
  }
  return (
    <FormGroup label={t("controls.tournamentLabelEdit")}>
      <TagInput
        values={tournamentRounds}
        fill
        large
        leftIcon={<DiagramTree size={20} className={Classes.TAG_INPUT_ICON} />}
        onAdd={addLabels}
        onRemove={removeLabel}
      />
    </FormGroup>
  );
}
