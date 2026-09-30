import fs from "fs";

console.log("Building guidelines data...");

const lists = ["Classic", "Platformer"];
const ignored = fs.readFileSync("./.gitignore", "utf-8").split(/\r?\n/);

lists.forEach(list => {
    const guidelinesPath = `./${list}`;
    const files = [];

    fs.readdirSync(guidelinesPath).forEach(file => {
        const filePath = `${guidelinesPath}/${file}`;
        if (file.startsWith(".")) return;
        if (ignored.includes(file)) return;
        if (!fs.statSync(filePath).isDirectory()) return;

        let fileStr = fs.readFileSync(`${filePath}/index.md`, "utf-8").trim() + "\n\n";
        fs.readdirSync(filePath).forEach(subfile => {
            const subfilePath = `${filePath}/${subfile}`;
            if (subfile == "index.md") return;
            if (ignored.includes(subfile)) return;
            if (fs.statSync(subfilePath).isDirectory()) return;

            const subfileContent = fs.readFileSync(subfilePath, "utf-8");
            fileStr += subfileContent.trim() + "\n\n";
        });
        files.push(fileStr);
    });

    const outputFile = `${guidelinesPath}/data.json`;
    fs.writeFileSync(outputFile, JSON.stringify(files));
    console.log(`Built ${outputFile}`);
});

console.log("Guidelines data building done.")

