import sharp from "sharp";
import fs from "fs";
import path from "path";
const prefix = (s: string) => path.join(process.cwd(), s);
const nose = "images/nose.png";

export async function GET(request: Request) {
  let params = new URL(request.url).searchParams;
  let key = params.get("key");

  if (!key) {
    return new Response("No key", { status: 400 });
  }

  let hash = hashString(key);
  let keyArray = generateKey(hash, files.length);
  let selectedFiles = files.map((fileArray, index) => {
    let fileIndex = Math.floor(keyArray[index] * fileArray.length);
    return fileArray[fileIndex];
  });

  let buffer = await sharp(nose)
    .composite(
      selectedFiles.map((file) => {
        return {
          input: prefix(file),
          blend: "over",
        };
      })
    )
    .toBuffer();

  let response = new Response(buffer, {
    headers: {
      "Content-Type": "image/png",
    },
  });

  return response;
}

function hashString(str: string): number {
  let hash = 0;
  if (str.length == 0) {
    return hash;
  }
  for (let i = 0; i < str.length; i++) {
    let char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }

  return hash;
}

function generateKey(startHash: number, length: number): number[] {
  let seed = startHash ^ 0xdeadbeef; // 32-bit seed with optional XOR value
  // Pad seed with Phi, Pi and E.
  // https://en.wikipedia.org/wiki/Nothing-up-my-sleeve_number
  let rand = sfc32(0x9e3779b9, 0x243f6a88, 0xb7e15162, seed);
  let key = new Array(length);

  for (let i = 0; i < length; i++) {
    key[i] = rand();
  }

  return key;
}

function sfc32(a: number, b: number, c: number, d: number) {
  return function () {
    a >>>= 0;
    b >>>= 0;
    c >>>= 0;
    d >>>= 0;
    var t = (a + b) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    d = (d + 1) | 0;
    t = (t + d) | 0;
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  };
}

function getFiles(dir: string): any[] {
  // get all 'files' in this directory
  var all = fs.readdirSync(dir);

  // process each checking directories and saving files
  return all.map((file) => {
    // am I a directory?
    if (fs.statSync(`${dir}/${file}`).isDirectory()) {
      // recursively scan me for my files
      return getFiles(`${dir}/${file}`);
    }
    return `${dir}/${file}`;
  });
}

const files = [
  [
    "images/backgrounds/blue50.png",
    "images/backgrounds/blue60.png",
    "images/backgrounds/blue70.png",
    "images/backgrounds/darkblue30.png",
    "images/backgrounds/darkblue50.png",
    "images/backgrounds/darkblue70.png",
    "images/backgrounds/green50.png",
    "images/backgrounds/green60.png",
    "images/backgrounds/green70.png",
    "images/backgrounds/grey40.png",
    "images/backgrounds/grey70.png",
    "images/backgrounds/grey80.png",
    "images/backgrounds/red50.png",
    "images/backgrounds/red60.png",
    "images/backgrounds/red70.png",
    "images/backgrounds/yellow50.png",
    "images/backgrounds/yellow60.png",
    "images/backgrounds/yellow70.png",
  ],
  [
    "images/neck/bend-backward.png",
    "images/neck/bend-forward.png",
    "images/neck/default.png",
    "images/neck/thick.png",
  ],
  [nose],
  [
    "images/ears/default.png",
    "images/ears/tilt-backward.png",
    "images/ears/tilt-forward.png",
  ],

  [
    "images/hair/bang.png",
    "images/hair/curls.png",
    "images/hair/default.png",
    "images/hair/elegant.png",
    "images/hair/fancy.png",
    "images/hair/quiff.png",
    "images/hair/short.png",
  ],
  [
    "images/leg/bubble-tea.png",
    "images/leg/cookie.png",
    "images/leg/default.png",
    "images/leg/game-console.png",
    "images/leg/tilt-backward.png",
    "images/leg/tilt-forward.png",
  ],
  [
    "images/mouth/astonished.png",
    "images/mouth/default.png",
    "images/mouth/eating.png",
    "images/mouth/laugh.png",
    "images/mouth/tongue.png",
  ],

  [
    "images/eyes/angry.png",
    "images/eyes/default.png",
    "images/eyes/naughty.png",
    "images/eyes/panda.png",
    "images/eyes/smart.png",
    "images/eyes/star.png",
  ],
  [
    "images/accessories/earings.png",
    "images/accessories/flower.png",
    "images/accessories/glasses.png",
    "images/accessories/headphone.png",
  ],
];
