#!/usr/bin/env node
const { ArgumentParser } = require('argparse');


const parser = new ArgumentParser({
    description: 'utilities for working with files.',
});

parser.add_argument('-b', '--bump', {help: "increments the version of all files", "choices": ["major", "minor", "patch"]});
parser.add_argument('-s', '--set-version', {help: "sets the version of all files", metavar: "<version>"});
parser.add_argument("-p", "--project-version", {help: "prints the current version of your project", action: "store_true"})
parser.add_argument("--delete-config", {help: "deletes the config file stored on your device. note that you might need to enter your configuration again!", action: "store_true"})

const fs = require('fs');

function readLineSync() {
    const bufferSize = 1024;
    const buffer = Buffer.alloc(bufferSize);

    // File descriptor for stdin (0 is the standard input file descriptor)
    const bytesRead = fs.readSync(0, buffer, 0, bufferSize, null);
    
    // Convert buffer to string and trim any trailing newline or carriage return characters
    const input = buffer.toString('utf8', 0, bytesRead).trim();

    return input;
}

const os = require('os');
const crypto = require('crypto');
const { bump } = require('projectutils');
function sha1(input) {
    return crypto.createHash('sha1').update(input).digest('hex');
}
function createDirs() {
    try {
        fs.mkdirSync(homeDir+"/.cache")
    } catch {

    } finally {
        try {
            fs.mkdirSync(homeDir+"/.cache/projectutils")
        } catch {}
    }
    
}
const homeDir = os.homedir();
const args = parser.parse_args()
function getVersion() {
    try {
        
        return require(process.cwd()+"/package.json")
    } catch {
        try {
            console.log("package.json doesn't exist, reading from config...")
             return JSON.parse(fs.readFileSync(homeDir+"/.cache/projectutils/"+sha1(process.cwd())+".json"));
             
        } catch {
            console.error("error: cannot resolve current version")
            console.log("enter your current version (only once): ")
            const version = readLineSync();
            const data = {
                path: process.cwd(),
                version,
            }
            
            
            fs.writeFileSync(homeDir+"/.cache/projectutils/"+sha1(process.cwd())+".json", JSON.stringify(data));
            return data;
        }
       
    }
}
createDirs();
if (args.bump) {
    console.log("reading from your package.json...")
    let packageFile =getVersion();
  
    const packageVersion = packageFile.version;
    if (!packageVersion) {
        console.error("error: version is undefined, so configure again")
           console.log("enter your current version (only once): ")
           const version = readLineSync();
           const data = {
               path: process.cwd(),
               version,
           }
           packageFile = data;
           
           fs.writeFileSync(homeDir+"/.cache/projectutils/"+sha1(process.cwd())+".json", JSON.stringify(data));
    }
        projectutils.bump(packageVersion, args.bump)
        let data = packageFile = JSON.parse(fs.readFileSync(homeDir+"/.cache/projectutils/"+sha1(process.cwd())+".json"));
        data.version = projectutils.incrementVersion(packageVersion, args.bump)
        fs.writeFileSync(homeDir+"/.cache/projectutils/"+sha1(process.cwd())+".json", JSON.stringify(data));
        console.log("bumped version to "+projectutils.incrementVersion(packageVersion, args.bump)+" successfully")
    
} else if (args["set_version"]) {
    console.log("reading from your package.json...")
    let packageFile =getVersion();

   
    const packageVersion = packageFile.version;
    if (!packageVersion) {
        console.error("error: version is undefined, so configure again")
           console.log("enter your current version (only once): ")
           const version = readLineSync();
           const data = {
               path: process.cwd(),
               version,
           }
           packageFile = data;
           
           fs.writeFileSync(homeDir+"/.cache/projectutils/"+sha1(process.cwd())+".json", JSON.stringify(data));
    }
        projectutils.setVersion(packageFile.version, args.set_version,)
        let data = packageFile = JSON.parse(fs.readFileSync(homeDir+"/.cache/projectutils/"+sha1(process.cwd())+".json"));
        data.version = args.set_version
        fs.writeFileSync(homeDir+"/.cache/projectutils/"+sha1(process.cwd())+".json", JSON.stringify(data));
        console.log("set version to "+args.set_version+" successfully")
} else if (args.project_version) {
    console.log("reading from your package.json...")
    let packageFile =getVersion();
  
    const packageVersion = packageFile.version;
    if (!packageVersion) {
        console.error("error: version is undefined, so configure again")
           console.log("enter your current version (only once): ")
           const version = readLineSync();
           const data = {
               path: process.cwd(),
               version,
           }
           packageFile = data;
           
           fs.writeFileSync(homeDir+"/.cache/projectutils/"+sha1(process.cwd())+".json", JSON.stringify(data));
           console.warn("warning: re-run with -p argument to get version")
    }
    console.log("\nyour project version: "+packageVersion)
} else if (args.delete_config) {
    console.log("deleting your config...")
    try {
        fs.unlinkSync(homeDir+"/.cache/projectutils/"+sha1(process.cwd())+".json");
    } catch (error) {
        console.log("filesystem error, maybe the file is already deleted?")
    }
    
}