import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

async function bootstrap() {
  // Wait for the DOM
  await new Promise<void>((resolve) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => resolve());
    } else {
      resolve();
    }
  });

  const rootElement = document.getElementById("root");
  if (!rootElement) return;

  try {
    const root = createRoot(rootElement);
    root.render(<App />);
  } catch (error) {
    rootElement.innerHTML = `
      <div style="padding: 40px; font-family: monospace;">
        <h1 style="color: red;">Error Loading App</h1>
        <pre>${error}</pre>
      </div>
    `;
  }
}

// 🚀 Start app
bootstrap();
