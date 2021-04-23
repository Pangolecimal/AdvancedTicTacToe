const grid = document.querySelector(`.grid`)
const boards = Array.from(grid.children)
const cells = boards.map(board => Array.from(board.children))

const shortGrid = document.querySelector(`.grid-short`)
const shortBoards = Array.from(shortGrid.children)

const winningMessageTextElement = document.querySelector(`[data-winning-message-text]`)
const winningMessageElement = document.querySelector(`#winningMessage`)
const restartButton = document.querySelector(`#restartButton`)
const nextTurnElement = document.querySelector(`.next-turn`)

//#region Modal
{
	const openModalButtons = document.querySelectorAll('[data-modal-target]')
	const closeModalButtons = document.querySelectorAll('[data-close-button]')
	const overlay = document.getElementById('overlay')

	openModalButtons.forEach(button => {
		button.addEventListener('click', () => {
			const modal = document.querySelector(button.dataset.modalTarget)
			openModal(modal)
		})
	})

	overlay.addEventListener('click', () => {
		const modals = document.querySelectorAll('.modal.active')
		modals.forEach(modal => {
			closeModal(modal)
		})
	})

	closeModalButtons.forEach(button => {
		button.addEventListener('click', () => {
			const modal = button.closest('.modal')
			closeModal(modal)
		})
	})

	function openModal(modal) {
		if (modal == null) return
		modal.classList.add('active')
		overlay.classList.add('active')
	}

	function closeModal(modal) {
		if (modal == null) return
		modal.classList.remove('active')
		overlay.classList.remove('active')
	}
}
//#endregion

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
	grid.classList.remove(X_CLASS, O_CLASS, DRAW_CLASS)
	boards.forEach(board => {
		board.classList.remove(X_CLASS, O_CLASS, DRAW_CLASS)
	})
	cells.forEach(boardCells => {
		boardCells.forEach(cell => {
			cell.classList.remove(X_CLASS, O_CLASS, DRAW_CLASS, INVALID_CLASS, WON_CLASS)
			cell.removeEventListener('click', handleClick)
			cell.addEventListener('click', handleClick)
		})
	})
	winningMessageElement.classList.remove(`show`)
	nextTurnElement.innerText = `Next Turn: ${xTurn ? `X` : `O`}`
}
startGame()

function handleClick(e) {
	const cell = e.target
	if (checkElement(cell)) return
	if (cell.classList.contains(INVALID_CLASS)) return

	const nextBoardIndex = getIndex(cell);

	if (checkWin(cells[nextBoardIndex])) {
		cells.forEach((boardCells, boardIndex) => {
			if (boardIndex === nextBoardIndex || checkWin(cells[boardIndex])) {
				boardCells.forEach(cell => {
					placeMark(cell, INVALID_CLASS)
				})
			} else {
				boardCells.forEach(cell => {
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
		} else if (checkWin(cells[index])) {
			endBoard(board, true)
		}
	})
	if (winCombinationIndex(currentClass, boards) > -1) {
		endGrid(false)
	} else if (checkWin(boards)) {
		endGrid(true)
	}
	swapTurns()
}

function getIndex(element) {
	return Array.from(element.parentElement.children).indexOf(element)
}

function clearCells(classToRemove) {
	cells.forEach((boardCells) => {
		boardCells.forEach((cell) => {
			cell.classList.remove(classToRemove)
		})
	})
}

function placeMark(element, currentClass) {
	element.classList.toggle(currentClass, true)
}

function checkElement(element) {
	return element.classList.contains(O_CLASS) ||
		element.classList.contains(X_CLASS) ||
		element.classList.contains(DRAW_CLASS)
}

function swapTurns() {
	xTurn = !xTurn
	nextTurnElement.innerText = `Next Turn: ${xTurn ? `X` : `O`}`
}

function endBoard(board, isDraw, currentClass, combination) {
	if (!checkElement(board)) {
		if (isDraw) {
			placeMark(board, DRAW_CLASS)
			const boardCells = Array.from(board.children)
			boardCells.forEach(cell => {
				placeMark(cell, WON_CLASS)
			})
		}
		if (!isDraw) {
			placeMark(board, currentClass)
			const boardCells = Array.from(board.children)
			combination.forEach(index => {
				placeMark(boardCells[index], WON_CLASS)
			})
			const boardIndex = getIndex(board)
			placeMark(shortBoards[boardIndex], currentClass)
		}
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

function checkWin(elements) {
	return elements.every(element =>
		element.classList.contains(X_CLASS) ||
		element.classList.contains(O_CLASS) ||
		element.classList.contains(DRAW_CLASS)
	)
}