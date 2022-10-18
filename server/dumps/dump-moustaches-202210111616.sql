-- MySQL dump 10.13  Distrib 8.0.30, for macos12 (x86_64)
--
-- Host: 127.0.0.1    Database: moustaches
-- ------------------------------------------------------
-- Server version	8.0.30

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Species`
--

DROP TABLE IF EXISTS `Species`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Species` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Species`
--

LOCK TABLES `Species` WRITE;
/*!40000 ALTER TABLE `Species` DISABLE KEYS */;
INSERT INTO `Species` VALUES (1,'Chat');
INSERT INTO `Species` VALUES (2,'Chien');
/*!40000 ALTER TABLE `Species` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Animals`
--

DROP TABLE IF EXISTS `Animals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Animals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `species_id` int NOT NULL,
  `icad` varchar(15) DEFAULT NULL,
  `birthdate` date DEFAULT NULL,
  `entry_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `distinctive_signs` varchar(255) DEFAULT NULL,
  `reason_for_care` varchar(255) DEFAULT NULL,
  `place_of_care` varchar(255) DEFAULT NULL,
  `care_infos` varchar(255) DEFAULT NULL,
  `exit_date` date DEFAULT NULL,
  `exit_reason` varchar(255) DEFAULT NULL,
  `exit_infos` varchar(255) DEFAULT NULL,
  `death_date` date DEFAULT NULL,
  `death_reason` varchar(255) DEFAULT NULL,
  `sexe` enum('male','female') DEFAULT NULL,
  `race` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_AnimalsSpecies` (`species_id`),
  CONSTRAINT `FK_AnimalsSpecies` FOREIGN KEY (`species_id`) REFERENCES `Species` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Animals`
--

LOCK TABLES `Animals` WRITE;
/*!40000 ALTER TABLE `Animals` DISABLE KEYS */;
INSERT INTO `Animals` VALUES (1,'Sélina',1,NULL,NULL,'2022-10-05 13:30:04',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO `Animals` VALUES (2,'Dakota',2,NULL,NULL,'2022-10-05 13:30:04',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `Animals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HostFamilies`
--

DROP TABLE IF EXISTS `HostFamilies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HostFamilies` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `phone` varchar(100) DEFAULT NULL,
  `mail` varchar(100) DEFAULT NULL,
  `social_network_alias` varchar(100) DEFAULT NULL,
  `driver_license` tinyint(1) DEFAULT NULL,
  `nb_children` int DEFAULT NULL,
  `children_infos` varchar(255) DEFAULT NULL,
  `animals_infos` varchar(255) DEFAULT NULL,
  `can_provide_veterinary_care` tinyint(1) DEFAULT NULL,
  `can_provide_sociabilisation` tinyint(1) DEFAULT NULL,
  `can_host_disable_animal` tinyint(1) DEFAULT NULL,
  `can_provide_night_care` tinyint(1) DEFAULT NULL,
  `observations` varchar(255) DEFAULT NULL,
  `housing_informations` varchar(255) DEFAULT NULL,
  `can_isolate` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HostFamilies`
--

LOCK TABLES `HostFamilies` WRITE;
/*!40000 ALTER TABLE `HostFamilies` DISABLE KEYS */;
INSERT INTO `HostFamilies` VALUES (1,'Derache','Cédric','0664479394','cedric.derache@hotmail.fr','Cédric Derache',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `HostFamilies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AnimalsToHostFamilies`
--

DROP TABLE IF EXISTS `AnimalsToHostFamilies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AnimalsToHostFamilies` (
  `animal_id` int NOT NULL,
  `host_family_id` int NOT NULL,
  `entry_date` date NOT NULL,
  `exit_date` date DEFAULT NULL,
  PRIMARY KEY (`animal_id`,`host_family_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AnimalsToHostFamilies`
--

LOCK TABLES `AnimalsToHostFamilies` WRITE;
/*!40000 ALTER TABLE `AnimalsToHostFamilies` DISABLE KEYS */;
INSERT INTO `AnimalsToHostFamilies` VALUES (1,1,'2022-09-10',NULL);
/*!40000 ALTER TABLE `AnimalsToHostFamilies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Veterinarians`
--

DROP TABLE IF EXISTS `Veterinarians`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Veterinarians` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `phone` varchar(100) NOT NULL,
  `mail` varchar(100) DEFAULT NULL,
  `emergencies` tinyint(1) DEFAULT NULL,
  `appointment_confirmation_procedure` varchar(255) DEFAULT NULL,
  `invoice_payment_date` varchar(255) DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Veterinarians`
--

LOCK TABLES `Veterinarians` WRITE;
/*!40000 ALTER TABLE `Veterinarians` DISABLE KEYS */;
INSERT INTO `Veterinarians` VALUES (1,'Docteur Vigneron','0240030714','vigneron@veterinaires.com',NULL,'Mail','A la fin du mois','Virement','155 Route de Clisson, 44230 Saint-Sébastien-sur-Loire');
/*!40000 ALTER TABLE `Veterinarians` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `VeterinarianInterventions`
--

DROP TABLE IF EXISTS `VeterinarianInterventions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `VeterinarianInterventions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `veterinarian_id` int NOT NULL,
  `date` date NOT NULL,
  `description` varchar(255) NOT NULL,
  `animal_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `veterinarian_id` (`veterinarian_id`),
  KEY `FK_AnimalVeterinarianIntervention` (`animal_id`),
  CONSTRAINT `FK_AnimalVeterinarianIntervention` FOREIGN KEY (`animal_id`) REFERENCES `Animals` (`id`),
  CONSTRAINT `veterinarianinterventions_ibfk_1` FOREIGN KEY (`veterinarian_id`) REFERENCES `Veterinarians` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `VeterinarianInterventions`
--

LOCK TABLES `VeterinarianInterventions` WRITE;
/*!40000 ALTER TABLE `VeterinarianInterventions` DISABLE KEYS */;
/*!40000 ALTER TABLE `VeterinarianInterventions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'moustaches'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-10-11 16:16:39
