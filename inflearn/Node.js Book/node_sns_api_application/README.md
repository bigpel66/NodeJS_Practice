<h1 align="center">node_sns_api_application</h1>
<div align="center">
    The project to implement API Server which provides SNS service functions
</div>

## What is this project?

This is the API Server to provide the information on the SNS service application. Recommend the users to use the API Server instead of web crawling to reduce the traffic on the server of the SNS application.

This project is related to the projects below.

-   node_sns_application

    https://github.com/bigpel66/nodejs-practice/tree/master/inflearn/Node.js%20Book/node_sns_application

-   node_sns_call_application

    https://github.com/bigpel66/nodejs-practice/tree/master/inflearn/Node.js%20Book/node_sns_call_application

## Features

1. User can sign in to the application to register to use API from the server. When the user signed in and want to use API from the server, the user must register own domain to the API Server. If the registering domain succeed, the server issues client key and secret key. (Both keys are created by uuid)

2. There are difference between Free API Channel and Premium API Channel. (This function is implemented by express-slow-down and express-rate-limit)

3. To use the API from the server, the user must create the temporarily alive token through the issued key.

4. The version of API is specified. If the old version is deprecated, the user would better use newer version of the API.

## Demo

<div style="display:flex" align="center">
    <img src="images/1.png" alt="1" width="600">
    <img src="images/2.png" alt="2" width="600">
</div>
