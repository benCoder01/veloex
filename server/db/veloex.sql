-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 18. Jul 2019 um 15:42
-- Server-Version: 10.3.16-MariaDB
-- PHP-Version: 7.3.7

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
  `size` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `weight` float NOT NULL,
  `origin` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `destination` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `pickuptime` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `senderid` int(11) NOT NULL,
  `driverid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `packet`
--

INSERT INTO `packet` (`Packetid`, `status`, `size`, `weight`, `origin`, `destination`, `pickuptime`, `senderid`, `driverid`) VALUES
(26, 'arrived', '{\"length\":0,\"depth\":0,\"height\":0}', 0, '12342323', '1234555', '{\"from\":\"12:30\",\"to\":\"13:00\"}', 27, 27),
(27, 'isdelivering', '{\"length\":0,\"depth\":0,\"height\":0}', 0, '12342323', '1234555', '{\"from\":\"12:30\",\"to\":\"13:00\"}', 27, 27);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(30) NOT NULL,
  `name` varchar(30) NOT NULL,
  `email` varchar(30) NOT NULL,
  `password` varchar(30) NOT NULL,
  `address` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `status` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `user`
--

INSERT INTO `user` (`id`, `username`, `name`, `email`, `password`, `address`, `status`) VALUES
(27, 'mustermann01', 'Max Mustermann', 'example@example.de', '$2b$10$p.fU7jDWwdxZJZPt7r5jvuC', '{\"nomen\":\"Max Mustermann\",\"street\":\"Musterstraße\",\"number\":\"18\",\"zip\":\"11111\",\"city\":\"Musterstadt\"}', 'sending');

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `packet`
--
ALTER TABLE `packet`
  ADD PRIMARY KEY (`Packetid`);

--
-- Indizes für die Tabelle `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`,`username`),
  ADD UNIQUE KEY `id_2` (`id`,`username`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `packet`
--
ALTER TABLE `packet`
  MODIFY `Packetid` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT für Tabelle `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
