-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Structure-only database schema for the Findora project
-- Generated from the final development database on July 13, 2026
-- Contains no table records or INSERT statements
-- Server version: 8.0.43
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `findora_db`
--

CREATE DATABASE IF NOT EXISTS `findora_db`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE `findora_db`;

-- --------------------------------------------------------

--
-- Table structure for table `admin_log`
--

CREATE TABLE `admin_log` (
  `log_id` int NOT NULL,
  `admin_id` int NOT NULL,
  `action` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `target_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `target_id` int DEFAULT NULL,
  `action_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- --------------------------------------------------------

--
-- Table structure for table `complaint`
--

CREATE TABLE `complaint` (
  `complaint_id` int NOT NULL,
  `user_id` int NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('pending','reviewing','resolved','rejected') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `donation`
--

CREATE TABLE `donation` (
  `donation_id` int NOT NULL,
  `user_id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `donation_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `found_report`
--

CREATE TABLE `found_report` (
  `report_id` int NOT NULL,
  `user_id` int NOT NULL,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `district` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `found_date` date DEFAULT NULL,
  `found_time` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unique_identifiers` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_no` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('pending','active','matched','returned','rejected') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- --------------------------------------------------------

--
-- Table structure for table `found_report_image`
--

CREATE TABLE `found_report_image` (
  `image_id` int NOT NULL,
  `report_id` int NOT NULL,
  `image_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `uploaded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- --------------------------------------------------------

--
-- Table structure for table `lost_report`
--

CREATE TABLE `lost_report` (
  `report_id` int NOT NULL,
  `user_id` int NOT NULL,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `district` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lost_date` date DEFAULT NULL,
  `lost_time` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unique_identifiers` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_no` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('pending','active','matched','recovered','rejected') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- --------------------------------------------------------

--
-- Table structure for table `lost_report_image`
--

CREATE TABLE `lost_report_image` (
  `image_id` int NOT NULL,
  `report_id` int NOT NULL,
  `image_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `uploaded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- --------------------------------------------------------

--
-- Table structure for table `matches`
--

CREATE TABLE `matches` (
  `match_id` int NOT NULL,
  `lost_report_id` int NOT NULL,
  `found_report_id` int DEFAULT NULL,
  `similarity_score` decimal(5,2) NOT NULL,
  `status` enum('pending','verified','rejected','completed') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `admin_id` int DEFAULT NULL,
  `matched_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `verified_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- --------------------------------------------------------

--
-- Table structure for table `match_notification`
--

CREATE TABLE `match_notification` (
  `notification_id` int NOT NULL,
  `user_id` int NOT NULL,
  `match_id` int DEFAULT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sent_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- --------------------------------------------------------

--
-- Table structure for table `missing_person_comment`
--

CREATE TABLE `missing_person_comment` (
  `comment_id` int NOT NULL,
  `person_post_id` int NOT NULL,
  `user_id` int NOT NULL,
  `comment_text` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `missing_person_post`
--

CREATE TABLE `missing_person_post` (
  `person_post_id` int NOT NULL,
  `user_id` int NOT NULL,
  `full_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `age` int DEFAULT NULL,
  `gender` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `distinguishing_marks` text COLLATE utf8mb4_unicode_ci,
  `missing_date` date NOT NULL,
  `missing_time` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `district` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nearest_town` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_seen_location` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guardian_contact_no` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('pending','active','rejected') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- --------------------------------------------------------

--
-- Table structure for table `missing_person_post_image`
--

CREATE TABLE `missing_person_post_image` (
  `image_id` int NOT NULL,
  `person_post_id` int NOT NULL,
  `image_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `uploaded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- --------------------------------------------------------

--
-- Table structure for table `missing_person_reaction`
--

CREATE TABLE `missing_person_reaction` (
  `reaction_id` int NOT NULL,
  `person_post_id` int NOT NULL,
  `user_id` int NOT NULL,
  `reaction_type` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'like',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `missing_pet_comment`
--

CREATE TABLE `missing_pet_comment` (
  `comment_id` int NOT NULL,
  `pet_post_id` int NOT NULL,
  `user_id` int NOT NULL,
  `comment_text` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `missing_pet_post`
--

CREATE TABLE `missing_pet_post` (
  `pet_post_id` int NOT NULL,
  `user_id` int NOT NULL,
  `pet_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pet_category` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `unique_identifiers` text COLLATE utf8mb4_unicode_ci,
  `lost_date` date NOT NULL,
  `lost_time` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `district` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nearest_town` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_seen_location` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guardian_contact_no` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('pending','active','rejected') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- --------------------------------------------------------

--
-- Table structure for table `missing_pet_post_image`
--

CREATE TABLE `missing_pet_post_image` (
  `image_id` int NOT NULL,
  `pet_post_id` int NOT NULL,
  `image_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `uploaded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- --------------------------------------------------------

--
-- Table structure for table `missing_pet_reaction`
--

CREATE TABLE `missing_pet_reaction` (
  `reaction_id` int NOT NULL,
  `pet_post_id` int NOT NULL,
  `user_id` int NOT NULL,
  `reaction_type` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'like',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reward`
--

CREATE TABLE `reward` (
  `reward_id` int NOT NULL,
  `match_id` int NOT NULL,
  `owner_id` int NOT NULL,
  `finder_id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('pending','paid','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `transaction_ref` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paid_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `shop_owner`
--

CREATE TABLE `shop_owner` (
  `profile_id` int NOT NULL,
  `user_id` int NOT NULL,
  `shop_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `shop_address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mobile` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `district` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nearest_town` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `verified_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- --------------------------------------------------------

--
-- Table structure for table `suspicious_report`
--

CREATE TABLE `suspicious_report` (
  `report_id` int NOT NULL,
  `user_id` int NOT NULL,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `district` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `found_date` date DEFAULT NULL,
  `found_time` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unique_identifiers` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_no` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('pending','active','rejected') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- --------------------------------------------------------

--
-- Table structure for table `suspicious_report_image`
--

CREATE TABLE `suspicious_report_image` (
  `image_id` int NOT NULL,
  `report_id` int NOT NULL,
  `image_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `uploaded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int NOT NULL,
  `first_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nic` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mobile` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `district` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nearest_town` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('general_user','verified_user','shop_owner','admin') COLLATE utf8mb4_unicode_ci DEFAULT 'general_user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_log`
--
ALTER TABLE `admin_log`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `fk_admin_log_admin` (`admin_id`);

--
-- Indexes for table `complaint`
--
ALTER TABLE `complaint`
  ADD PRIMARY KEY (`complaint_id`),
  ADD KEY `fk_complaint_user` (`user_id`);

--
-- Indexes for table `donation`
--
ALTER TABLE `donation`
  ADD PRIMARY KEY (`donation_id`),
  ADD KEY `fk_donation_user` (`user_id`);

--
-- Indexes for table `found_report`
--
ALTER TABLE `found_report`
  ADD PRIMARY KEY (`report_id`),
  ADD KEY `fk_found_report_user` (`user_id`),
  ADD KEY `idx_found_category` (`category`),
  ADD KEY `idx_found_location` (`location`),
  ADD KEY `idx_found_date` (`found_date`),
  ADD KEY `idx_found_district` (`district`);

--
-- Indexes for table `found_report_image`
--
ALTER TABLE `found_report_image`
  ADD PRIMARY KEY (`image_id`),
  ADD KEY `fk_found_report_image_report` (`report_id`);

--
-- Indexes for table `lost_report`
--
ALTER TABLE `lost_report`
  ADD PRIMARY KEY (`report_id`),
  ADD KEY `fk_lost_report_user` (`user_id`),
  ADD KEY `idx_lost_category` (`category`),
  ADD KEY `idx_lost_location` (`location`),
  ADD KEY `idx_lost_date` (`lost_date`),
  ADD KEY `idx_lost_district` (`district`);

--
-- Indexes for table `lost_report_image`
--
ALTER TABLE `lost_report_image`
  ADD PRIMARY KEY (`image_id`),
  ADD KEY `fk_lost_report_image_report` (`report_id`);

--
-- Indexes for table `matches`
--
ALTER TABLE `matches`
  ADD PRIMARY KEY (`match_id`),
  ADD KEY `fk_matches_lost` (`lost_report_id`),
  ADD KEY `fk_matches_found` (`found_report_id`),
  ADD KEY `fk_matches_admin` (`admin_id`);

--
-- Indexes for table `match_notification`
--
ALTER TABLE `match_notification`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `fk_match_notification_user` (`user_id`),
  ADD KEY `fk_match_notification_match` (`match_id`);

--
-- Indexes for table `missing_person_comment`
--
ALTER TABLE `missing_person_comment`
  ADD PRIMARY KEY (`comment_id`),
  ADD KEY `fk_missing_person_comment_post` (`person_post_id`),
  ADD KEY `fk_missing_person_comment_user` (`user_id`);

--
-- Indexes for table `missing_person_post`
--
ALTER TABLE `missing_person_post`
  ADD PRIMARY KEY (`person_post_id`),
  ADD KEY `fk_missing_person_user` (`user_id`),
  ADD KEY `idx_person_status` (`status`),
  ADD KEY `idx_person_location` (`district`,`nearest_town`),
  ADD KEY `idx_person_missing_date` (`missing_date`);

--
-- Indexes for table `missing_person_post_image`
--
ALTER TABLE `missing_person_post_image`
  ADD PRIMARY KEY (`image_id`),
  ADD KEY `fk_missing_person_image_post` (`person_post_id`);

--
-- Indexes for table `missing_person_reaction`
--
ALTER TABLE `missing_person_reaction`
  ADD PRIMARY KEY (`reaction_id`),
  ADD UNIQUE KEY `unique_person_user_reaction` (`person_post_id`,`user_id`),
  ADD KEY `fk_missing_person_reaction_user` (`user_id`);

--
-- Indexes for table `missing_pet_comment`
--
ALTER TABLE `missing_pet_comment`
  ADD PRIMARY KEY (`comment_id`),
  ADD KEY `fk_missing_pet_comment_post` (`pet_post_id`),
  ADD KEY `fk_missing_pet_comment_user` (`user_id`);

--
-- Indexes for table `missing_pet_post`
--
ALTER TABLE `missing_pet_post`
  ADD PRIMARY KEY (`pet_post_id`),
  ADD KEY `fk_missing_pet_user` (`user_id`),
  ADD KEY `idx_pet_status` (`status`),
  ADD KEY `idx_pet_location` (`district`,`nearest_town`),
  ADD KEY `idx_pet_lost_date` (`lost_date`);

--
-- Indexes for table `missing_pet_post_image`
--
ALTER TABLE `missing_pet_post_image`
  ADD PRIMARY KEY (`image_id`),
  ADD KEY `fk_missing_pet_image_post` (`pet_post_id`);

--
-- Indexes for table `missing_pet_reaction`
--
ALTER TABLE `missing_pet_reaction`
  ADD PRIMARY KEY (`reaction_id`),
  ADD UNIQUE KEY `unique_pet_user_reaction` (`pet_post_id`,`user_id`),
  ADD KEY `fk_missing_pet_reaction_user` (`user_id`);

--
-- Indexes for table `reward`
--
ALTER TABLE `reward`
  ADD PRIMARY KEY (`reward_id`),
  ADD KEY `fk_reward_match` (`match_id`),
  ADD KEY `fk_reward_owner` (`owner_id`),
  ADD KEY `fk_reward_finder` (`finder_id`);

--
-- Indexes for table `shop_owner`
--
ALTER TABLE `shop_owner`
  ADD PRIMARY KEY (`profile_id`),
  ADD KEY `fk_shop_owner_user` (`user_id`);

--
-- Indexes for table `suspicious_report`
--
ALTER TABLE `suspicious_report`
  ADD PRIMARY KEY (`report_id`),
  ADD KEY `fk_suspicious_report_user` (`user_id`),
  ADD KEY `idx_suspicious_category` (`category`),
  ADD KEY `idx_suspicious_district` (`district`);

--
-- Indexes for table `suspicious_report_image`
--
ALTER TABLE `suspicious_report_image`
  ADD PRIMARY KEY (`image_id`),
  ADD KEY `fk_suspicious_report_image_report` (`report_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `nic` (`nic`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_log`
--
ALTER TABLE `admin_log`
  MODIFY `log_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `complaint`
--
ALTER TABLE `complaint`
  MODIFY `complaint_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `donation`
--
ALTER TABLE `donation`
  MODIFY `donation_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `found_report`
--
ALTER TABLE `found_report`
  MODIFY `report_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `found_report_image`
--
ALTER TABLE `found_report_image`
  MODIFY `image_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lost_report`
--
ALTER TABLE `lost_report`
  MODIFY `report_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lost_report_image`
--
ALTER TABLE `lost_report_image`
  MODIFY `image_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `matches`
--
ALTER TABLE `matches`
  MODIFY `match_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `match_notification`
--
ALTER TABLE `match_notification`
  MODIFY `notification_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `missing_person_comment`
--
ALTER TABLE `missing_person_comment`
  MODIFY `comment_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `missing_person_post`
--
ALTER TABLE `missing_person_post`
  MODIFY `person_post_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `missing_person_post_image`
--
ALTER TABLE `missing_person_post_image`
  MODIFY `image_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `missing_person_reaction`
--
ALTER TABLE `missing_person_reaction`
  MODIFY `reaction_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `missing_pet_comment`
--
ALTER TABLE `missing_pet_comment`
  MODIFY `comment_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `missing_pet_post`
--
ALTER TABLE `missing_pet_post`
  MODIFY `pet_post_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `missing_pet_post_image`
--
ALTER TABLE `missing_pet_post_image`
  MODIFY `image_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `missing_pet_reaction`
--
ALTER TABLE `missing_pet_reaction`
  MODIFY `reaction_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reward`
--
ALTER TABLE `reward`
  MODIFY `reward_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `shop_owner`
--
ALTER TABLE `shop_owner`
  MODIFY `profile_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `suspicious_report`
--
ALTER TABLE `suspicious_report`
  MODIFY `report_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `suspicious_report_image`
--
ALTER TABLE `suspicious_report_image`
  MODIFY `image_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin_log`
--
ALTER TABLE `admin_log`
  ADD CONSTRAINT `fk_admin_log_admin` FOREIGN KEY (`admin_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `complaint`
--
ALTER TABLE `complaint`
  ADD CONSTRAINT `fk_complaint_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `donation`
--
ALTER TABLE `donation`
  ADD CONSTRAINT `fk_donation_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `found_report`
--
ALTER TABLE `found_report`
  ADD CONSTRAINT `fk_found_report_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `found_report_image`
--
ALTER TABLE `found_report_image`
  ADD CONSTRAINT `fk_found_report_image_report` FOREIGN KEY (`report_id`) REFERENCES `found_report` (`report_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `lost_report`
--
ALTER TABLE `lost_report`
  ADD CONSTRAINT `fk_lost_report_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `lost_report_image`
--
ALTER TABLE `lost_report_image`
  ADD CONSTRAINT `fk_lost_report_image_report` FOREIGN KEY (`report_id`) REFERENCES `lost_report` (`report_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `matches`
--
ALTER TABLE `matches`
  ADD CONSTRAINT `fk_matches_admin` FOREIGN KEY (`admin_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_matches_found` FOREIGN KEY (`found_report_id`) REFERENCES `found_report` (`report_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_matches_lost` FOREIGN KEY (`lost_report_id`) REFERENCES `lost_report` (`report_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `match_notification`
--
ALTER TABLE `match_notification`
  ADD CONSTRAINT `fk_match_notification_match` FOREIGN KEY (`match_id`) REFERENCES `matches` (`match_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_match_notification_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `missing_person_comment`
--
ALTER TABLE `missing_person_comment`
  ADD CONSTRAINT `fk_missing_person_comment_post` FOREIGN KEY (`person_post_id`) REFERENCES `missing_person_post` (`person_post_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_missing_person_comment_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `missing_person_post`
--
ALTER TABLE `missing_person_post`
  ADD CONSTRAINT `fk_missing_person_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `missing_person_post_image`
--
ALTER TABLE `missing_person_post_image`
  ADD CONSTRAINT `fk_missing_person_image_post` FOREIGN KEY (`person_post_id`) REFERENCES `missing_person_post` (`person_post_id`) ON DELETE CASCADE;

--
-- Constraints for table `missing_person_reaction`
--
ALTER TABLE `missing_person_reaction`
  ADD CONSTRAINT `fk_missing_person_reaction_post` FOREIGN KEY (`person_post_id`) REFERENCES `missing_person_post` (`person_post_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_missing_person_reaction_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `missing_pet_comment`
--
ALTER TABLE `missing_pet_comment`
  ADD CONSTRAINT `fk_missing_pet_comment_post` FOREIGN KEY (`pet_post_id`) REFERENCES `missing_pet_post` (`pet_post_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_missing_pet_comment_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `missing_pet_post`
--
ALTER TABLE `missing_pet_post`
  ADD CONSTRAINT `fk_missing_pet_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `missing_pet_post_image`
--
ALTER TABLE `missing_pet_post_image`
  ADD CONSTRAINT `fk_missing_pet_image_post` FOREIGN KEY (`pet_post_id`) REFERENCES `missing_pet_post` (`pet_post_id`) ON DELETE CASCADE;

--
-- Constraints for table `missing_pet_reaction`
--
ALTER TABLE `missing_pet_reaction`
  ADD CONSTRAINT `fk_missing_pet_reaction_post` FOREIGN KEY (`pet_post_id`) REFERENCES `missing_pet_post` (`pet_post_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_missing_pet_reaction_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `reward`
--
ALTER TABLE `reward`
  ADD CONSTRAINT `fk_reward_finder` FOREIGN KEY (`finder_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_reward_match` FOREIGN KEY (`match_id`) REFERENCES `matches` (`match_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_reward_owner` FOREIGN KEY (`owner_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `shop_owner`
--
ALTER TABLE `shop_owner`
  ADD CONSTRAINT `fk_shop_owner_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `suspicious_report`
--
ALTER TABLE `suspicious_report`
  ADD CONSTRAINT `fk_suspicious_report_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `suspicious_report_image`
--
ALTER TABLE `suspicious_report_image`
  ADD CONSTRAINT `fk_suspicious_report_image_report` FOREIGN KEY (`report_id`) REFERENCES `suspicious_report` (`report_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
