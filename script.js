const field = document.getElementById(`field`)
const boards = Array.from(field.children)
const cells = boards.map(board => Array.from(board.children))

const winningMessageTextElement = document.querySelector(`[data-winning-message-text]`)
const winningMessageElement = document.getElementById(`winningMessage`)
const restartButton = document.getElementById(`restartButton`)
const nextTurnElement = document.querySelector(`#nextTurn`)

let xTurn, firstTurn
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
	field.classList.remove(X_CLASS)
	field.classList.remove(O_CLASS)
	field.classList.remove(DRAW_CLASS)
	boards.forEach(board => {
		board.classList.remove(X_CLASS)
		board.classList.remove(O_CLASS)
		board.classList.remove(DRAW_CLASS)
	})
	cells.forEach((boardCells, boardIndex) => {
		boardCells.forEach((cell, cellIndex) => {
			cell.classList.remove(X_CLASS)
			cell.classList.remove(O_CLASS)
			cell.classList.remove(DRAW_CLASS)
			cell.classList.remove(INVALID_CLASS)
			cell.classList.remove(WON_CLASS)
			cell.removeEventListener('click', handleClick)
			cell.addEventListener('click', handleClick, { once: true })
			if (boardIndex !== cellIndex) cell.classList.add(INVALID_CLASS)
		})
	})
	winningMessageElement.classList.remove(`show`)
	nextTurnElement.innerText = `${xTurn ? `X` : `O`}'s Turn!`
}
startGame()

function handleClick(e) {
	const cell = e.target
	if (!cell.classList.contains(INVALID_CLASS)) {
		if (firstTurn) {
			firstTurn = false;
			cells.forEach((boardCells, boardIndex) => {
				boardCells.forEach((cell, cellIndex) => {
					cell.classList.remove(INVALID_CLASS)
				})
			})

			const currentBoardIndex = boards.indexOf(cell.parentElement)
			cells.forEach((boardCells, boardIndex) => {
				if (boardIndex === currentBoardIndex) {
					boardCells.forEach(cell => {
						if (!cell.classList.contains(INVALID_CLASS))
							cell.classList.add(INVALID_CLASS)
					})
				} else {
					boardCells.forEach((cell, cellIndex) => {
						cell.classList.remove(INVALID_CLASS)
					})
				}
			})
		} else {
			const nextBoardIndex = Array.from(cell.parentElement.children).indexOf(cell)
			cells.forEach((boardCells, boardIndex) => {
				if (boardIndex !== nextBoardIndex) {
					boardCells.forEach(cell => {
						if (!cell.classList.contains(INVALID_CLASS))
							cell.classList.add(INVALID_CLASS)
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
			const winIndex = checkWin(currentClass, cells[index]);
			if (winIndex > -1) {
				endBoard(board, false, currentClass, WINNING_COMBINATIONS[winIndex])
			} else if (checkDraw(cells[index])) {
				endBoard(board, true)
			}
		})
		if (checkWin(currentClass, boards) > -1) {
			endField(false)
		} else if (checkDraw(boards)) {
			endField(true)
		}
		swapTurns()
	}

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

function endField(isDraw) {
	if (isDraw) {
		winningMessageTextElement.innerText = `Draw!`
	} else {
		winningMessageTextElement.innerText = `${xTurn ? `X` : `O`} Wins!`
	}
	winningMessageElement.classList.add('show')
}

function checkWin(currentClass, elements) {
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