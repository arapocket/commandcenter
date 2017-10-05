# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.7.19)
# Database: foxwatch
# Generation Time: 2017-10-05 02:00:50 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table checkpoint
# ------------------------------------------------------------

DROP TABLE IF EXISTS `checkpoint`;

CREATE TABLE `checkpoint` (
  `CheckpointID` varchar(9) NOT NULL DEFAULT '',
  `Sequence` tinyint(4) NOT NULL,
  `Lat` decimal(15,10) NOT NULL,
  `Lng` decimal(15,10) NOT NULL,
  `RouteID` varchar(9) NOT NULL DEFAULT '',
  PRIMARY KEY (`CheckpointID`),
  KEY `routeID` (`RouteID`),
  CONSTRAINT `FK_checkpoint_route` FOREIGN KEY (`RouteID`) REFERENCES `route` (`RouteID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table coordinate
# ------------------------------------------------------------

DROP TABLE IF EXISTS `coordinate`;

CREATE TABLE `coordinate` (
  `CoordID` varchar(9) NOT NULL DEFAULT '',
  `Sequence` smallint(6) NOT NULL,
  `Lat` decimal(15,10) NOT NULL,
  `Lng` decimal(15,10) NOT NULL,
  `PatrolID` varchar(9) NOT NULL DEFAULT '',
  PRIMARY KEY (`CoordID`),
  KEY `patrolID` (`PatrolID`),
  CONSTRAINT `FK_coordinate_patrol` FOREIGN KEY (`PatrolID`) REFERENCES `patrol` (`PatrolID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table guard
# ------------------------------------------------------------

DROP TABLE IF EXISTS `guard`;

CREATE TABLE `guard` (
  `GuardID` varchar(9) NOT NULL DEFAULT '',
  `FirstName` varchar(20) NOT NULL DEFAULT '',
  `LastName` varchar(20) NOT NULL DEFAULT '',
  `OrganizationID` varchar(9) NOT NULL DEFAULT '',
  PRIMARY KEY (`GuardID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table guardlocation
# ------------------------------------------------------------

DROP TABLE IF EXISTS `guardlocation`;

CREATE TABLE `guardlocation` (
  `LocationID` varchar(9) CHARACTER SET utf8 NOT NULL DEFAULT '',
  `Lat` decimal(15,10) NOT NULL,
  `Lng` decimal(15,10) NOT NULL,
  `GuardID` varchar(9) CHARACTER SET utf8 NOT NULL DEFAULT '',
  PRIMARY KEY (`LocationID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table incident
# ------------------------------------------------------------

DROP TABLE IF EXISTS `incident`;

CREATE TABLE `incident` (
  `IncidentID` varchar(9) NOT NULL DEFAULT '',
  `Description` text,
  `Type` tinytext NOT NULL,
  `Lat` decimal(15,10) NOT NULL,
  `Lng` decimal(15,10) NOT NULL,
  `PatrolID` varchar(9) NOT NULL DEFAULT '',
  PRIMARY KEY (`IncidentID`),
  KEY `patrolID` (`PatrolID`),
  CONSTRAINT `FK_report_patrol` FOREIGN KEY (`PatrolID`) REFERENCES `patrol` (`PatrolID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table patrol
# ------------------------------------------------------------

DROP TABLE IF EXISTS `patrol`;

CREATE TABLE `patrol` (
  `PatrolID` varchar(9) NOT NULL DEFAULT '',
  `GuardID` varchar(9) NOT NULL DEFAULT '',
  PRIMARY KEY (`PatrolID`),
  KEY `shiftID` (`GuardID`),
  CONSTRAINT `FK_patrol_guard` FOREIGN KEY (`GuardID`) REFERENCES `guard` (`GuardID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table route
# ------------------------------------------------------------

DROP TABLE IF EXISTS `route`;

CREATE TABLE `route` (
  `RouteID` varchar(9) NOT NULL DEFAULT '',
  `RouteName` varchar(20) NOT NULL DEFAULT '',
  PRIMARY KEY (`RouteID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
