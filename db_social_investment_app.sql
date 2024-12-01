-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Dec 01, 2024 at 12:46 PM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_social_investment_app`
--

-- --------------------------------------------------------

--
-- Table structure for table `acara`
--

CREATE TABLE `acara` (
  `id_acara` int NOT NULL,
  `nama_acara` varchar(255) NOT NULL,
  `waktu_acara` datetime NOT NULL,
  `acara_selesai` datetime NOT NULL,
  `lokasi_acara` varchar(255) NOT NULL,
  `keterangan` text,
  `informasi_kontak` varchar(255) DEFAULT NULL,
  `id_pembuat_acara` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `kontribusi`
--

CREATE TABLE `kontribusi` (
  `id_kontribusi` int NOT NULL,
  `id_acara` int NOT NULL,
  `id_penyumbang` int NOT NULL,
  `tanggal_sumbangan` datetime DEFAULT CURRENT_TIMESTAMP,
  `tanggal_edit_sumbangan` datetime DEFAULT NULL,
  `status_validasi` enum('belum divalidasi','valid','tidak valid') DEFAULT 'belum divalidasi'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `kontribusi_barang`
--

CREATE TABLE `kontribusi_barang` (
  `id_kontribusi_barang` int NOT NULL,
  `id_kontribusi` int NOT NULL,
  `nama_barang` varchar(255) NOT NULL,
  `foto_kontribusi_barang` varchar(255) NOT NULL,
  `jumlah_barang` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `kontribusi_uang`
--

CREATE TABLE `kontribusi_uang` (
  `id_kontribusi_uang` int NOT NULL,
  `id_kontribusi` int NOT NULL,
  `foto_kontribusi_uang` varchar(255) NOT NULL,
  `jumlah_uang` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `superuser`
--

CREATE TABLE `superuser` (
  `id_superuser` int NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `superuser`
--

INSERT INTO `superuser` (`id_superuser`, `email`, `password`) VALUES
(1, 'Agiel@superuser', '$2a$10$QKYhHT3NXinCY2UvmSBy9OW/5uRlaQBk4DG.CbPbU6wQDZK2RB2SC'),
(2, 'Aqil@superuser', '$2a$10$uFTA7kOvub0YDhVefhog9uv6SdCs7um4I0iCszDi9iVplJT5bsfY2'),
(3, 'Iqbal@superuser', '$2a$10$.KvuevZDTSAXmGv9BkpacOC9PjqeAdRpUxhmz9yamSCPg5TJv9PUu'),
(4, 'Tamisa@superuser', '$2a$10$nqfo77Rmo6g5J/uEGWCEYeNF.zpqe8RD7wA9p1ORa9gDy0sk8fPFq'),
(5, 'Ifzal@superuser', '$2a$10$dQBBYHEybUUNI6ssW1EC/O7K0bJvzWrhuRoLMpeiVvGS5JZGzycgq');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id_user` int NOT NULL,
  `nama` varchar(255) NOT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `NIK` bigint NOT NULL,
  `no_wa` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `tanggal_daftar` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id_user`, `nama`, `foto`, `NIK`, `no_wa`, `email`, `password`, `tanggal_daftar`) VALUES
(1, 'Ibram Maulana Akhsanul Qasasi', 'default.png', 3123522001, '085852769382', 'Ibram@user', '$2a$10$96yseqHSA2zNMFZ4hGzxb.CH9In1.y7ZjHBBa8etmBUw9iHPqDJmu', '2024-02-01 19:35:34'),
(2, 'Ahmad Maulana Afandi', 'default.png', 3123522002, '081359375146', 'Afandi@user', '$2a$10$ZS8db.D5ZtGPs8m.akkycu1/GOEtix/QRTCZJc7NdfeceEAvNrTou', '2024-02-01 19:36:02'),
(3, 'Almas Daffa Avicena', 'default.png', 3123522003, '088213135658', 'Daffa@user', '$2a$10$YiRk27iEk8gUxoxcWHKM4.D.YpvJcW3hw5i0n.vx7TnYI7IrTG9iC', '2024-03-01 19:36:20'),
(4, 'Eka Intan Mauliyana', 'default.png', 3123522004, '081937925108', 'Intan@user', '$2a$10$y5o1utUadrBV0/Pgie.9huF7ePCBEcBDTF1L/5JU9.T81AQNp1MpG', '2024-04-01 19:36:48'),
(5, 'Vernanda Mulia Hamonangan Manurung', 'default.png', 3123522005, '081216679709', 'Vernanda@user', '$2a$10$Gk8pi2nIzwdJ5cnnUPR8C.xggyuVBx8ziMViG14MiCjNk3eIDT3Fa', '2024-05-01 19:37:22'),
(6, 'Muhammad Ifzal Faidurrahman', 'default.png', 3123522006, '081907150471', 'Ifzal@user', '$2a$10$hF6A/TqThiDfvuCNhPwV6erInYnc2oE..dOTl86o4YVRIj8i/T0uG', '2024-06-01 19:38:06'),
(7, 'Dafa Ahmad Fahrisi', 'default.png', 3123522007, '081359684101', 'Dafa@user', '$2a$10$xj9691J5jVl76vAhTDpEMOOP56VMUjF9wetERQk6iZuQxnKLwZta6', '2024-07-01 19:38:27'),
(8, 'Ahmad Ari Fauzi', 'default.png', 3123522008, '082335838167', 'Ari@user', '$2a$10$hEipWB5Rqns4gIZfGa.LsOyhdpcXWn5qYUOMAOZU4pxXEBZaTltRO', '2024-09-01 19:38:49'),
(9, 'Rahmat M. Alfatih', 'default.png', 3123522009, '082140651676', 'Alfatih@user', '$2a$10$IsCulmEvDNMLEctzZ2frOu1Q.hh26vrbkjaxery3VnvWC4q1hqE2K', '2024-09-01 19:39:29'),
(10, 'Aqil Yoga Pramono', 'default.png', 3123522011, '089531322122', 'Aqil@user', '$2a$10$xqlcvhBfgB5xKt4SvKSld.3zSKJgsIGzAHKouDUD9yjItSiglC/Aa', '2024-10-01 19:39:53'),
(11, 'R.P. A. Lexy Mangku Saputra', 'default.png', 3123522012, '081238000447', 'Lexy@user', '$2a$10$AU8OZpbVUn28oFcNms4McOPcQLGmNY2ACE2.Jq4ZmUBZ9UpFPuifC', '2024-11-01 19:40:16'),
(12, 'A. Haidar Hafiz', 'default.png', 3123522015, '085230732988', 'Haidar@user', '$2a$10$gEmuyvEjpSh510uWzFulBuoTNF0FW65sTTbB3Zf54b3TExqWPA6sK', '2024-12-01 19:40:41'),
(13, 'Agiel Maula', 'default.png', 3123522016, '085173172800', 'Agiel@user', '$2a$10$zQYjhqZrkVPAzOe7GDCN4OL7K5V.DZl7myot1/.k1RFq5wGZnNnya', '2024-01-01 19:40:58'),
(14, 'Moh Iqbal Triwijaya', 'default.png', 3123522017, '087716845414', 'Iqbal@user', '$2a$10$FLbke3eEOR3Ngc6ZaU4k1O68wCXPe4l.2ny8vwxNdqBPou6bDqa3O', '2024-02-01 19:41:14'),
(15, 'Rahadyan Danang Susetyo Pranawa', 'default.png', 3123522018, '081235163528', 'Danang@user', '$2a$10$0I2bA1fW4hGFsDV.W7g7KuTfKCyLpQzZCunYlcdBgWja/pNP0xCry', '2024-05-01 19:41:40'),
(16, 'Tamisa Ulinda Marpaung', 'default.png', 3123522019, '082367702965', 'Tamisa@user', '$2a$10$c45BM.Tr5y.iEDx0y7Zhse4cozkuJcYOHeXIXVnbYwXw0CcIFNT3i', '2024-09-01 19:41:55');

-- --------------------------------------------------------

--
-- Table structure for table `validasi`
--

CREATE TABLE `validasi` (
  `id_validasi` int NOT NULL,
  `id_kontribusi` int NOT NULL,
  `id_user_pelapor` int NOT NULL,
  `laporan` text,
  `waktu_validasi` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `acara`
--
ALTER TABLE `acara`
  ADD PRIMARY KEY (`id_acara`),
  ADD KEY `id_pembuat_acara` (`id_pembuat_acara`);

--
-- Indexes for table `kontribusi`
--
ALTER TABLE `kontribusi`
  ADD PRIMARY KEY (`id_kontribusi`),
  ADD KEY `id_acara` (`id_acara`),
  ADD KEY `id_penyumbang` (`id_penyumbang`);

--
-- Indexes for table `kontribusi_barang`
--
ALTER TABLE `kontribusi_barang`
  ADD PRIMARY KEY (`id_kontribusi_barang`),
  ADD KEY `id_kontribusi` (`id_kontribusi`);

--
-- Indexes for table `kontribusi_uang`
--
ALTER TABLE `kontribusi_uang`
  ADD PRIMARY KEY (`id_kontribusi_uang`),
  ADD KEY `id_kontribusi` (`id_kontribusi`);

--
-- Indexes for table `superuser`
--
ALTER TABLE `superuser`
  ADD PRIMARY KEY (`id_superuser`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `NIK` (`NIK`),
  ADD UNIQUE KEY `no_wa` (`no_wa`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `validasi`
--
ALTER TABLE `validasi`
  ADD PRIMARY KEY (`id_validasi`),
  ADD KEY `id_kontribusi` (`id_kontribusi`),
  ADD KEY `id_user_pelapor` (`id_user_pelapor`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `acara`
--
ALTER TABLE `acara`
  MODIFY `id_acara` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kontribusi`
--
ALTER TABLE `kontribusi`
  MODIFY `id_kontribusi` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kontribusi_barang`
--
ALTER TABLE `kontribusi_barang`
  MODIFY `id_kontribusi_barang` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kontribusi_uang`
--
ALTER TABLE `kontribusi_uang`
  MODIFY `id_kontribusi_uang` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `superuser`
--
ALTER TABLE `superuser`
  MODIFY `id_superuser` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id_user` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `validasi`
--
ALTER TABLE `validasi`
  MODIFY `id_validasi` int NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `acara`
--
ALTER TABLE `acara`
  ADD CONSTRAINT `acara_ibfk_1` FOREIGN KEY (`id_pembuat_acara`) REFERENCES `user` (`id_user`) ON DELETE SET NULL;

--
-- Constraints for table `kontribusi`
--
ALTER TABLE `kontribusi`
  ADD CONSTRAINT `kontribusi_ibfk_1` FOREIGN KEY (`id_acara`) REFERENCES `acara` (`id_acara`) ON DELETE CASCADE,
  ADD CONSTRAINT `kontribusi_ibfk_2` FOREIGN KEY (`id_penyumbang`) REFERENCES `user` (`id_user`) ON DELETE CASCADE;

--
-- Constraints for table `kontribusi_barang`
--
ALTER TABLE `kontribusi_barang`
  ADD CONSTRAINT `kontribusi_barang_ibfk_1` FOREIGN KEY (`id_kontribusi`) REFERENCES `kontribusi` (`id_kontribusi`) ON DELETE CASCADE;

--
-- Constraints for table `kontribusi_uang`
--
ALTER TABLE `kontribusi_uang`
  ADD CONSTRAINT `kontribusi_uang_ibfk_1` FOREIGN KEY (`id_kontribusi`) REFERENCES `kontribusi` (`id_kontribusi`) ON DELETE CASCADE;

--
-- Constraints for table `validasi`
--
ALTER TABLE `validasi`
  ADD CONSTRAINT `validasi_ibfk_1` FOREIGN KEY (`id_kontribusi`) REFERENCES `kontribusi` (`id_kontribusi`) ON DELETE CASCADE,
  ADD CONSTRAINT `validasi_ibfk_2` FOREIGN KEY (`id_user_pelapor`) REFERENCES `user` (`id_user`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
