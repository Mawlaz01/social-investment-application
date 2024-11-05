-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Waktu pembuatan: 05 Nov 2024 pada 04.52
-- Versi server: 8.0.30
-- Versi PHP: 8.1.10

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
-- Struktur dari tabel `acara`
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

--
-- Dumping data untuk tabel `acara`
--

INSERT INTO `acara` (`id_acara`, `nama_acara`, `waktu_acara`, `acara_selesai`, `lokasi_acara`, `keterangan`, `informasi_kontak`, `id_pembuat_acara`) VALUES
(1, 'agielnikah', '2024-11-04 14:13:00', '2024-11-04 14:13:00', 'peliang-tanggumung', 'agiel nikahan dengan sutarni', '081938734535', 2);

--
-- Trigger `acara`
--
DELIMITER $$
CREATE TRIGGER `before_delete_acara` BEFORE DELETE ON `acara` FOR EACH ROW BEGIN
    DECLARE days_difference INT;
    SET days_difference = DATEDIFF(CURRENT_DATE, OLD.waktu_acara);
    IF days_difference > 7 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Penghapusan tidak diperbolehkan setelah 7 hari dari waktu acara.';
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `before_update_acara` BEFORE UPDATE ON `acara` FOR EACH ROW BEGIN
    DECLARE days_difference INT;
    SET days_difference = DATEDIFF(CURRENT_DATE, OLD.waktu_acara);
    IF days_difference > 7 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Edit tidak diperbolehkan setelah 7 hari dari waktu acara.';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Struktur dari tabel `kontribusi`
--

CREATE TABLE `kontribusi` (
  `id_kontribusi` int NOT NULL,
  `id_acara` int NOT NULL,
  `id_penyumbang` int NOT NULL,
  `tanggal_sumbangan` datetime DEFAULT CURRENT_TIMESTAMP,
  `tanggal_edit_sumbangan` datetime DEFAULT NULL,
  `status_validasi` enum('belum divalidasi','valid','tidak valid') DEFAULT 'belum divalidasi'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `kontribusi`
--

INSERT INTO `kontribusi` (`id_kontribusi`, `id_acara`, `id_penyumbang`, `tanggal_sumbangan`, `tanggal_edit_sumbangan`, `status_validasi`) VALUES
(1, 1, 1, '2024-11-04 14:17:05', NULL, 'belum divalidasi');

-- --------------------------------------------------------

--
-- Struktur dari tabel `kontribusi_barang`
--

CREATE TABLE `kontribusi_barang` (
  `id_kontribusi_barang` int NOT NULL,
  `id_kontribusi` int NOT NULL,
  `jumlah_barang` varchar(100) NOT NULL,
  `nama_barang` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `kontribusi_uang`
--

CREATE TABLE `kontribusi_uang` (
  `id_kontribusi_uang` int NOT NULL,
  `id_kontribusi` int NOT NULL,
  `jumlah_uang` decimal(15,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `kontribusi_uang`
--

INSERT INTO `kontribusi_uang` (`id_kontribusi_uang`, `id_kontribusi`, `jumlah_uang`) VALUES
(1, 1, 10000.00);

-- --------------------------------------------------------

--
-- Struktur dari tabel `superuser`
--

CREATE TABLE `superuser` (
  `id_superuser` int NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `superuser`
--

INSERT INTO `superuser` (`id_superuser`, `email`, `password`) VALUES
(1, 'a@a', '$2b$10$qcetlz4eqqUpCwRJ5jeKquFkVswALRautvXBsJ9sXMDgrrCEtP/Zu');

-- --------------------------------------------------------

--
-- Struktur dari tabel `user`
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
-- Dumping data untuk tabel `user`
--

INSERT INTO `user` (`id_user`, `nama`, `foto`, `NIK`, `no_wa`, `email`, `password`, `tanggal_daftar`) VALUES
(1, '1', 'default.png', 1, '1', '1@1', '$2b$10$PIiiVdOoCoafE4Ulh8pZkO9MjUgNPnE6Q0/nsk2wPlwDyCVo1tGx.', '2024-11-04 13:47:10'),
(2, 'agiel', 'default.png', 2353300695, '0837655748', 'agielok@gmail.com', '$2b$10$cziH2MHk1TXWhdDIww53EuoMnnoZuyOx8fEmEsxttwfR42nsQ92u6', '2024-11-04 14:12:10');

-- --------------------------------------------------------

--
-- Struktur dari tabel `validasi`
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
-- Indeks untuk tabel `acara`
--
ALTER TABLE `acara`
  ADD PRIMARY KEY (`id_acara`),
  ADD KEY `id_pembuat_acara` (`id_pembuat_acara`),
  ADD KEY `idx_acara_waktu` (`waktu_acara`,`acara_selesai`);

--
-- Indeks untuk tabel `kontribusi`
--
ALTER TABLE `kontribusi`
  ADD PRIMARY KEY (`id_kontribusi`),
  ADD KEY `id_acara` (`id_acara`),
  ADD KEY `id_penyumbang` (`id_penyumbang`),
  ADD KEY `idx_kontribusi_status` (`status_validasi`);

--
-- Indeks untuk tabel `kontribusi_barang`
--
ALTER TABLE `kontribusi_barang`
  ADD PRIMARY KEY (`id_kontribusi_barang`),
  ADD KEY `id_kontribusi` (`id_kontribusi`);

--
-- Indeks untuk tabel `kontribusi_uang`
--
ALTER TABLE `kontribusi_uang`
  ADD PRIMARY KEY (`id_kontribusi_uang`),
  ADD KEY `id_kontribusi` (`id_kontribusi`);

--
-- Indeks untuk tabel `superuser`
--
ALTER TABLE `superuser`
  ADD PRIMARY KEY (`id_superuser`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indeks untuk tabel `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `NIK` (`NIK`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indeks untuk tabel `validasi`
--
ALTER TABLE `validasi`
  ADD PRIMARY KEY (`id_validasi`),
  ADD KEY `id_kontribusi` (`id_kontribusi`),
  ADD KEY `id_user_pelapor` (`id_user_pelapor`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `acara`
--
ALTER TABLE `acara`
  MODIFY `id_acara` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `kontribusi`
--
ALTER TABLE `kontribusi`
  MODIFY `id_kontribusi` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `kontribusi_barang`
--
ALTER TABLE `kontribusi_barang`
  MODIFY `id_kontribusi_barang` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `kontribusi_uang`
--
ALTER TABLE `kontribusi_uang`
  MODIFY `id_kontribusi_uang` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `superuser`
--
ALTER TABLE `superuser`
  MODIFY `id_superuser` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `user`
--
ALTER TABLE `user`
  MODIFY `id_user` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `validasi`
--
ALTER TABLE `validasi`
  MODIFY `id_validasi` int NOT NULL AUTO_INCREMENT;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `acara`
--
ALTER TABLE `acara`
  ADD CONSTRAINT `acara_ibfk_1` FOREIGN KEY (`id_pembuat_acara`) REFERENCES `user` (`id_user`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `kontribusi`
--
ALTER TABLE `kontribusi`
  ADD CONSTRAINT `kontribusi_ibfk_1` FOREIGN KEY (`id_acara`) REFERENCES `acara` (`id_acara`) ON DELETE CASCADE,
  ADD CONSTRAINT `kontribusi_ibfk_2` FOREIGN KEY (`id_penyumbang`) REFERENCES `user` (`id_user`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `kontribusi_barang`
--
ALTER TABLE `kontribusi_barang`
  ADD CONSTRAINT `kontribusi_barang_ibfk_1` FOREIGN KEY (`id_kontribusi`) REFERENCES `kontribusi` (`id_kontribusi`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `kontribusi_uang`
--
ALTER TABLE `kontribusi_uang`
  ADD CONSTRAINT `kontribusi_uang_ibfk_1` FOREIGN KEY (`id_kontribusi`) REFERENCES `kontribusi` (`id_kontribusi`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `validasi`
--
ALTER TABLE `validasi`
  ADD CONSTRAINT `validasi_ibfk_1` FOREIGN KEY (`id_kontribusi`) REFERENCES `kontribusi` (`id_kontribusi`) ON DELETE CASCADE,
  ADD CONSTRAINT `validasi_ibfk_2` FOREIGN KEY (`id_user_pelapor`) REFERENCES `user` (`id_user`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
