import puppeteer from 'puppeteer'
import fs from 'fs'
import path from 'path';
import axios from 'axios'
import os from 'os'
const homedir = os.homedir();

const args = process.argv,
url = args[2];
let folder = args[3]

if (folder) folder = folder === "Downloads" ? path.join(homedir, folder) : folder;

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.goto(url);
const img = await page.$eval(('.spinner > #signatureImage > img[src]'),node => node.src);

await browser.close();

let { data } = await axios.get(img, {
  responseType: 'stream'
})

const filename = url.split("/")
.slice(-1)
.pop()
.split('?')[0];
let filepath = folder ? path.join(folder, `${filename}.jpg`) : path.resolve(`${filename}.jpg`);
const writer = fs.createWriteStream(filepath);

data.pipe(writer)

await new Promise((resolve, reject) => {
  writer.on('finish', resolve)
  writer.on('error', reject)
})