CREATE USER 'chatAdmin'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';

GRANT ALL PRIVILEGES ON * . * TO 'chatAdmin'@'localhost';

CREATE DATABASE IF NOT EXISTS `chat_app`;  

USE `chat_app`;  

CREATE TABLE IF NOT EXISTS `user_details` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
    `name` VARCHAR(255) NOT NULL, 
    `password` VARCHAR(255) NOT NULL, 
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP, 
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
    INDEX `idx_name` (`name`), 
    CONSTRAINT `uc_name` UNIQUE (`name`)
);