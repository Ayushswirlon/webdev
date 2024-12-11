const net = require("net");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
//connection establishment;
const client = net.createConnection({ port: 3000 }, () => {
  console.log("connected to server");
  rl.prompt();
});
//writes on client terminal
rl.on("line", (line) => {
  client.write(line);
  rl.prompt();
});
//message from server
client.on("data", (data) => {
  console.log(`message recieved from server ${data.toString()}`);
});
