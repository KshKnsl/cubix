import { exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const code = await fs.readFile("demo.cpp", 'utf-8');
const stdin = "5 1 2 3 4 5";

try 
{
    const tempFilePath = path.join(__dirname, 'temp.cpp');
    const executablePath = path.join(__dirname, 'temp.exe');
    await fs.writeFile(tempFilePath, code);

    exec(`g++ ${tempFilePath} -o ${executablePath}`, async (compileError, compileStdout, compileStderr) => {
      if (compileError || compileStderr) 
      {
        console.log({ output: compileStderr || compileError.message });
        return;
      }
      else{
        console.log("compiledSuccessfully");
      }
      console.log(compileStdout);

      // Execute the compiled code with stdin
      const process = exec(executablePath);
      process.stdin.write(stdin);
      process.stdin.end();

      let stdout = '';
      let stderr = '';

      process.stdout.on('data', (data) => {
        stdout += data;
      });

      process.stderr.on('data', (data) => {
        stderr += data;
      });

      process.on('close', (exitCode) => {
        if (exitCode !== 0 && stderr.length > 0) {
          console.log({ output: stderr });
        } else {
          console.log({ output: stdout });
        }
        // Clean up temporary files (important!)
        fs.unlink(tempFilePath).catch(() => {});
        fs.unlink(executablePath).catch(() => {});
      });
    });
  } catch (error) {
    console.log(error);
  }