import { createCanvas } from "@napi-rs/canvas";
import axios from "axios";

import { Buffer } from "buffer";
import * as fs from "node:fs";

const canvas = createCanvas(700, 250);
const ctx = canvas.getContext("2d");

ctx.strokeStyle = '64px #c1fcce';
ctx.strokeText("Hello, world!",350,100,64);

export default async function generateImage() {
    const data = await canvas.encode("png");
    fs.writeFileSync("./test.png",data);    
}
generateImage();
// axios
//   .get(
//     "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpreview.redd.it%2Fhxrf3ywv30k51.jpg%3Fauto%3Dwebp%26s%3Db4474098f5dd3c0eded0cf10863fc95fa6e7bead&f=1&nofb=1&ipt=59d18f59c8283319f4ff259828ba99da985f9f77f07db3f91b4fe2146b39ce92&ipo=images"
//   )
//   .then((res) => {
//     fs.writeFileSync("./bg.jpg", res.data);
//   });
