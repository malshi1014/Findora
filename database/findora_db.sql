-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 28, 2026 at 03:35 PM
-- Server version: 10.4.32-MariaDB
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

-- --------------------------------------------------------

--
-- Table structure for table `admin_log`
--

CREATE TABLE `admin_log` (
  `log_id` int(11) NOT NULL,
  `admin_id` int(11) NOT NULL,
  `action` varchar(255) NOT NULL,
  `target_type` varchar(100) NOT NULL,
  `target_id` int(11) NOT NULL,
  `action_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `area_notification`
--

CREATE TABLE `area_notification` (
  `notification_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `title` varchar(150) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `comment`
--

CREATE TABLE `comment` (
  `comment_id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `comment_text` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `donation`
--

CREATE TABLE `donation` (
  `donation_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `donation_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `found_report`
--

CREATE TABLE `found_report` (
  `report_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `category` enum('MOBILE','LAPTOP','WALLET','BAG','DOCUMENT','JEWELLERY','KEY','VEHICLE','PET','PERSON','OTHER') NOT NULL,
  `title` varchar(150) NOT NULL,
  `description` text NOT NULL,
  `district` varchar(100) NOT NULL,
  `nearest_town` varchar(100) NOT NULL,
  `found_date` date NOT NULL,
  `found_time` time DEFAULT NULL,
  `unique_identifiers` text DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `status` enum('PENDING','MATCHED','RETURNED','CLOSED') DEFAULT 'PENDING',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `found_report_image`
--

CREATE TABLE `found_report_image` (
  `image_id` int(11) NOT NULL,
  `report_id` int(11) NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `lost_report`
--

CREATE TABLE `lost_report` (
  `report_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `category` enum('MOBILE','LAPTOP','WALLET','BAG','DOCUMENT','JEWELLERY','KEY','VEHICLE','PET','PERSON','OTHER') NOT NULL,
  `title` varchar(150) NOT NULL,
  `description` text NOT NULL,
  `district` varchar(100) NOT NULL,
  `nearest_town` varchar(100) NOT NULL,
  `lost_date` date NOT NULL,
  `lost_time` time DEFAULT NULL,
  `unique_identifiers` text DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `status` enum('PENDING','MATCHED','FOUND','CLOSED') DEFAULT 'PENDING',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `lost_report_image`
--

CREATE TABLE `lost_report_image` (
  `image_id` int(11) NOT NULL,
  `report_id` int(11) NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `match_notification`
--

CREATE TABLE `match_notification` (
  `notification_id` int(11) NOT NULL,
  `match_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `notification_type` enum('EMAIL','DASHBOARD') NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `sent_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `match_record`
--

CREATE TABLE `match_record` (
  `match_id` int(11) NOT NULL,
  `lost_report_id` int(11) NOT NULL,
  `found_report_id` int(11) NOT NULL,
  `admin_id` int(11) NOT NULL,
  `similarity_score` decimal(5,2) NOT NULL,
  `status` enum('PENDING','VERIFIED','REJECTED','ACCEPTED','COMPLETED') DEFAULT 'PENDING',
  `matched_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `verified_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `public_post`
--

CREATE TABLE `public_post` (
  `post_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `post_type` enum('MISSING_PERSON','MISSING_PET') NOT NULL,
  `title` varchar(150) NOT NULL,
  `description` text NOT NULL,
  `district` varchar(100) NOT NULL,
  `nearest_town` varchar(100) NOT NULL,
  `incident_date` date NOT NULL,
  `contact_number` varchar(20) NOT NULL,
  `status` enum('ACTIVE','FOUND','CLOSED') DEFAULT 'ACTIVE',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `public_report_image`
--

CREATE TABLE `public_report_image` (
  `image_id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reaction`
--

CREATE TABLE `reaction` (
  `reaction_id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `reaction_type` enum('LIKE','HELPFUL') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reward`
--

CREATE TABLE `reward` (
  `reward_id` int(11) NOT NULL,
  `match_id` int(11) NOT NULL,
  `reward_amount` decimal(10,2) DEFAULT NULL,
  `reward_description` text DEFAULT NULL,
  `reward_status` enum('PENDING','PAID','NOT_APPLICABLE') DEFAULT 'PENDING'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `shop_owner`
--

CREATE TABLE `shop_owner` (
  `profile_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `shop_name` varchar(150) NOT NULL,
  `shop_address` text NOT NULL,
  `email` varchar(100) NOT NULL,
  `mobile` varchar(20) NOT NULL,
  `district` varchar(100) NOT NULL,
  `nearest_town` varchar(100) NOT NULL,
  `verified_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `suspicious_report`
--

CREATE TABLE `suspicious_report` (
  `suspicious_report_id` int(11) NOT NULL,
  `shop_owner_id` int(11) NOT NULL,
  `item_name` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `district` varchar(100) DEFAULT NULL,
  `nearest_town` varchar(100) DEFAULT NULL,
  `received_date` date DEFAULT NULL,
  `status` enum('PENDING','UNDER_REVIEW','CLOSED') DEFAULT 'PENDING',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `nic` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `mobile` varchar(20) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `district` varchar(100) NOT NULL,
  `nearest_town` varchar(100) NOT NULL,
  `role` enum('GENERAL_USER','ADMIN','SHOP_OWNER') NOT NULL DEFAULT 'GENERAL_USER',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_log`
--
ALTER TABLE `admin_log`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `fk_adminlog_admin` (`admin_id`);

--
-- Indexes for table `area_notification`
--
ALTER TABLE `area_notification`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `fk_areanotification_post` (`post_id`),
  ADD KEY `idx_area_notification_user` (`user_id`);

--
-- Indexes for table `comment`
--
ALTER TABLE `comment`
  ADD PRIMARY KEY (`comment_id`),
  ADD KEY `fk_comment_user` (`user_id`),
  ADD KEY `idx_comment_post` (`post_id`);

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
  ADD KEY `fk_foundreport_user` (`user_id`),
  ADD KEY `idx_found_category` (`category`),
  ADD KEY `idx_found_location` (`district`,`nearest_town`),
  ADD KEY `idx_found_status` (`status`),
  ADD KEY `idx_found_date` (`found_date`);

--
-- Indexes for table `found_report_image`
--
ALTER TABLE `found_report_image`
  ADD PRIMARY KEY (`image_id`),
  ADD KEY `fk_foundimage_report` (`report_id`);

--
-- Indexes for table `lost_report`
--
ALTER TABLE `lost_report`
  ADD PRIMARY KEY (`report_id`),
  ADD KEY `fk_lostreport_user` (`user_id`),
  ADD KEY `idx_lost_category` (`category`),
  ADD KEY `idx_lost_location` (`district`,`nearest_town`),
  ADD KEY `idx_lost_status` (`status`),
  ADD KEY `idx_lost_date` (`lost_date`);

--
-- Indexes for table `lost_report_image`
--
ALTER TABLE `lost_report_image`
  ADD PRIMARY KEY (`image_id`),
  ADD KEY `fk_lostimage_report` (`report_id`);

--
-- Indexes for table `match_notification`
--
ALTER TABLE `match_notification`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `fk_notification_match` (`match_id`),
  ADD KEY `fk_notification_user` (`user_id`);

--
-- Indexes for table `match_record`
--
ALTER TABLE `match_record`
  ADD PRIMARY KEY (`match_id`),
  ADD KEY `fk_match_lost` (`lost_report_id`),
  ADD KEY `fk_match_found` (`found_report_id`),
  ADD KEY `fk_match_admin` (`admin_id`),
  ADD KEY `idx_match_score` (`similarity_score`),
  ADD KEY `idx_match_status` (`status`);

--
-- Indexes for table `public_post`
--
ALTER TABLE `public_post`
  ADD PRIMARY KEY (`post_id`),
  ADD KEY `fk_publicpost_user` (`user_id`),
  ADD KEY `idx_public_post_type` (`post_type`),
  ADD KEY `idx_public_post_location` (`district`,`nearest_town`),
  ADD KEY `idx_public_post_status` (`status`),
  ADD KEY `idx_public_post_date` (`incident_date`);

--
-- Indexes for table `public_report_image`
--
ALTER TABLE `public_report_image`
  ADD PRIMARY KEY (`image_id`),
  ADD KEY `fk_publicimage_post` (`post_id`);

--
-- Indexes for table `reaction`
--
ALTER TABLE `reaction`
  ADD PRIMARY KEY (`reaction_id`),
  ADD KEY `fk_reaction_user` (`user_id`),
  ADD KEY `idx_reaction_post` (`post_id`);

--
-- Indexes for table `reward`
--
ALTER TABLE `reward`
  ADD PRIMARY KEY (`reward_id`),
  ADD KEY `fk_reward_match` (`match_id`),
  ADD KEY `idx_reward_status` (`reward_status`);

--
-- Indexes for table `shop_owner`
--
ALTER TABLE `shop_owner`
  ADD PRIMARY KEY (`profile_id`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD KEY `idx_shop_location` (`district`,`nearest_town`);

--
-- Indexes for table `suspicious_report`
--
ALTER TABLE `suspicious_report`
  ADD PRIMARY KEY (`suspicious_report_id`),
  ADD KEY `fk_suspicious_shopowner` (`shop_owner_id`),
  ADD KEY `idx_suspicious_status` (`status`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `nic` (`nic`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_user_email` (`email`),
  ADD KEY `idx_user_nic` (`nic`),
  ADD KEY `idx_user_role` (`role`),
  ADD KEY `idx_user_location` (`district`,`nearest_town`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_log`
--
ALTER TABLE `admin_log`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `area_notification`
--
ALTER TABLE `area_notification`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `comment`
--
ALTER TABLE `comment`
  MODIFY `comment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `donation`
--
ALTER TABLE `donation`
  MODIFY `donation_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `found_report`
--
ALTER TABLE `found_report`
  MODIFY `report_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `found_report_image`
--
ALTER TABLE `found_report_image`
  MODIFY `image_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lost_report`
--
ALTER TABLE `lost_report`
  MODIFY `report_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lost_report_image`
--
ALTER TABLE `lost_report_image`
  MODIFY `image_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `match_notification`
--
ALTER TABLE `match_notification`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `match_record`
--
ALTER TABLE `match_record`
  MODIFY `match_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `public_post`
--
ALTER TABLE `public_post`
  MODIFY `post_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `public_report_image`
--
ALTER TABLE `public_report_image`
  MODIFY `image_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reaction`
--
ALTER TABLE `reaction`
  MODIFY `reaction_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reward`
--
ALTER TABLE `reward`
  MODIFY `reward_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `shop_owner`
--
ALTER TABLE `shop_owner`
  MODIFY `profile_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `suspicious_report`
--
ALTER TABLE `suspicious_report`
  MODIFY `suspicious_report_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin_log`
--
ALTER TABLE `admin_log`
  ADD CONSTRAINT `fk_adminlog_admin` FOREIGN KEY (`admin_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `area_notification`
--
ALTER TABLE `area_notification`
  ADD CONSTRAINT `fk_areanotification_post` FOREIGN KEY (`post_id`) REFERENCES `public_post` (`post_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_areanotification_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `comment`
--
ALTER TABLE `comment`
  ADD CONSTRAINT `fk_comment_post` FOREIGN KEY (`post_id`) REFERENCES `public_post` (`post_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_comment_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `donation`
--
ALTER TABLE `donation`
  ADD CONSTRAINT `fk_donation_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `found_report`
--
ALTER TABLE `found_report`
  ADD CONSTRAINT `fk_foundreport_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `found_report_image`
--
ALTER TABLE `found_report_image`
  ADD CONSTRAINT `fk_foundimage_report` FOREIGN KEY (`report_id`) REFERENCES `found_report` (`report_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `lost_report`
--
ALTER TABLE `lost_report`
  ADD CONSTRAINT `fk_lostreport_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `lost_report_image`
--
ALTER TABLE `lost_report_image`
  ADD CONSTRAINT `fk_lostimage_report` FOREIGN KEY (`report_id`) REFERENCES `lost_report` (`report_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `match_notification`
--
ALTER TABLE `match_notification`
  ADD CONSTRAINT `fk_notification_match` FOREIGN KEY (`match_id`) REFERENCES `match_record` (`match_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_notification_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `match_record`
--
ALTER TABLE `match_record`
  ADD CONSTRAINT `fk_match_admin` FOREIGN KEY (`admin_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_match_found` FOREIGN KEY (`found_report_id`) REFERENCES `found_report` (`report_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_match_lost` FOREIGN KEY (`lost_report_id`) REFERENCES `lost_report` (`report_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `public_post`
--
ALTER TABLE `public_post`
  ADD CONSTRAINT `fk_publicpost_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `public_report_image`
--
ALTER TABLE `public_report_image`
  ADD CONSTRAINT `fk_publicimage_post` FOREIGN KEY (`post_id`) REFERENCES `public_post` (`post_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `reaction`
--
ALTER TABLE `reaction`
  ADD CONSTRAINT `fk_reaction_post` FOREIGN KEY (`post_id`) REFERENCES `public_post` (`post_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_reaction_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `reward`
--
ALTER TABLE `reward`
  ADD CONSTRAINT `fk_reward_match` FOREIGN KEY (`match_id`) REFERENCES `match_record` (`match_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `shop_owner`
--
ALTER TABLE `shop_owner`
  ADD CONSTRAINT `fk_shop_owner_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `suspicious_report`
--
ALTER TABLE `suspicious_report`
  ADD CONSTRAINT `fk_suspicious_shopowner` FOREIGN KEY (`shop_owner_id`) REFERENCES `shop_owner` (`profile_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
