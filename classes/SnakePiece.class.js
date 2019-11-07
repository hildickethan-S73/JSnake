// snake body piece class
// lightens the body to only the necessary properties for a piece
class SnakePiece {
    constructor(x = 80, y = 80, prevPosition = null) {
        // properties
        this.position = {
            x: x,
            y: y
        },
        this.prevPosition = prevPosition
    }
}
