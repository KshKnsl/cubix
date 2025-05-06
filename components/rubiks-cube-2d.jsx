"use client"
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

// Color mapping
const COLORS = {
  0: { name: 'White', bg: 'bg-white', border: 'border-gray-300', text: 'text-black' },
  1: { name: 'Orange', bg: 'bg-orange-500', border: 'border-orange-700', text: 'text-white' },
  2: { name: 'Green', bg: 'bg-green-500', border: 'border-green-700', text: 'text-white' },
  3: { name: 'Red', bg: 'bg-red-500', border: 'border-red-700', text: 'text-white' },
  4: { name: 'Blue', bg: 'bg-blue-500', border: 'border-blue-700', text: 'text-white' },
  5: { name: 'Yellow', bg: 'bg-yellow-400', border: 'border-yellow-600', text: 'text-black' },
}

export default function RubiksCube2D() {
  // Initialize cube state with default values
  const [startState, setStartState] = useState([
    // Face 0 (Top/White)
    [[0, 0, 0], [0, 1, 2], [0, 3, 4]],
    // Face 1 (Front/Green)
    [[1, 1, 1], [3, 1, 2], [0, 1, 2]],
    // Face 2 (Left/Orange)
    [[2, 2, 2], [4, 2, 0], [1, 2, 3]],
    // Face 3 (Back/Blue)
    [[3, 3, 3], [2, 3, 5], [4, 3, 1]],
    // Face 4 (Right/Red)
    [[4, 4, 4], [1, 4, 0], [3, 4, 5]],
    // Face 5 (Bottom/Yellow)
    [[5, 5, 5], [5, 0, 1], [5, 2, 4]],
  ]);

  const [finalState, setFinalState] = useState([
    // Face 0 (Top/White)
    [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
    // Face 1 (Front/Green)
    [[1, 1, 1], [1, 1, 1], [1, 1, 1]],
    // Face 2 (Left/Orange)
    [[2, 2, 2], [2, 2, 2], [2, 2, 2]],
    // Face 3 (Back/Blue)
    [[3, 3, 3], [3, 3, 3], [3, 3, 3]],
    // Face 4 (Right/Red)
    [[4, 4, 4], [4, 4, 4], [4, 4, 4]],
    // Face 5 (Bottom/Yellow)
    [[5, 5, 5], [5, 5, 5], [5, 5, 5]],
  ]);

  const [solution, setSolution] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleColorChange = (faceIndex, rowIndex, colIndex, value, isStart) => {
    const colorValue = parseInt(value);
    if (isNaN(colorValue) || colorValue < 0 || colorValue > 5) return;

    if (isStart) {
      const newStartState = JSON.parse(JSON.stringify(startState));
      newStartState[faceIndex][rowIndex][colIndex] = colorValue;
      setStartState(newStartState);
    } else {
      const newFinalState = JSON.parse(JSON.stringify(finalState));
      newFinalState[faceIndex][rowIndex][colIndex] = colorValue;
      setFinalState(newFinalState);
    }
  };

  const solveCube = async () => {
    setLoading(true);
    setError(null);
    setSolution("");

    try {
      const response = await fetch('/api/rubix/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startState,
          finalState
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to solve the cube');
      }

      setSolution(data.output);
      toast({
        title: "Cube Solution",
        description: "Solution found successfully!",
      });
    } catch (err) {
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to render a cube face
  const renderFace = (faceIndex, faceName, isStart = true) => {
    const state = isStart ? startState : finalState;
    
    return (
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">{faceName}</h3>
        <div className="grid grid-cols-3 gap-1 w-[120px]">
          {[0, 1, 2].map((rowIndex) => (
            [0, 1, 2].map((colIndex) => {
              const colorValue = state[faceIndex][rowIndex][colIndex];
              const color = COLORS[colorValue];
              
              return (
                <div 
                  key={`${faceIndex}-${rowIndex}-${colIndex}`}
                  className={`w-9 h-9 flex items-center justify-center border ${color.border} ${color.bg} ${color.text} cursor-pointer`}
                  onClick={() => {
                    const newValue = (colorValue + 1) % 6;
                    handleColorChange(faceIndex, rowIndex, colIndex, newValue, isStart);
                  }}
                >
                  {colorValue}
                </div>
              );
            })
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Rubik's Cube Solver</h2>
      
      {/* Instructions */}
      <div className="p-4 bg-muted/20 rounded-lg">
        <h3 className="font-medium mb-2">Instructions:</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>Click on any square to cycle through the colors (0-5)</li>
          <li>Set up your initial and target cube configurations</li>
          <li>Click "Solve Cube" to find the solution</li>
        </ul>
        
        <div className="mt-3 grid grid-cols-3 gap-2">
          {Object.entries(COLORS).map(([value, color]) => (
            <div key={value} className="flex items-center space-x-1">
              <div className={`w-4 h-4 ${color.bg} ${color.border} border`}></div>
              <span className="text-xs">{value}: {color.name}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Start State */}
        <div>
          <h3 className="text-lg font-medium mb-3">Initial State</h3>
          <div className="grid grid-cols-3 gap-4">
            {renderFace(0, "Top Face (0)", true)}
            {renderFace(1, "Front Face (1)", true)}
            {renderFace(2, "Left Face (2)", true)}
            {renderFace(3, "Back Face (3)", true)}
            {renderFace(4, "Right Face (4)", true)}
            {renderFace(5, "Bottom Face (5)", true)}
          </div>
        </div>
        
        {/* Final State */}
        <div>
          <h3 className="text-lg font-medium mb-3">Target State</h3>
          <div className="grid grid-cols-3 gap-4">
            {renderFace(0, "Top Face (0)", false)}
            {renderFace(1, "Front Face (1)", false)}
            {renderFace(2, "Left Face (2)", false)}
            {renderFace(3, "Back Face (3)", false)}
            {renderFace(4, "Right Face (4)", false)}
            {renderFace(5, "Bottom Face (5)", false)}
          </div>
        </div>
      </div>
      
      {/* Solve Button */}
      <Button 
        className="w-full"
        onClick={solveCube}
        disabled={loading}
      >
        {loading ? "Solving..." : "Solve Cube"}
      </Button>
      
      {/* Solution Output */}
      {solution && (
        <div className="p-4 bg-muted rounded-lg">
          <h3 className="font-medium mb-2">Solution:</h3>
          <pre className="whitespace-pre-wrap text-sm">{solution}</pre>
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-100 text-red-800 rounded-lg">
          <h3 className="font-medium mb-2">Error:</h3>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
