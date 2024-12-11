const http = require("http"); //hypertext protocol for creating server
const fs = require("fs"); //for accessing filesystem
const path = require("path"); //for path

const port = 3000; //port

const server = http.createServer((req, res) => {
  //getting the file path
  const filePath = path.join(
    __dirname,
    req.url === "/" ? "index.html" : req.url
  );

  console.log(filePath);
  //getting the file extension
  const extName = String(path.extname(filePath)).toLowerCase();
  const mimeTypes = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".png": "text/png",
  };
  const contentType = mimeTypes[extName] || "application/octet-stream";

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === "ENOENT") {
        const errPath = path.join(__dirname, "/notfound.html");
        fs.readFile(errPath, (err404, content404) => {
          if (err404) {
            res.writeHead(500, { "Content-Type": "text/html" });
            res.end("<h1>500 - Internal Server Error</h1>");
          } else {
            res.writeHead(404, { "Content-Type": "text/html" });
            res.end(content404, "utf-8");
          }
        });
      }
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf-8");
    }
  });
});

server.listen(port, () => {
  console.log(`server is listening on the port ${port}`);
});
