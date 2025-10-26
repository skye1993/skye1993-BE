# NC News Seeding

When accessing a single database, it is possible to store the database name in a .env file and use the dotenv package to read this file and set the environment variable of PGDATABASE to the process.env. When there are different databases to connect to depending on the environment, separate .env files are needed.

In .env.test:

PGDATABASE=test_database_name
In .env.development:

PGDATABASE=development_database_name

Files needed to be created =
.env.test 
.env.development

Absolute file paths

Creating the absolute path to this file is slightly more work-intensive. This is because there is likely a disconnect between the relative path from the db/index file to the correct .env file, versus where the script that runs the project will actually be executed (likely in the root of the project).

The below example uses the globally available __dirname to create an absolute path to the correct .env file. This allows the file to be run from anywhere within the project directory structure and maintain an absolute path to the correct .env file.

