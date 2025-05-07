"use client"
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { RubixService } from "@/lib/services/rubix-service"

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
    [[0, 0, 0], [0, 5, 5], [0, 3, 4]],
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

  // Compile the Rubix solver when component mounts
  useEffect(() => {
    const compileSolver = async () => {
      try {
        await RubixService.compileSolver();
        console.log("Rubik's Cube solver compiled successfully");
      } catch (err) {
        console.error("Failed to compile Rubik's Cube solver:", err);
        setError("Failed to initialize solver. Please try again later.");
      }
    };
    
    compileSolver();
  }, []);

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

  // Helper function to validate cube state (9 tiles of each color)
  const validateCubeState = (state) => {
    // Count occurrences of each color
    const colorCounts = {0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
    
    // Iterate through the cube state and count each color
    for (let face = 0; face < 6; face++) {
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          const color = state[face][row][col];
          if (color >= 0 && color <= 5) {
            colorCounts[color]++;
          } else {
            return { valid: false, message: `Invalid color value found: ${color}` };
          }
        }
      }
    }
    
    // Check if each color appears exactly 9 times
    for (let color = 0; color <= 5; color++) {
      if (colorCounts[color] !== 9) {
        return { 
          valid: false, 
          message: `Invalid configuration: Color ${color} (${COLORS[color].name}) appears ${colorCounts[color]} times. Each color must appear exactly 9 times.`
        };
      }
    }
    
    return { valid: true };
  };

  const solveCube = async () => {
    setLoading(true);
    setError(null);
    setSolution("");

    // Validate the start state
    const startStateValidation = validateCubeState(startState);
    if (!startStateValidation.valid) {
      setError(`Initial state error: ${startStateValidation.message}`);
      toast({
        variant: "destructive",
        title: "Invalid Initial State",
        description: startStateValidation.message,
      });
      setLoading(false);
      return;
    }

    // Validate the final state
    const finalStateValidation = validateCubeState(finalState);
    if (!finalStateValidation.valid) {
      setError(`Target state error: ${finalStateValidation.message}`);
      toast({
        variant: "destructive",
        title: "Invalid Target State",
        description: finalStateValidation.message,
      });
      setLoading(false);
      return;
    }

    try {
      // Use the RubixService instead of direct API call
      const result = await RubixService.solvePuzzle(startState, finalState);
      setSolution(result.output);
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
