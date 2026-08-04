CREATE DATABASE HR_increment_db
character set utf8mb4
collate utf8mb4_unicode_ci;
create user 'Admin'@'localhost' identified BY 'Admin@123';
grant all privileges ON increment_db.* to 'Admin'@'localhost';
flush privileges;
SHOW databases;
USE increment_db;