import { randomUUID } from "crypto";
import * as esbuild from "esbuild";
import * as fs from "fs";
import * as path from "path";
import { format } from "prettier";

const temp = path.join(process.cwd(), "temp");

export default async function formatFile(text: string): Promise<string> {
  const uuid = randomUUID();
  const filePath = path.join(temp, uuid + ".js");

  fs.writeFileSync(filePath, text, { encoding: "utf-8" });

  esbuild.buildSync({
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
