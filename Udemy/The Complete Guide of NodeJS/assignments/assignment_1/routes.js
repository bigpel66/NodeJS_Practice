const fs = require("fs");

const requestHandler = (request, response) => {
  if (request.url === "/") {
    response.write("<html>");
    response.write("<head><title>Greetings!</title></head>");
    response.write("<body>");
    response.write("<h3>Hi, this is Jason!</h3>");
    response.write(
      '<form action="/create-user" method="POST"><input type="text" name="username"><button type="submit">send</button></input></form>'
    );
    response.write("</body>");
    response.write("</html>");
    return response.end();
  }

  if (request.url === "/users") {
    response.write("<html>");
    response.write("<head><title>User List</title></head>");
    response.write("<body><ul>");
    response.write("<li>User1</li>");
    response.write("<li>Usere2</li>");
    response.write("</ul></body>");
    response.write("</html>");
    return response.end();
  }

  if (request.url === "/create-user" && request.method === "POST") {
    const body = [];
    request.on("data", chunk => {
      console.log(chunk);
      body.push(chunk);
    });
    return request.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const username = parsedBody.split("=")[1];
      console.log(username);
      response.statusCode = 302;
      response.setHeader("Location", "/");
      response.end();
    });
  }

  response.setHeader("Content-Type", "text/html");
  response.write("<html>");
  response.write("<head><title>Wrong!</title></head>");
  response.write("<body><h3>Wrong Page!</h3></body>");
  response.write("</html>");
};

module.exports = requestHandler;
