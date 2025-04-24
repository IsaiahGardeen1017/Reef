import { intStringFixed, padEqual, padRepeat } from "./utils/strUtils.ts";
import { getTerminalSize, TerminalSize } from "./utils/terminalUtils.ts";


async function main() {
    Deno.stdin.setRaw(true);

    let lastSize = getTerminalSize();
    let redraw = true;
    renderScreen(lastSize);

    // Listen for 'q' key press to exit
    const keyPressListener = async () => {
        for await (const event of Deno.stdin.readable) {
            const chunk = new TextDecoder().decode(event);
            if (chunk === "q") {
                Deno.stdin.setRaw(false);
                Deno.exit(0); // Exit the program
            }
            if(chunk === "r") {
                redraw = true;
            }
        }
    };

    // Start listening for key presses in a separate task.
    keyPressListener();


    while (true) {
        await new Promise((resolve) => setTimeout(resolve, 100));

        const newSize = getTerminalSize();
        if (newSize.h !== lastSize.h || newSize.w !== lastSize.w) {
            redraw = true;
        }
        if (redraw) {
            renderScreen(newSize);
            lastSize = newSize;
            redraw = false;
        }
    }
}

function renderScreen(size: TerminalSize) {
    const textRows = drawScreen(size);
    writeToConsole("\x1b[2J\x1b[H" + textRows.join("\n"));
}

function writeToConsole(str: string) {
    const encoder = new TextEncoder();
    Deno.stdout.writeSync(encoder.encode(str));
}


function drawScreen(size: TerminalSize): string[] {
    const textRows = [];
    for (let i = 0; i < size.h; i++) {
        const greer = intStringFixed(i, 3);
        if (i === 0 || i === size.h - 1) {
            textRows.push(greer + padRepeat("-*", size.w - 3));
        } else if (i === Math.floor(size.h / 2)) {
            textRows.push(greer + padEqual("Hello!", size.w - 3));
        } else if (i === Math.floor(size.h / 2) + 1) {
            textRows.push(greer + padEqual(`h:${size.h} w:${size.w}`, size.w - 3));
        } else {
            textRows.push(greer + padRepeat(" ", size.w - 3));
        }
    }
    return textRows;
}



main();
