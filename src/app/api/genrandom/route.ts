import sharp from "sharp";
import fs from "fs";
const nose = "public/images/nose.png";

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
          input: file,
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
    "public/images/backgrounds/blue50.png",
    "public/images/backgrounds/blue60.png",
    "public/images/backgrounds/blue70.png",
    "public/images/backgrounds/darkblue30.png",
    "public/images/backgrounds/darkblue50.png",
    "public/images/backgrounds/darkblue70.png",
    "public/images/backgrounds/green50.png",
    "public/images/backgrounds/green60.png",
    "public/images/backgrounds/green70.png",
    "public/images/backgrounds/grey40.png",
    "public/images/backgrounds/grey70.png",
    "public/images/backgrounds/grey80.png",
    "public/images/backgrounds/red50.png",
    "public/images/backgrounds/red60.png",
    "public/images/backgrounds/red70.png",
    "public/images/backgrounds/yellow50.png",
    "public/images/backgrounds/yellow60.png",
    "public/images/backgrounds/yellow70.png",
  ],
  [
    "public/images/neck/bend-backward.png",
    "public/images/neck/bend-forward.png",
    "public/images/neck/default.png",
    "public/images/neck/thick.png",
  ],
  [nose],
  [
    "public/images/ears/default.png",
    "public/images/ears/tilt-backward.png",
    "public/images/ears/tilt-forward.png",
  ],

  [
    "public/images/hair/bang.png",
    "public/images/hair/curls.png",
    "public/images/hair/default.png",
    "public/images/hair/elegant.png",
    "public/images/hair/fancy.png",
    "public/images/hair/quiff.png",
    "public/images/hair/short.png",
  ],
  [
    "public/images/leg/bubble-tea.png",
    "public/images/leg/cookie.png",
    "public/images/leg/default.png",
    "public/images/leg/game-console.png",
    "public/images/leg/tilt-backward.png",
    "public/images/leg/tilt-forward.png",
  ],
  [
    "public/images/mouth/astonished.png",
    "public/images/mouth/default.png",
    "public/images/mouth/eating.png",
    "public/images/mouth/laugh.png",
    "public/images/mouth/tongue.png",
  ],

  [
    "public/images/eyes/angry.png",
    "public/images/eyes/default.png",
    "public/images/eyes/naughty.png",
    "public/images/eyes/panda.png",
    "public/images/eyes/smart.png",
    "public/images/eyes/star.png",
  ],
  [
    "public/images/accessories/earings.png",
    "public/images/accessories/flower.png",
    "public/images/accessories/glasses.png",
    "public/images/accessories/headphone.png",
  ],
];
