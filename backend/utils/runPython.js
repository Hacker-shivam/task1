import { spawn } from "child_process";

export const runPythonAnalysis = (data) => {
  return new Promise((resolve, reject) => {
    const process = spawn("python", [
      "python/analysis.py",
      JSON.stringify(data),
    ]);

    let result = "";
    let error = "";

    process.stdout.on("data", (data) => {
      result += data.toString();
    });

    process.stderr.on("data", (data) => {
      error += data.toString();
    });

    process.on("close", (code) => {
      if (code !== 0) {
        reject(error);
      } else {
        resolve(JSON.parse(result));
      }
    });
  });
};