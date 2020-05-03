console.log(__filename);
console.log(__dirname);
console.log(process);

console.log(process.version);
console.log(process.arch);
console.log(process.platform);
console.log(process.pid);
console.log(process.uptime());
console.log(process.cwd());
console.log(process.execPath);
console.log(process.cpuUsage());

for (let i = 0; i < 100000; i++) {
    console.log(i);
    process.exit();
}
