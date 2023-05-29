# fileSharingApp

## An online file sharing application.
The sender enters the receiver’s email address
and uploads the file which will be temporarily
stored on the server.
An email containing a URL will be sent to the
receiver which they can visit to access the
uploaded file.
Did not use external libraries and implemented
dependencies in vanilla JavaScript.
Used technologies such as HBS, CSS, Node.js,
MySQL, Express.js, BASH, Sendgrid API, Git,
Postman, NPM, etc.

## tech used:

- MySQl
- Node.js
- HTML
- CSS
- Nodemailer package for email transfers

## ready the data tier

#### Create a user
```sql
create user fsa identified by '';
```
#### Grant it permissions
```sql
GRANT create, select, insert, update, delete, drop, alter
ON *.* TO fsa;
```
#### Create a database
```sql
create database mydb;
```
#### Create a table
```sql
CREATE TABLE `FILES` (
  `id` bigint(20) unsigned PRIMARY KEY AUTO_INCREMENT,
  `FILE` text NOT NULL,
  `FILENAME` text NOT NULL,
  `SENDEREMAIL` text NOT NULL,
  `RECIEVEREMAIL` text NOT NULL,
  UNIQUE KEY `FILES_FILE_IDX` (`FILE`) USING HASH
);
```