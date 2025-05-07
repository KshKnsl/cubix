'use client';

import { useEffect, useState } from 'react';
import { SudokuService } from '@/lib/services/sudoku-service';
import { SliderService } from '@/lib/services/slider-service';
import { RubixService } from '@/lib/services/rubix-service';

/**
 * This component handles the initialization of WebAssembly modules.
 * It ensures that all WASM modules are loaded before users interact with them.
 */
export default function WasmInitializer() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeWasm = async () => {
      try {
        setIsLoading(true);

        // Initialize all WASM modules in parallel
        const initPromises = [
          SudokuService.initSolver(),
          SliderService.initSolver(),
          RubixService.initSolver()
        ];

        await Promise.all(initPromises);
        
        console.log('All WebAssembly modules initialized successfully');
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to initialize WebAssembly modules:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    initializeWasm();
  }, []);

  // This component doesn't render anything visible,
  // just initializes the WebAssembly modules
  return null;
}