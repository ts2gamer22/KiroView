import * as vscode from 'vscode';

export type ProblemsSnapshot = {
  errors: number;
  warnings: number;
};

export const readProblems = (): ProblemsSnapshot => {
  const diags = vscode.languages.getDiagnostics();
  let errors = 0;
  let warnings = 0;
  for (const [, arr] of diags) {
    for (const d of arr) {
      if (d.severity === vscode.DiagnosticSeverity.Error) errors += 1;
      else if (d.severity === vscode.DiagnosticSeverity.Warning) warnings += 1;
    }
  }
  return { errors, warnings };
};



