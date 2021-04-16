-- MySQL dump 10.17  Distrib 10.3.20-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: lostfound
-- ------------------------------------------------------
-- Server version	10.3.20-MariaDB-1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `approved`
--

DROP TABLE IF EXISTS `approved`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `approved` (
  `id` int(11) NOT NULL,
  `lost` int(11) NOT NULL,
  `found` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `lost` (`lost`),
  KEY `found` (`found`),
  CONSTRAINT `approved_ibfk_1` FOREIGN KEY (`lost`) REFERENCES `losts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `approved_ibfk_2` FOREIGN KEY (`found`) REFERENCES `founds` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `approved`
--

LOCK TABLES `approved` WRITE;
/*!40000 ALTER TABLE `approved` DISABLE KEYS */;
/*!40000 ALTER TABLE `approved` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `founds`
--

DROP TABLE IF EXISTS `founds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `founds` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` tinytext NOT NULL,
  `category` int(11) NOT NULL,
  `content` text DEFAULT NULL,
  `lat` double NOT NULL,
  `longitude` double NOT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `author` int(11) NOT NULL,
  `accepted` tinyint(1) NOT NULL,
  `ups` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `author` (`author`),
  CONSTRAINT `founds_ibfk_2` FOREIGN KEY (`author`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `founds`
--

LOCK TABLES `founds` WRITE;
/*!40000 ALTER TABLE `founds` DISABLE KEYS */;
INSERT INTO `founds` VALUES (8,'found',4,'..',36.84516773486232,10.2687544003129,'2021-03-23 15:40:07',22,0,0),(9,'mm',6,'aa',36.84498313893961,10.269364267587662,'2021-03-30 09:48:11',22,0,0);
/*!40000 ALTER TABLE `founds` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `foundup_rooms`
--

DROP TABLE IF EXISTS `foundup_rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `foundup_rooms` (
  `postId` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  KEY `postId` (`postId`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `foundup_rooms_ibfk_1` FOREIGN KEY (`postId`) REFERENCES `founds` (`id`),
  CONSTRAINT `foundup_rooms_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `foundup_rooms`
--

LOCK TABLES `foundup_rooms` WRITE;
/*!40000 ALTER TABLE `foundup_rooms` DISABLE KEYS */;
/*!40000 ALTER TABLE `foundup_rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `losts`
--

DROP TABLE IF EXISTS `losts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `losts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` tinytext NOT NULL,
  `category` int(11) NOT NULL,
  `content` text DEFAULT NULL,
  `lat` double NOT NULL,
  `longitude` double NOT NULL,
  `search_area` int(11) NOT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `author` int(11) NOT NULL,
  `accepted` tinyint(1) NOT NULL,
  `ups` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `author` (`author`),
  CONSTRAINT `losts_ibfk_2` FOREIGN KEY (`author`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=95 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `losts`
--

LOCK TABLES `losts` WRITE;
/*!40000 ALTER TABLE `losts` DISABLE KEYS */;
INSERT INTO `losts` VALUES (84,'missing',4,'amine is missing',36.85139678106008,10.268022157251835,1606,'2021-03-09 10:15:51',18,0,0),(85,'missing',4,'..',36.86629297400805,10.26947021484375,2879,'2021-03-09 10:18:15',18,0,0),(86,'lost',4,' .',36.85357818213393,10.263944528996944,1897,'2021-03-23 15:38:58',22,0,0),(87,'blabla',4,'aa',36.84676388072928,10.271776914596558,2935,'2021-03-23 15:44:22',18,0,0),(88,'aa',4,'a',36.74124578692168,10.213920660316944,2472,'2021-03-28 20:54:23',18,0,0),(89,'aa',4,'a',36.74124578692168,10.213920660316944,2472,'2021-03-28 20:56:47',18,0,0),(90,'hello',4,'aa',36.84535662325214,10.268832184374332,1443,'2021-03-29 17:22:50',18,0,0),(91,'hello',4,'aa',36.84535662325214,10.268832184374332,1443,'2021-03-29 17:29:52',18,0,0),(92,'hello',4,'aa',36.84535662325214,10.268832184374332,1443,'2021-03-29 17:31:55',18,0,0),(93,'v',4,'ff',36.745665581445785,10.215152464807034,2249,'2021-03-29 22:06:32',18,0,0),(94,'lost',5,'yy',36.845127757004065,10.269414894282818,851,'2021-03-30 09:49:31',18,0,0);
/*!40000 ALTER TABLE `losts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lostup_rooms`
--

DROP TABLE IF EXISTS `lostup_rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lostup_rooms` (
  `postId` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  KEY `postId` (`postId`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `lostup_rooms_ibfk_1` FOREIGN KEY (`postId`) REFERENCES `losts` (`id`),
  CONSTRAINT `lostup_rooms_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lostup_rooms`
--

LOCK TABLES `lostup_rooms` WRITE;
/*!40000 ALTER TABLE `lostup_rooms` DISABLE KEYS */;
/*!40000 ALTER TABLE `lostup_rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `match_rooms`
--

DROP TABLE IF EXISTS `match_rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `match_rooms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `lostID` int(11) NOT NULL,
  `foundID` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_mr_key` (`lostID`,`foundID`)
) ENGINE=InnoDB AUTO_INCREMENT=104 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `match_rooms`
--

LOCK TABLES `match_rooms` WRITE;
/*!40000 ALTER TABLE `match_rooms` DISABLE KEYS */;
INSERT INTO `match_rooms` VALUES (92,89,8),(95,91,8),(97,92,8),(99,93,8),(102,94,8),(103,94,9);
/*!40000 ALTER TABLE `match_rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `content` mediumtext NOT NULL,
  `sender` int(11) NOT NULL,
  `room` int(11) DEFAULT NULL,
  `withImage` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `room` (`room`),
  KEY `sender` (`sender`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`room`) REFERENCES `rooms` (`id`),
  CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`sender`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=99 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (3,'2021-03-22 00:07:23','please',18,1,0),(4,'2021-03-22 00:07:23','bellehi',18,1,0),(5,'2021-03-22 00:07:23','aa',18,1,0),(6,'2021-03-22 00:07:23','ahla',18,1,0),(7,'2021-03-22 00:07:23','aaa',18,2,0),(8,'2021-03-22 00:07:23','aaam',18,2,0),(9,'2021-03-22 00:07:23','chbik',12,2,0),(10,'2021-03-22 00:07:23','chbik aa',12,2,0),(11,'2021-03-22 00:07:23','ooooooo enty winek wakt lbard kleni oh lasmer',12,2,0),(12,'2021-03-22 00:07:23','hello',18,3,0),(13,'2021-03-22 00:07:23','aa',18,3,0),(14,'2021-03-22 00:07:23','chnoi ? ',22,3,0),(15,'2021-03-22 00:07:23','aa',18,3,0),(16,'2021-03-22 00:07:23','aaaa',22,3,0),(17,'2021-03-22 00:07:23','winek ‎امين',22,3,0),(18,'2021-03-22 00:07:23','hani',18,3,0),(19,'2021-03-22 00:07:23','winek ‎اvideoمين',22,3,0),(20,'2021-03-22 00:07:23','ama video ',18,3,0),(21,'2021-03-22 00:07:23','saaaa',18,3,0),(22,'2021-03-22 00:07:23','aa',22,3,0),(23,'2021-03-22 00:07:23','chbik',18,3,0),(24,'2021-03-22 00:07:23','aa',18,3,0),(25,'2021-03-22 00:07:23','eeee',18,3,0),(26,'2021-03-22 00:07:23','aa',18,3,0),(27,'2021-03-22 00:07:23','bla bla',18,3,0),(28,'2021-03-22 00:07:23','slm ',18,3,0),(29,'2021-03-22 00:07:23','hi',18,2,0),(30,'2021-03-22 00:07:23','aa',22,3,0),(31,'2021-03-22 00:07:23','aa',22,3,0),(32,'2021-03-22 00:07:23','chbik',18,3,0),(33,'2021-03-22 00:07:23','ss',18,3,0),(34,'2021-03-22 00:07:23','qq',22,3,0),(35,'2021-03-22 00:07:23','slm',18,3,0),(36,'2021-03-22 00:07:23','aa',18,3,0),(37,'2021-03-22 00:07:23','aa',18,1,0),(38,'2021-03-22 00:07:23','bv',18,1,0),(39,'2021-03-22 00:07:23','ff',18,1,0),(40,'2021-03-22 00:07:23','qs',18,1,0),(41,'2021-03-22 00:07:23','aa',18,1,0),(42,'2021-03-22 00:07:23','vv',18,1,0),(43,'2021-03-22 00:07:23','as',18,1,0),(44,'2021-03-22 00:07:23','gg',18,1,0),(45,'2021-03-22 00:07:23','bb',18,1,0),(46,'2021-03-22 00:07:23','aa',18,1,0),(47,'2021-03-22 00:07:23','aa',18,2,0),(48,'2021-03-22 00:07:23','ss',18,2,0),(49,'2021-03-22 00:07:23','aa',18,3,0),(50,'2021-03-22 00:07:23','aa',18,1,0),(51,'2021-03-22 00:07:23','tt',18,2,0),(52,'2021-03-22 00:07:23','dd',18,2,0),(53,'2021-03-22 00:07:23','dd',18,1,0),(54,'2021-03-22 00:07:23','aa',18,1,0),(55,'2021-03-22 00:07:23','aee',18,1,0),(56,'2021-03-22 00:07:23','aaa',18,1,0),(57,'2021-03-22 00:07:23','aaa',18,1,0),(58,'2021-03-22 00:07:23','aaa',18,1,0),(59,'2021-03-22 00:07:23','yy',18,1,0),(60,'2021-03-22 00:07:23','aa',18,1,0),(61,'2021-03-22 00:07:23','zz',18,1,0),(62,'2021-03-22 00:07:23','',18,2,0),(63,'2021-03-22 00:07:23','aa',18,2,0),(64,'2021-03-22 00:07:23','Aaaa',18,2,0),(65,'2021-03-22 00:07:23','at',18,1,0),(66,'2021-03-22 00:07:23','aa',18,1,0),(67,'2021-03-22 00:07:23','awa',18,1,0),(68,'2021-03-22 00:07:23','awa',18,1,0),(69,'2021-03-22 00:07:23','att',18,2,0),(70,'2021-03-22 00:07:23','aaa',18,1,0),(71,'2021-03-22 00:07:23','aaaaaa',18,1,0),(72,'2021-03-22 00:07:23','aaa',18,1,0),(73,'2021-03-22 00:07:23','ee',18,1,0),(74,'2021-03-22 00:07:23','aa',18,1,0),(75,'2021-03-22 00:07:23','ttt',18,1,0),(76,'2021-03-22 00:07:23','rr',18,1,0),(77,'2021-03-22 00:07:23','sd',18,1,0),(78,'2021-03-22 00:07:23','sd',18,1,0),(79,'2021-03-22 00:07:23','agag',18,1,0),(80,'2021-03-22 00:07:23','afa',18,1,0),(81,'2021-03-22 00:07:23','aa',18,1,0),(82,'2021-03-22 00:07:23','ss',18,2,0),(83,'2021-04-04 19:06:59','aa',18,1,0),(84,'2021-04-04 19:06:59','aa',18,1,0),(85,'2021-04-04 19:06:59','aa',18,1,0),(86,'2021-04-04 19:06:59','aa',18,1,0),(87,'2021-04-04 19:06:59','aa',18,3,0),(88,'2021-04-04 19:06:59','qqa',18,1,0),(89,'2021-04-04 19:06:59','dd',18,2,0),(90,'2021-04-04 19:06:59','x',18,3,0),(91,'2021-04-04 19:06:59','a',18,3,0),(92,'2021-04-04 19:16:34','aa',18,3,0),(93,'2021-04-04 19:17:20','ff',18,3,0),(94,'2021-04-04 19:23:36','amine',18,3,1),(95,'2021-04-04 19:24:49','aa',18,3,1),(96,'2021-04-04 19:25:06','vb',18,3,0),(97,'2021-04-05 17:40:36','wuis',18,3,0),(98,'2021-04-05 17:41:21','.',22,3,1);
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `msgNotif`
--

DROP TABLE IF EXISTS `msgNotif`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `msgNotif` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `target` int(11) DEFAULT NULL,
  `message` int(11) DEFAULT NULL,
  `checked` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `fk_target` (`target`),
  KEY `fk_msg` (`message`),
  CONSTRAINT `fk_msg` FOREIGN KEY (`message`) REFERENCES `messages` (`id`),
  CONSTRAINT `fk_target` FOREIGN KEY (`target`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `msgNotif`
--

LOCK TABLES `msgNotif` WRITE;
/*!40000 ALTER TABLE `msgNotif` DISABLE KEYS */;
INSERT INTO `msgNotif` VALUES (1,17,39,0),(2,17,40,0),(3,17,41,0),(4,17,42,0),(5,17,43,0),(6,17,44,0),(7,17,45,0),(8,17,46,0),(9,12,47,0),(10,12,48,0),(11,22,49,0),(12,17,50,0),(13,12,51,0),(14,12,52,0),(15,17,53,0),(16,17,54,0),(17,17,55,0),(18,17,56,0),(19,17,57,0),(20,17,58,0),(21,17,59,0),(22,17,60,0),(23,17,61,0),(24,12,62,0),(25,12,63,0),(26,12,64,0),(27,17,65,0),(28,17,66,0),(29,17,67,0),(30,17,68,0),(31,12,69,0),(32,17,70,0),(33,17,71,0),(34,17,72,0),(35,17,73,0),(36,17,74,0),(37,17,75,0),(38,17,76,0),(39,17,77,0),(40,17,78,0),(41,17,79,0),(42,17,80,0),(43,17,81,0),(44,12,82,0),(45,17,83,0),(46,17,84,0),(47,17,85,0),(48,17,86,0),(49,22,87,0),(50,17,88,0),(51,12,89,0),(52,22,90,0),(53,22,91,0),(54,22,92,0),(55,22,93,0),(56,22,94,0),(57,22,95,0),(58,22,96,0),(59,22,97,0),(60,18,98,1);
/*!40000 ALTER TABLE `msgNotif` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications_found`
--

DROP TABLE IF EXISTS `notifications_found`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notifications_found` (
  `id` int(11) NOT NULL,
  `target_id` int(11) NOT NULL,
  `found_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_notif_found_user` (`target_id`),
  KEY `fk_notif_founds` (`found_id`),
  CONSTRAINT `fk_notif_found_user` FOREIGN KEY (`target_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_notif_founds` FOREIGN KEY (`found_id`) REFERENCES `founds` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications_found`
--

LOCK TABLES `notifications_found` WRITE;
/*!40000 ALTER TABLE `notifications_found` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications_found` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications_lost`
--

DROP TABLE IF EXISTS `notifications_lost`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notifications_lost` (
  `id` int(11) NOT NULL,
  `target_id` int(11) NOT NULL,
  `lost_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_notif_user` (`target_id`),
  KEY `fk_notif_losts` (`lost_id`),
  CONSTRAINT `fk_notif_losts` FOREIGN KEY (`lost_id`) REFERENCES `losts` (`id`),
  CONSTRAINT `fk_notif_user` FOREIGN KEY (`target_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications_lost`
--

LOCK TABLES `notifications_lost` WRITE;
/*!40000 ALTER TABLE `notifications_lost` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications_lost` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pending`
--

DROP TABLE IF EXISTS `pending`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pending` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` tinytext NOT NULL,
  `category` int(11) NOT NULL,
  `content` text DEFAULT NULL,
  `lat` double NOT NULL,
  `longitude` double NOT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `search_area` int(11) DEFAULT NULL,
  `image` varchar(50) DEFAULT NULL,
  `type` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pending`
--

LOCK TABLES `pending` WRITE;
/*!40000 ALTER TABLE `pending` DISABLE KEYS */;
/*!40000 ALTER TABLE `pending` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rooms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user1` int(11) NOT NULL,
  `user2` int(11) NOT NULL,
  `messages_num` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user1` (`user1`),
  KEY `user2` (`user2`),
  CONSTRAINT `rooms_ibfk_1` FOREIGN KEY (`user1`) REFERENCES `users` (`id`),
  CONSTRAINT `rooms_ibfk_2` FOREIGN KEY (`user2`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (1,17,18,14),(2,12,18,0),(3,18,22,0);
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(20) DEFAULT NULL,
  `fullname` varchar(50) DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `admin` tinyint(1) DEFAULT NULL,
  `super_admin` tinyint(1) DEFAULT NULL,
  `password` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UC_username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'aminedakhlii','amine dakhli','aa@aa.com',1,1,'amine'),(12,'test','test','test',1,1,'$2b$10$8QbKyTvTI9xE4Mptr6obfOBGycUvk0SxxStkNX7IIrL/tb04Ggrv6'),(14,'admin','qq','qq',1,0,'$2b$10$mCs4baobENvawGFvrGhR..6SSWf3Fds6nqFyVjrYyID25zjHCqHUy'),(17,'john','jj','none@none.none',1,0,'$2b$10$R8KEO/duVuepOVumB0mG7O4GHg8J6mE6Dak05c1FYRUii6HUxeJXu'),(18,'amine','aa','amine.dakhli@medtech.tn',0,0,'$2b$10$4I4c5IevGRCluwor6SB5su47MjQtmRHZkUk8U3UMrrHmk/du1SX1q'),(22,'rafik','rafik d','raf@raf',0,0,'$2b$10$J/7M8v3YZUD3PHDQzQ/P9ufjVi3bmQfYrnzwoelqb.VWD/KNNtwQu');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-04-16  7:29:06
