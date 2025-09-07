import fs from "fs";

console.log("Building guidelines data...");

const guidelinesPath = "./";

const ignored = fs.readFileSync("./.gitignore", "utf-8").split("\n");

const files = []


fs.readdirSync(guidelinesPath).forEach(file => {
    let fileStr = "";
    if (file.startsWith(".")) return;
    if (ignored.includes(file)) return;
    if (!fs.statSync(file).isDirectory()) return;

    const indexFileResponse = fs.readFileSync(`${guidelinesPath}${file}/index.md`, "utf-8");
    fileStr += indexFileResponse.trim() + "\n\n";
    fs.readdirSync(`${guidelinesPath}${file}`).forEach(subfile => {
        if (subfile == "index.md") return;
        if (ignored.includes(subfile)) return;
        if (fs.statSync(`${guidelinesPath}${file}/${subfile}`).isDirectory()) return;
        
        const subfileContent = fs.readFileSync(`${guidelinesPath}${file}/${subfile}`, "utf-8");
        fileStr += subfileContent.trim() + "\n\n";
    });
    files.push(fileStr);


})

fs.writeFileSync("./data.json", JSON.stringify(files));

console.log("Guidelines data building done.")

