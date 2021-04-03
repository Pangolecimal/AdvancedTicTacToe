const grid = document.getElementById(`grid`)
const boards = Array.from(grid.children)
const cells = boards.map(board => Array.from(board.children))

const winningMessageTextElement = document.querySelector(`[data-winning-message-text]`)
const winningMessageElement = document.getElementById(`winningMessage`)
const restartButton = document.getElementById(`restartButton`)
const nextTurnElement = document.querySelector(`#nextTurn`)

let xTurn
const X_CLASS = `x`, O_CLASS = `o`, DRAW_CLASS = `draw`, INVALID_CLASS = `invalid`, WON_CLASS = `won`
const WINNING_COMBINATIONS = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6]
];

restartButton.addEventListener('click', startGame)

function startGame() {
	xTurn = true
	firstTurn = true
	grid.classList.remove([X_CLASS, O_CLASS, DRAW_CLASS])
	boards.forEach(board => {
		board.classList.remove([X_CLASS, O_CLASS, DRAW_CLASS])
	})
	cells.forEach((boardCells, boardIndex) => {
		boardCells.forEach((cell, cellIndex) => {
			cell.classList.remove([X_CLASS, O_CLASS, DRAW_CLASS, INVALID_CLASS, WON_CLASS])
			cell.removeEventListener('click', handleClick)
			cell.addEventListener('click', handleClick)
		})
	})
	winningMessageElement.classList.remove(`show`)
	nextTurnElement.innerText = `${xTurn ? `X` : `O`}'s Turn!`
}
startGame()

function handleClick(e) {
	const cell = e.target
	if (checkElement(cell)) return
	if (cell.classList.contains(INVALID_CLASS)) return

	const currentBoardIndex = boards.indexOf(cell.parentElement)
	const nextBoardIndex = Array.from(cell.parentElement.children).indexOf(cell)

	if (currentBoardIndex === nextBoardIndex) {
		clearCells(INVALID_CLASS)

		cells.forEach((boardCells, boardIndex) => {
			if (boardIndex === currentBoardIndex) {
				boardCells.forEach(cell => {
					placeMark(cell, INVALID_CLASS)
				})
			} else {
				boardCells.forEach((cell, cellIndex) => {
					cell.classList.remove(INVALID_CLASS)
				})
			}
		})
	} else {
		cells.forEach((boardCells, boardIndex) => {
			if (boardIndex !== nextBoardIndex) {
				boardCells.forEach(cell => {
					placeMark(cell, INVALID_CLASS)
				})
			} else {
				boardCells.forEach(cell => {
					cell.classList.remove(INVALID_CLASS)
				})
			}
		})
	}

	const currentClass = xTurn ? X_CLASS : O_CLASS
	placeMark(cell, currentClass)
	boards.forEach((board, index) => {
		const winIndex = winCombinationIndex(currentClass, cells[index]);
		if (winIndex > -1) {
			endBoard(board, false, currentClass, WINNING_COMBINATIONS[winIndex])
		} else if (checkDraw(cells[index])) {
			endBoard(board, true)
		}
	})
	if (winCombinationIndex(currentClass, boards) > -1) {
		endGrid(false)
	} else if (checkDraw(boards)) {
		endGrid(true)
	}
	swapTurns()
}


function clearCells(classToRemove) {
	cells.forEach((boardCells) => {
		boardCells.forEach((cell) => {
			cell.classList.remove(classToRemove)
		})
	})
}

function placeMark(element, currentClass) {
	if (!element.classList.contains(currentClass))
		element.classList.add(currentClass)
}

function checkElement(element) {
	return element.classList.contains(O_CLASS) ||
		element.classList.contains(X_CLASS) ||
		element.classList.contains(DRAW_CLASS)
}

function swapTurns() {
	xTurn = !xTurn
	nextTurnElement.innerText = `${xTurn ? `X` : `O`}'s Turn!`
}

function endBoard(board, isDraw, currentClass, combination) {
	if (!checkElement(board))
		if (!isDraw) {
			placeMark(board, currentClass)
			const boardCells = Array.from(board.children)
			combination.forEach(index => {
				if (!boardCells[index].classList.contains(WON_CLASS))
					boardCells[index].classList.add(WON_CLASS)
			})
		} else {
			placeMark(board, DRAW_CLASS)
			const boardCells = Array.from(board.children)
			boardCells.forEach(cell => {
				if (!cell.classList.contains(WON_CLASS))
					cell.classList.add(WON_CLASS)
			})
		}
}

function endGrid(isDraw) {
	if (isDraw) {
		winningMessageTextElement.innerText = `Draw!`
	} else {
		winningMessageTextElement.innerText = `${xTurn ? `X` : `O`} Wins!`
	}
	winningMessageElement.classList.add('show')
}

function winCombinationIndex(currentClass, elements) {
	return WINNING_COMBINATIONS.findIndex((combination, i) =>
		combination.every(index =>
			elements[index].classList.contains(currentClass)
		)
	)
}

function checkDraw(elements) {
	return elements.every(element => {
		return element.classList.contains(X_CLASS) ||
			element.classList.contains(O_CLASS) ||
			element.classList.contains(DRAW_CLASS)
	})
}