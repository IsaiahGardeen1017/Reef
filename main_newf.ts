import { padEqual, padRepeat } from "./utils/strUtils.ts";
import { getTerminalSize } from "./utils/terminalUtils.ts";

// main.ts
let previousRows: string[] | null = null;

async function main() {
  Deno.stdin.setRaw(true);

  renderScreen();

  // Listen for 'q' key press to exit
  const keyPressListener = async () => {
    for await (const event of Deno.stdin.readable) {
      const chunk = new TextDecoder().decode(event);
      if (chunk === "q") {
        Deno.stdin.setRaw(false);
        Deno.exit(0); // Exit the program
      }
    }
  };

  // Start listening for key presses in a separate task.
  keyPressListener();

  while (true) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    renderScreen();
  }
}

function renderScreen() {
  const currentRows = drawScreen();
  updateScreen(currentRows);
  previousRows = currentRows; // Store current rows for next update
}

function updateScreen(currentRows: string[]) {
  if (!previousRows) {
    // Initial render: write the entire screen
    writeToConsole("\x1b[2J\x1b[H" + currentRows.join("\n"));
    return;
  }

  const height = currentRows.length;
  for (let i = 0; i < height; i++) {
    if (currentRows[i] !== previousRows[i]) {
      // Line has changed: move cursor and overwrite the line
      const command = `\x1b[${i + 1};1H${currentRows[i]}\x1b[K`; // Move to row i+1, column 1, write row, clear to end of line
      writeToConsole(command);
    }
  }
}

function writeToConsole(str: string) {
  const encoder = new TextEncoder();
  Deno.stdout.writeSync(encoder.encode(str));
}

function drawScreen(): string[] {
  const hw = getTerminalSize();

  const textRows = [];
  for (let i = 0; i < hw.h; i++) {
    if (i === 0 || i === hw.h - 1) {
      textRows.push(padRepeat("-*", hw.w));
    } else if (i === Math.floor(hw.h / 2)) {
      textRows.push(padEqual("Hello!", hw.w));  
    } else if (i === Math.floor(hw.h / 2) + 1) {
      textRows.push(padEqual(`h:${hw.h} w:${hw.w}`, hw.w));
    } else {
      textRows.push(padRepeat(" ", hw.w));
    }
  }
  return textRows;
}

main();
