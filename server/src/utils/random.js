

const char = [
  "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t",
  "u", "v", "w", "x", "y", "z"
];

export function randString(length) {
  let rand = "";
  for (let i = 0; i < length; i++) {
  	rand += char[Math.floor(Math.random() * char.length)]
  }
  return rand;
}
