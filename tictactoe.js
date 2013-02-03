var Board = function(side_length) {
    if (typeof side_length !== 'number') {
        //throw an error, etc
        return;
    }
    // we'll represent the board as a two dimensional array
    this.board = new Array(side_length);
    // this creates a side_length length array of undefineds - these will be the rows
    // we iterate over the board to create the columns. we need to define a default column:
    var column = [];
    for (var i=0; i<side_length; i++) {
        column.push('');
    }

    for (var j=0; j<this.board.length; j++) {
        this.board[j] = column.slice(0); 
    }
};

Board.prototype.square_is = function(row, col, X_or_O) {
    this.board[row][col] = X_or_O;
};

Board.prototype.winner = function() {
    // we iterate through all the nodes in the board and check if there is a winner.
    // this is not the most efficient way to check, but we're going for clarity.
    // this runs in O(side_length^2).
    // we must also assume that if there is three in a row of both tiles, we did something
    // wrong and return null.
    result = {X: false, O:false};
    for (var i=0; i<this.board.length; i++) {
        for (var j=0; j<this.board[i].length; j++) {
            // four cases - up down, left right, diagonal down, diagonal up
            if (this.board[i][j] === '') {
                // we will only check a three by three square with a tile at the center
                continue;
            }

            if ((i === 0 && j === 0) || (i === this.board.length - 1 && j === this.board[i].length - 1)) {
                // we can't have a win in a three by three sqaure with a center at the corner 
                continue;
            }

            // now we check the cases
            var tile = this.board[i][j];

            // left to right
            if (j !== 0 && j !== this.board[i].length - 1) {
                if (tile === this.board[i][j+1] && tile === this.board[i][j-1]) {
                    console.log('win!');
                    result[tile] = true;
                }
            }

            // up to down
            if (i !== 0 && i !== this.board.length - 1) {
                if (tile === this.board[i+1][j] && tile === this.board[i-1][j]) {
                    result[tile] = true;
                }
            }

            // diagonally
            if (j !== 0 && j !== this.board[i].length - 1 && i !== 0 && i !== this.board.length - 1) {

                // down
                if (tile === this.board[i+1][j+1] && tile === this.board[i-1][j-1]) {
                    result[tile] = true;
                }

                // up
                if (tile === this.board[i+1][j-1] && tile === this.board[i-1][j+1]) {
                    result[tile] = true;
                }
            }
        }
    }

    if ((result.X && result.O) || (!result.X && !result.O)) {
        return null;
    } else if (result.X) {
        return 'X';
    } else if (result.O) {
        return 'O';
    }

    // execution should never get here, so we'll return undefined in case we made a mistake
    return;
};

Board.prototype.render = function () {
    // render the board as html
    var html = '<div class="board">';
    for (var i=0; i<this.board.length; i++) {
        html += '<div class="row">';
        for (var j=0; j<this.board[i].length; j++) {
            html += '<div class="node" data-row="' + i + '" data-col="' + j + '">' + this.board[i][j] + '</div>';
        }
        html += '</div>';
    }
    html += '</div>';
    return html;
};

Board.prototype.get = function (row, col) {
    // render the board as html
    return this.board[row][col];
};