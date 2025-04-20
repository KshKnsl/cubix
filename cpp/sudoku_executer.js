class SudokuExecuter {
    constructor() {
        this.board = Array(9).fill().map(() => Array(9).fill(''));
        this.executablePath = null;
    }

    async initialize() {
        try {
            const baseUrl = process.env.NODE_ENV === 'production' 
                ? 'https://kushkansal.me/cubix'
                : '';
            const response = await fetch(`${baseUrl}/api/sudoku/compile`, {
                method: 'POST'
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to compile engine');
            }

            const result = await response.json();
            this.executablePath = result.executablePath.replace(/\.exe\.exe$/, '.exe'); // Fix double .exe issue
            return true;
        } catch (error) {
            console.error('Failed to initialize:', error);
            throw error;
        }
    }

    // Convert 2D board to flat array of numbers
    boardToArray() {
        return this.board.flat().map(cell => cell === '' ? '0' : cell);
    }

    async execute(command, args) {
        if (!this.executablePath) {
            console.error('Engine not initialized');
            throw new Error('Engine not initialized');
        }

        try {
            const response = await fetch('/api/sudoku/execute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ command, args })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Command failed');
            }

            const { output } = await response.json();
            if (output.startsWith('Error:')) {
                throw new Error(output.substring(7));
            }
            return output;
        } catch (error) {
            console.error('Execute failed:', error);
            throw error;
        }
    }

    async setBoard(board) {
        this.board = board.map(row => [...row]);
        return true;
    }

    async solve() {
        const boardArray = this.boardToArray();
        const result = await this.execute('solve', boardArray);
        return result.split(',').map(n => n === '0' ? '' : n);
    }

    async check() {
        const boardArray = this.boardToArray();
        const result = await this.execute('check', boardArray);
        return result === 'Valid';
    }

    async hint(row, col) {
        console.log('Hint requested for cell:', row, col);
        const boardArray = this.boardToArray();
        const args = [...boardArray, row.toString(), col.toString()];
        const result = await this.execute('hint', args);
        const hint = parseInt(result);
        return isNaN(hint) ? null : hint;
    }
}

export default SudokuExecuter;
