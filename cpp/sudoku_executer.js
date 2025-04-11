class SudokuExecuter {
    constructor() {
        this.initialized = false;
        this.boardSet = false;
    }

    async initialize() {
        try {
            const response = await fetch('/api/sudoku/compile', {
                method: 'POST'
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to compile engine');
            }
            this.initialized = true;
        } catch (error) {
            console.error('Failed to initialize Sudoku engine:', error);
            throw error;
        }
    }

    async execute(args) {
        if (!this.initialized) {
            await this.initialize();
        }

        try {
            console.log('Executing with args:', args);
            const response = await fetch('/api/sudoku/execute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ args })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Engine execution failed');
            }

            const result = await response.json();
            console.log('Engine response:', result);
            return result.output || result;
        } catch (error) {
            console.error('Engine execution failed:', error);
            throw error;
        }
    }

    async setBoard(board) {
        // Ensure board is a 2D array
        if (!Array.isArray(board) || !Array.isArray(board[0])) {
            board = Array.from({ length: 9 }, (_, i) => 
                board.slice(i * 9, (i + 1) * 9)
            );
        }

        // Convert empty strings or null to 0s for the engine
        const engineBoard = board.map(row => 
            row.map(cell => {
                if (cell === '' || cell === null) return 0;
                const num = parseInt(cell);
                return isNaN(num) ? 0 : num;
            })
        );

        // Flatten and convert to string array for the engine
        const args = ['set', ...engineBoard.flat().map(String)];
        await this.execute(args);
        this.boardSet = true;
        return true;
    }

    async solve() {
        if (!this.boardSet) {
            throw new Error('Board must be set before solving');
        }
        return this.execute(['solve']);
    }

    async checkValidity() {
        if (!this.boardSet) {
            throw new Error('Board must be set before checking validity');
        }
        return this.execute(['check']);
    }

    async getHint(row, col) {
        if (!this.boardSet) {
            throw new Error('Board must be set before getting hints');
        }
        return this.execute(['hint', row.toString(), col.toString()]);
    }

    async getSolution() {
        if (!this.boardSet) {
            throw new Error('Board must be set before getting solution');
        }
        return this.execute(['solution']);
    }

    cleanup() {
        this.initialized = false;
        this.boardSet = false;
    }
}

export default SudokuExecuter;
