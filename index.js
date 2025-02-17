const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, find, replace) {
    const data = fs.readFileSync(filePath, 'utf8');

    // Prevent replacing versions in `@since <version>` metadata
    const result = data.replace(new RegExp(`(?<!@since\\s)${find}`, 'g'), replace);
    
    fs.writeFileSync(filePath, result, 'utf8');
    if (fs.readFileSync(filePath, 'utf-8') == data) {
        return false;
    } else {
        return true;
    }
}

function replaceInDirectory(directory, find, replace) {
    fs.readdirSync(directory).forEach(file => {
        const fullPath = path.join(directory, file);
        
        if (!fullPath.match("node_modules") && !fullPath.match("node_modules") && !fullPath.match(".vscode")) {
            if (fs.lstatSync(fullPath).isDirectory()) {
                // Recursively handle subdirectories
                replaceInDirectory(fullPath, find, replace);
            } else {
                // Handle files
                const isReplaced = replaceInFile(fullPath, find, replace);
                if (isReplaced) {
                    console.log("changed version metadata of " + path.basename(fullPath) + " to " + replace);
                }
            }
        }
    });
}

function incrementVersion(version, type) {
    const prefixMatch = version.match(/^[^\d]*/);
    const prefix = prefixMatch ? prefixMatch[0] : '';

    version = version.slice(prefix.length);

    let [major, minor, patch] = version.split('.').map(Number);

    if (type === 'major') {
        major += 1;
        minor = 0;
        patch = 0;
    } else if (type === 'minor') {
        minor += 1;
        patch = 0;
    } else if (type === 'patch') {
        patch += 1;
    } else {
        throw new Error('Invalid type. Type must be "major", "minor", or "patch".');
    }

    return `${prefix}${major}.${minor}.${patch}`;
}

function bump(version, type) {
    const incremented = incrementVersion(version, type);
    replaceInDirectory(process.cwd() + "/", version, incremented);
}

function setVersion(version, newVersion) {
    replaceInDirectory(process.cwd() + "/", version, newVersion);
}

module.exports = { bump, setVersion, incrementVersion };
