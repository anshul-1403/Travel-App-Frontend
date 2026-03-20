const fs = require('fs');
const path = require('path');

const directory = 'c:/Users/darkh/Desktop/traveki/Travel-App-Frontend/src';
const searchRegex = /http:\/\/localhost:3200/g;
const replaceString = 'https://travel-app-backend-zvzh.onrender.com';

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.js') || file.endsWith('.jsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(directory);
let count = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (searchRegex.test(content)) {
        content = content.replace(searchRegex, replaceString);
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated ${file}`);
        count++;
    }
});
console.log(`Finished updating ${count} files.`);
