
import ANSI from "../../var/ansi.js";

export function clean() {
    const ansi = ANSI();
    process.stdout.write(
        ansi.clearScrenBuffer +
        ansi.clearScrollBackBuffer +
        "\x1b[2;1H"
    );
    return void 0;
}

export function clear() {
    const ansi = ANSI();
    process.stdout.write(ansi.clearScrenBuffer + "\x1b[2;1H");
    return void 0;
}