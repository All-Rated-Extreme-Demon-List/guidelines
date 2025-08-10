import fs from "fs";

console.log("Building guidelines data...");

const data = [];
const ignored = fs.readFileSync("./.gitignore", "utf-8").split("\n");

fs.readdirSync("./")
    .forEach(file => {
        if (file.startsWith(".")) return;
        if (ignored.includes(file)) return;
        if (fs.statSync(file).isDirectory()) {
            const contents = fs.readdirSync(file)
                .filter((file) => file !== "index.md")
                .sort((f1, f2) => f1.localeCompare(f2));
            data.push({
                name: file,
                contents: contents,
            });
        }
        if (file.endsWith(".md")) {
            data.push(file);
        }
    });

data.sort(
    (f1, f2) => 
        (typeof f1 === "string") - (typeof f2 === "string") || 
        (typeof f1 === "string" ? f1.localeCompare(f2.name) : f1.name.localeCompare(f2))
);

fs.writeFileSync("./_index.json", JSON.stringify(data, null, 4));

console.log("Guidelines data building done.")