

/**
 * A CLI middleware that checks and ensure a user has the neccessary permissions to execute
 * a secure command.
 * 
 * @param {Array} args - The command line arguments.
 * @param {object} next - The callback function which represents the actual command handler.
 * 
 * This middleware would pass an argument to the callback function: `args` argument which is 
 * the command line argument, but without the `--grant` argument.
 * @returns {void}
 */
export default function Securecommand(args, next) {
    const cliPassword = process.env["admin.psw"];
    const passwordKeyword = "--grant:";
    let password = args.find(arg => arg.startsWith(passwordKeyword));

    if (password) password = password.split(passwordKeyword)[1]
    else password = "chronos"

    if (password === "") password = "chronos"

    if (cliPassword && cliPassword === password) {
       next(args.filter(e => !e.startsWith(passwordKeyword)));
    } else console.log("\nPermission denied!\n%s: Incorrect password\n", password);
}
