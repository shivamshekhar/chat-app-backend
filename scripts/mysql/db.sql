CREATE USER IF NOT EXISTS 'chatAdmin'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';

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

CREATE TABLE IF NOT EXISTS `user_relation_mapping` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
    `uid1` INT UNSIGNED NOT NULL, 
    `uid2` INT UNSIGNED NOT NULL,
    `relation` ENUM('friend', 'blocked'), 
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP, 
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
    INDEX `idx_uid1` (`uid1`),
    INDEX `idx_uid2` (`uid2`),
    INDEX `idx_relation` (`relation`), 
    CONSTRAINT `uc_rel` UNIQUE (`uid1`, `uid2`),
    FOREIGN KEY (`uid1`) REFERENCES `user_details`(`id`),
    FOREIGN KEY (`uid2`) REFERENCES `user_details`(`id`),
    CHECK (`uid1` < `uid2`)
);