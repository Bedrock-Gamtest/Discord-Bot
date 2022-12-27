import { randomUUID } from "crypto";
import * as esbuild from "esbuild";
import * as fs from "fs";
import * as path from "path";
import { format } from "prettier";

const temp = path.join(process.cwd(), "temp");
if (!fs.existsSync(temp)) fs.mkdirSync(temp);

export async function formatFile(text: string, compact: boolean = false): Promise<string> {
  const uuid = randomUUID();
  const filePath = path.join(temp, uuid + ".js");

  fs.writeFileSync(filePath, text, { encoding: "utf-8" });

  if (compact) esbuild.buildSync({
    outdir: temp,
    entryPoints: [filePath],
    minifySyntax: true,
    allowOverwrite: true,
  });

  text = fs.readFileSync(filePath, { encoding: "utf-8" });
  text = format(text, {
    semi: true,
    parser: "babel",
    tabWidth: 2,
    useTabs: true,
  });
  if (fs.existsSync(filePath)) fs.rmSync(filePath);
  return text;
}
export default formatFile;