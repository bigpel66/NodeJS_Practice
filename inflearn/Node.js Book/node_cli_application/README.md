<h1 align="center">node_cli_application</h1>
<div align="center">
    The simple cli-program to practice internal modules of Node.js
</div>

## List of Contents

1. cli-readline

-   This program is just naive cli program which is not using any third party package dependency.

2. cli-commander

-   HTML Template Program
    Though this program is not using database, it depends on third party package dependencies which make the coding more easier and scalable.

-   Wallet Program
    This program also use commander, inquirer, chalk like HTML Template Program. In addition, the result of the inquire are saved on the database, MySQL (using sequelize as ORM)

## Features

1. The package "chalk" makes the specific statements colorful to distinguish it from others.

2. The package "inquirer" makes the interaction between user and cli more easier. Programmer just fit the form of the inputs to make queries instead of writing all the quries by hand.

3. The package "commander" provides many methods to make details of commands on cli. Easily organize and manage commands compare to the readline which is internal module of Node.js.

## How to Run?

Type "node \$filename" in the appropriate directory.
