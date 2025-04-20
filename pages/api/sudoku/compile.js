import { exec } from 'child_process'
import path from 'path'
import fs from 'fs/promises'
import os from 'os'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Create temp directory if it doesn't exist
    const tempDir = path.join(os.tmpdir(), 'cubix-sudoku')
    try {
      await fs.mkdir(tempDir, { recursive: true })
    } catch (error) {
      console.error('Failed to create temp directory:', error)
    }

    // Source file paths with platform-specific executable extension
    const sourcePath = path.join(process.cwd(), 'cpp', 'sudoku_engine.cpp')
    const exeExt = os.platform() === 'win32' ? '.exe' : ''
    const uniqueExe = path.join(tempDir, `sudoku_engine${exeExt}`) // Correct the name to sudoku_engine

    // Check if source exists
    try {
      await fs.access(sourcePath)
    } catch (error) {
      return res.status(404).json({ error: 'Source file not found' })
    }

    // Platform-specific compilation command
    const compileCmd = `g++ "${sourcePath}" -o "${uniqueExe}" -O2` // Compile with the correct name

    // Compile to a unique temporary file
    const output = await new Promise((resolve, reject) => {
      exec(compileCmd, (error, stdout, stderr) => {
        if (error) {
          console.error('Compilation error:', error)
          reject(new Error(stderr || error.message))
          return
        }
        resolve(stdout)
      })
    })

    // Get the size of the compiled executable
    const stats = await fs.stat(uniqueExe)
    console.log('Compilation successful. Executable size:', stats.size)

    // Clean up old executables
    const files = await fs.readdir(tempDir)
    const oldFiles = files.filter(f => f.startsWith('sudoku_engine_') && f.endsWith(exeExt))
    for (const file of oldFiles) {
      try {
        await fs.unlink(path.join(tempDir, file))
      } catch (error) {
        console.error('Failed to delete old executable:', error)
      }
    }

    return res.status(200).json({ success: true, executablePath: uniqueExe })
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({ error: error.message })
  }
}
