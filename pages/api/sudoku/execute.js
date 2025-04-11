import { exec } from 'child_process'
import path from 'path'
import fs from 'fs/promises'
import os from 'os'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { command, args = [] } = req.body
    if (!command) {
      return res.status(400).json({ error: 'Command is required' })
    }

    // Validate board array length
    if (command === 'solve' || command === 'check') {
      if (!Array.isArray(args) || args.length !== 81) {
        return res.status(400).json({ error: 'Board must be exactly 81 numbers' })
      }
    } else if (command === 'hint') {
      if (!Array.isArray(args) || args.length !== 83) { // 81 board numbers + row + col
        return res.status(400).json({ error: 'Hint requires 81 board numbers plus row and col' })
      }
    }

    // Check both possible executable locations
    const tempDir = path.join(os.tmpdir(), 'cubix-sudoku')
    const executablePath = path.join(tempDir, 'sudoku_engine.exe')
    const altExecutablePath = path.join(tempDir, 'sudoku_engine_active.exe')
    
    let targetExecutable = executablePath
    
    try {
      await fs.access(executablePath)
    } catch (error) {
      try {
        await fs.access(altExecutablePath)
        targetExecutable = altExecutablePath
      } catch (error) {
        console.error('No executable found:', error)
        return res.status(500).json({ error: 'Sudoku engine not found. Please compile first.' })
      }
    }

    // Format command for PowerShell
    const cmdArgs = [command, ...args.map(arg => arg.toString())]
    const cmdLine = `& "${targetExecutable}" ${cmdArgs.join(' ')}`
    
    console.log('Executing command:', cmdLine)
    
    const output = await new Promise((resolve, reject) => {
      // Use PowerShell to execute the command
      exec(cmdLine, {
        shell: 'powershell.exe',
        timeout: 10000, // 10 second timeout
        maxBuffer: 1024 * 1024 // 1MB buffer
      }, (error, stdout, stderr) => {
        console.log('Execution result:', { error, stdout, stderr })
        if (error) {
          console.error('Execution error:', error)
          reject(error)
          return
        }
        if (stderr) {
          console.error('Stderr:', stderr)
          reject(new Error(stderr))
          return
        }
        resolve(stdout)
      })
    })

    return res.status(200).json({ output: output.trim() })
  } catch (error) {
    console.error('Handler error:', error)
    return res.status(500).json({ error: error.message })
  }
}
