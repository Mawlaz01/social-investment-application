-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 10, 2024 at 12:39 PM
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
-- Database: `social_investment_app`
--

-- --------------------------------------------------------

--
-- Table structure for table `acara`
--

CREATE TABLE `acara` (
  `id_acara` int NOT NULL,
  `nama_acara` varchar(100) NOT NULL,
  `waktu_acara` datetime NOT NULL,
  `acara_selesai` datetime NOT NULL,
  `lokasi_acara` varchar(255) NOT NULL,
  `keterangan` text,
  `informasi_kontak` varchar(100) DEFAULT NULL,
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
  `nama_barang` varchar(100) NOT NULL,
  `jumlah_barang` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `kontribusi_uang`
--

CREATE TABLE `kontribusi_uang` (
  `id_kontribusi_uang` int NOT NULL,
  `id_kontribusi` int NOT NULL,
  `jumlah_uang` decimal(15,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `superuser`
--

CREATE TABLE `superuser` (
  `id_superuser` int NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `superuser`
--

INSERT INTO `superuser` (`id_superuser`, `email`, `password`) VALUES
(1, 'Ifzal@superuser', '$2b$10$CnPl3GOdcMwIYoADxa1xK..w8SXFBDHyfappN8Y9cOLhwPwIhOS1C'),
(2, 'Aqil@superuser', '$2b$10$AguSEkCnERBKPuZNnykgn.gIrSHiXJV2Pi7bvk2/qGaYgeHk5nz1e'),
(3, 'Agiel@superuser', '$2b$10$lnokCd.Lwjk4xffC2pvwjOI.DmAix3Ktkx1/GraBD67lq4dSqnwjy'),
(4, 'Iqbal@superuser', '$2b$10$sT2tSE5kHuhUJ.C3a1bj5eoy4S2Ua5N58r2MDvQ8t8qfxl7d139te'),
(5, 'Tamisa@superuser', '$2b$10$wwuB6g7d.ruADDYzvvE0l.HKc.i.wBzW37kBx7slF/G8aTGJBdkYC');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id_user` int NOT NULL,
  `nama` varchar(100) NOT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `NIK` bigint NOT NULL,
  `no_wa` varchar(15) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `tanggal_daftar` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id_user`, `nama`, `foto`, `NIK`, `no_wa`, `email`, `password`, `tanggal_daftar`) VALUES
(1, 'Ibram Maulana Akhsanul Qasasi', 'default.png', 3123522001, '085852769382', 'Ibram@user', '$2b$10$vWfyJJ6AX954DgQ5Y1XqMO1NzDJAfcvrNaCkx/N7ybrix9.fYb7mC', '2024-02-10 09:27:47'),
(2, 'Ahmad Maulana Afandi', 'default.png', 3123522002, '081359375146', 'Afandi@user', '$2b$10$M2AC1ES3tPnpBqRpWbv7H.EwXV8mwSfN842nwD9aasZsBZu6PIMAW', '2024-02-10 09:28:40'),
(3, 'Almas Daffa Avicena', 'default.png', 3123522003, '088213135658', 'Daffa@user', '$2b$10$Xnx1Erq8lWs9fTtL77Obm.dsN5sA0ZR4aIp11aHDRvg./IoOehC5W', '2024-03-10 09:29:05'),
(4, 'Eka Intan Mauliyana', 'default.png', 3123522004, '081937925108', 'Intan@user', '$2b$10$aT3VhoQqZ2ZqPn2X4uo7JefKnZW0xKE1ALHkzteTLI2ZGEF6dOQp2', '2024-04-10 09:29:35'),
(5, 'Vernanda Mulia Hamonangan Manurung', 'default.png', 3123522005, '081216679709', 'Vernanda@user', '$2b$10$rm.va82kBUHkP6bLQxjwfueWFeMajSTqBI2fWwmwGQS3r2l6pxWxS', '2024-05-10 09:29:58'),
(6, 'Muhammad Ifzal Faidurrahman', 'default.png', 3123522006, '081907150471', 'Ifzal@user', '$2b$10$QIBvD8XwcklO266ae04H7ODnCnw/m/cxZstEcfq9l4mlNdyWwdNJG', '2024-06-10 09:30:24'),
(7, 'Dafa Ahmad Fahrisi', 'default.png', 3123522007, '081359684101', 'Dafa@user', '$2b$10$/l.j7EcBiMzP7WjUT84AyuHfGfpOYhw2JiZUwVWUmHVNkTtOFOaXq', '2024-07-10 09:30:45'),
(8, 'Ahmad Ari Fauzi', 'default.png', 3123522008, '082335838167', 'Ari@user', '$2b$10$aG84lbmo3kwUAMuMgHDIxOp1P74Nk8mZ7uyqEtXqRCT9eBC1KZEtW', '2024-09-10 09:31:10'),
(9, 'Rahmat M. Alfatih', 'default.png', 3123522009, '082140651676', 'Alfatih@user', '$2b$10$ybiDIuRon1iwkwnII2VUAOnTyZ4glS.BPAdLSXpK5.tnYVei7AgS6', '2024-09-10 09:31:34'),
(10, 'Aqil Yoga Pramono', 'default.png', 3123522011, '089531322122', 'Aqil@user', '$2b$10$fqyhjw3NrLsOKJVBOp1jCOpTkrUDuZETCvPfznT4tjtozD8ZtZwZy', '2024-10-10 09:32:03'),
(11, 'R.P. A. Lexy Mangku Saputra', 'default.png', 3123522012, '081238000447', 'Lexy@user', '$2b$10$1Li/5q4XtW50VYemOnQzauRjayopuAGVVdEXDNmfzsC5/6GeUAQIK', '2024-11-10 09:32:25'),
(12, 'A. Haidar Hafiz', 'default.png', 3123522015, '085230732988', 'Haidar@user', '$2b$10$SbNYcp7tYkaAT.Mx0lKDnO4vjqdKbJ5Jp45KdSR0fFJN.T1H0re52', '2024-12-10 09:33:36'),
(13, 'Agiel Maula', 'default.png', 3123522016, '085173172800', 'Agiel@user', '$2b$10$na25yn7eeCz2cDq/ebO63.MWSICNsWRjsKsPhYjmipptm8FejcE/u', '2024-01-15 09:34:15'),
(14, 'Moh Iqbal Triwijaya', 'default.png', 3123522017, '087716845414', 'Iqbal@user', '$2b$10$eIlDwfpZQIrBw88GEpKI2eYuB7hazk4ou/W58XVHBI/Z714fRHlMe', '2024-02-15 09:34:39'),
(15, 'Rahadyan Danang Susetyo Pranawa', 'default.png', 3123522018, '081235163528', 'Danang@user', '$2b$10$T9UYUSFeVN9WqSy7xhjY6.TEIsoNEZsvVL8UlOWZTfAIH8K4N1Svq', '2024-05-15 09:35:03'),
(16, 'Tamisa Ulinda Marpaung', 'default.png', 3123522019, '082367702965', 'Tamisa@user', '$2b$10$cXvR7T8VBR38fw66l7nN8ODWCODunLZOASN.a8zkSjkXbDfU.uQ3y', '2024-09-15 09:36:23');

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
