-- ====================================================
-- Findora: PayHere Sandbox Payment Integration
-- Migration: Extend donation table for payment tracking
-- Run this script in phpMyAdmin > findora_db > SQL tab
-- ====================================================

USE `findora_db`;

ALTER TABLE `donation`
  ADD COLUMN `status` ENUM('pending', 'completed', 'failed', 'cancelled') NOT NULL DEFAULT 'pending' AFTER `amount`,
  ADD COLUMN `payhere_payment_id` VARCHAR(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL AFTER `status`,
  ADD COLUMN `donor_name` VARCHAR(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL AFTER `payhere_payment_id`,
  ADD COLUMN `donor_email` VARCHAR(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL AFTER `donor_name`,
  ADD COLUMN `is_anonymous` TINYINT(1) NOT NULL DEFAULT 0 AFTER `donor_email`;

ALTER TABLE `donation`
  ADD KEY `idx_donation_status` (`status`),
  ADD KEY `idx_donation_payhere_id` (`payhere_payment_id`);
