import { padEqual, padRepeat } from "./utils/strUtils.ts";
import { getTerminalSize } from "./utils/terminalUtils.ts";



main();

// main.ts
let resizeTimeout: number | null = null;

async function main() {
  Deno.stdin.setRaw(true);


  renderScreen();

  while (true) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    renderScreen();
  }

  Deno.stdin.setRaw(false);
}

function debouncedHandleResize() {
  if (resizeTimeout) {
    clearTimeout(resizeTimeout);
  }
  resizeTimeout = setTimeout(() => {
    resizeTimeout = null;
    handleResize();
  }, 100); // 100ms debounce time
}

function handleResize() {
  renderScreen();
}

function renderScreen() {
  clearScreen();
  const textRows = drawScreen();
  textRows.forEach((row) => {
    console.log(row);
  });
}

function clearScreen() {
  console.log("\x1b[2J\x1b[H"); // Clear screen and move cursor to top-left
}

function drawScreen(): string[] {
  const hw = getTerminalSize();

  const textRows = [];
  for (let i = 0; i < hw.h; i++) {
    if (i === 0 || i === hw.h - 1) {
      textRows.push(padRepeat('-*', hw.w));
    } else if (i === Math.floor(hw.h / 2)) {
      textRows.push(padEqual('Hello!', hw.w));
    } else {
      textRows.push(padRepeat(' ', hw.w));
    }
  };
  return textRows;
}