const net = require("net");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const client = net.createConnection({ port: 3000 }, () => {
  console.log("connected to server");
  rl.prompt();
});
rl.on("line", (line) => {
  client.write(line);
  rl.prompt();
});

client.on("data", (data) => {
  console.log(`message recieved from server ${data.toString()}`);
});
