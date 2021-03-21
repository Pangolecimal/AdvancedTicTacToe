const field = document.getElementById(`field`)
const boards = Array.from(field.children)
const cells = boards.map(board => Array.from(board.children))

const winningMessageTextElement = document.querySelector(`[data-winning-message-text]`)
const winningMessageElement = document.getElementById(`winningMessage`)
const restartButton = document.getElementById(`restartButton`)

const X_CLASS = `x`, O_CLASS = `o`, DRAW_CLASS = `draw`
let xTurn
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
	field.classList.remove(X_CLASS)
	field.classList.remove(O_CLASS)
	field.classList.remove(DRAW_CLASS)
	boards.forEach(board => {
		board.classList.remove(X_CLASS)
		board.classList.remove(O_CLASS)
		board.classList.remove(DRAW_CLASS)
	})
	cells.forEach(boardCells => {
		boardCells.forEach(cell => {
			cell.classList.remove(X_CLASS)
			cell.classList.remove(O_CLASS)
			cell.classList.remove(DRAW_CLASS)
			cell.removeEventListener('click', handleClick)
			cell.addEventListener('click', handleClick, { once: true })
		})
	})
	winningMessageElement.classList.remove(`show`)
}
startGame()

function handleClick(e) {
	const cell = e.target
	const currentClass = xTurn ? X_CLASS : O_CLASS
	placeMark(cell, currentClass)
	boards.forEach((board, index) => {
		if (checkWin(currentClass, cells[index])) {
			placeMark(board, currentClass)
		} else if (checkDraw(cells[index])) {
			placeMark(board, DRAW_CLASS)
		}
	})
	if (checkWin(currentClass, boards)) {
		endField(false)
	} else if (checkDraw(boards)) {
		endField(true)
	}
	swapTurns()
}


function placeMark(element, currentClass) {
	if (!element.classList.contains(currentClass))
		element.classList.add(currentClass)
}

function swapTurns() {
	xTurn = !xTurn
}

function endField(isDraw) {
	if (isDraw) {
		winningMessageTextElement.innerText = `Draw!`
	} else {
		winningMessageTextElement.innerText = `${xTurn ? `X` : `O`} Wins!`
	}
	winningMessageElement.classList.add('show')
}

function checkWin(currentClass, elements) {
	return WINNING_COMBINATIONS.some(combination => {
		return combination.every(index => {
			return elements[index].classList.contains(currentClass)
		})
	})
}

function checkDraw(elements) {
	return elements.every(element => {
		return element.classList.contains(X_CLASS) ||
			element.classList.contains(O_CLASS) ||
			element.classList.contains(DRAW_CLASS)
	})
}