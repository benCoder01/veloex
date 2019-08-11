-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: mariadb
-- Erstellungszeit: 11. Aug 2019 um 14:36
-- Server-Version: 10.4.7-MariaDB-1:10.4.7+maria~bionic
-- PHP-Version: 7.2.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `test`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `packet`
--

CREATE TABLE `packet` (
  `Packetid` int(8) NOT NULL,
  `status` varchar(30) NOT NULL,
  `size` longtext NOT NULL,
  `weight` float NOT NULL,
  `origin` longtext NOT NULL,
  `destination` longtext NOT NULL,
  `pickuptime` longtext NOT NULL,
  `senderid` int(11) NOT NULL,
  `driverid` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `packet`
--
ALTER TABLE `packet`
  ADD PRIMARY KEY (`Packetid`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `packet`
--
ALTER TABLE `packet`
  MODIFY `Packetid` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
