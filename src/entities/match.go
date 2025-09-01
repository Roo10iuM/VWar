package entities

import (
	"errors"
	"fmt"
)

type CellState int

const (
	Empty CellState = iota
	PlayerOneVirus
	PlayerTwoVirus
	PlayerOneVirusKilled
	PlayerTwoVirusKilled
)

type Cell struct {
	state CellState
}

type TargetCellsPosition struct {
	x, y int
}

type Turn struct {
	target_postions [3]TargetCellsPosition
}

type GameState struct {
	turns []Turn
	cells [][]Cell
}

func (game_state GameState) Move(turn Turn) error {
	if !game_state.isValideTurn(turn) {
		return errors.New("Invalid move")
	}
	game_state.setCells(turn)
	// TODO
}

func (game_state GameState) isValideTurn(turn Turn) bool {
	setCells(turn)
	for _, target_postion := range turn.target_postions {
		// TODO
	}
	return true
}

func (game_state GameState) setCells(turn Turn) error {
	for _, target_postion := range turn.target_postions {
		err := game_state.toggleCell(target_postion)
		// TODO
	}
	return nil
}

func (game_state GameState) toggleCell(target_postion TargetCellsPosition) error {
	if game_state.isKilledCell(target_postion) {
		return fmt.Errorf(
			"Do not disturb the dead (%v; %v)",
			target_postion.x,
			target_postion.y,
		)
	}
	if game_state.isFriendlyCell(target_postion) {
		return fmt.Errorf(
			"Friendly fire is prohibited (%v; %v)",
			target_postion.x,
			target_postion.y,
		)
	}
	cell := game_state.cells[target_postion.x][target_postion.y]
	switch cell.state {
	case Empty:
		cell.state = game_state.getCurrentPlayerVirus()
	default:
		// TODO
	}
	return nil
}

func (game_state GameState) isKilledCell(target_postion TargetCellsPosition) bool {
	cell := game_state.cells[target_postion.x][target_postion.y]
	if cell.state == PlayerOneVirusKilled || cell.state == PlayerTwoVirusKilled {
		return true
	} else {
		return false
	}
}

func (game_state GameState) isFriendlyCell(target_postion TargetCellsPosition) bool {
	cell := game_state.cells[target_postion.x][target_postion.y]
	switch cell.state {
	case game_state.getCurrentPlayerVirus():
		return true
	case game_state.getEnemyPlayerVirusKilled():
		return true
	default:
		return false
	}
}

func (game_state GameState) getCurrentPlayerVirus() CellState {
	if len(game_state.turns)%2 == 0 {
		return PlayerOneVirus
	} else {
		return PlayerTwoVirus
	}
}

func (game_state GameState) getEnemyPlayerVirusKilled() CellState {
	if len(game_state.turns)%2 == 0 {
		return PlayerTwoVirusKilled
	} else {
		return PlayerOneVirusKilled
	}
}
