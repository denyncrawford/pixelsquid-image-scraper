import puppeteer from "https://deno.land/x/puppeteer@9.0.0/mod.ts";
import { join, resolve } from "https://deno.land/std@0.96.0/path/mod.ts";
import { green, red } from 'https://deno.land/std/fmt/colors.ts'

const homedir = Deno.env.get("HOME"),
args = Deno.args,
url = args[0];


if (!url) { 
    console.log(red('Por favor introduce una url valida'))
    Deno.exit();
}

let folder = args[1];
folder = folder ?  join(homedir || Deno.cwd(), folder) : Deno.cwd();

console.log(green(`Por favor espera...
`));

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.goto(url);
const img = await page.$eval(('.spinner > #signatureImage > img[src]'), node => node.src);

await browser.close();

/* @ts-ignore */
const filename = url.split("/")
.slice(-1)
.pop()
.split('?')[0] || 'squid';
const filepath = folder ? join(folder, `${filename}.jpg`) : resolve(`${filename}.jpg`);
console.log(green(`Guadando ${url} en ${filepath}
`));

/* @ts-ignore */
const data = (await fetch(img)).arrayBuffer();

await Deno.writeFile(filepath, new Uint8Array(await data));

console.log(green('Listo!'))