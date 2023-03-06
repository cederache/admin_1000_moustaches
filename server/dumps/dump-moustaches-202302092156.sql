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
INSERT INTO `Species` VALUES (1,'Chat'),(2,'Chien');
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
  `icad` varchar(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
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
  `sterilised` tinyint(1) DEFAULT NULL,
  `first_vaccination_date` date DEFAULT NULL,
  `second_vaccination_date` date DEFAULT NULL,
  `fiv_negative` tinyint(1) DEFAULT NULL,
  `felv_negative` tinyint(1) DEFAULT NULL,
  `health_issues` varchar(255) DEFAULT NULL,
  `behaviour` varchar(255) DEFAULT NULL,
  `adopted` tinyint(1) DEFAULT '0',
  `broadcastable` tinyint(1) DEFAULT '0',
  `bookable` tinyint(1) DEFAULT '0',
  `need_external_access` tinyint(1) DEFAULT NULL,
  `transferor` varchar(255) DEFAULT NULL,
  `anti_parasitic_date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_AnimalsSpecies` (`species_id`),
  CONSTRAINT `FK_AnimalsSpecies` FOREIGN KEY (`species_id`) REFERENCES `Species` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Animals`
--

LOCK TABLES `Animals` WRITE;
/*!40000 ALTER TABLE `Animals` DISABLE KEYS */;
INSERT INTO `Animals` VALUES (1,'Sélina',1,'1982 198219 82','2012-10-20','2022-10-05 00:00:00','chat craintif','Trouvée dehors','nantes','info',NULL,NULL,NULL,NULL,NULL,'female','Tabby',1,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,NULL,NULL),(2,'Dakota',2,NULL,NULL,'2022-10-05 13:30:04',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,NULL,NULL,NULL),(4,'Oswald',1,NULL,NULL,'2022-10-04 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1,1,NULL,NULL,NULL);
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
  `animals_infos` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `can_provide_veterinary_care` tinyint(1) DEFAULT NULL,
  `can_provide_sociabilisation` tinyint(1) DEFAULT NULL,
  `can_host_disable_animal` tinyint(1) DEFAULT NULL,
  `can_provide_night_care` tinyint(1) DEFAULT NULL,
  `observations` varchar(255) DEFAULT NULL,
  `housing_informations` varchar(255) DEFAULT NULL,
  `can_isolate` tinyint(1) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `host_conditions` varchar(255) DEFAULT NULL,
  `on_break` tinyint(1) NOT NULL DEFAULT '0',
  `membership_up_to_date` tinyint(1) NOT NULL DEFAULT '0',
  `referent_id` int DEFAULT NULL,
  `is_temporary` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `HostFamilies_FK` (`referent_id`),
  CONSTRAINT `HostFamilies_FK` FOREIGN KEY (`referent_id`) REFERENCES `Users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HostFamilies`
--

LOCK TABLES `HostFamilies` WRITE;
/*!40000 ALTER TABLE `HostFamilies` DISABLE KEYS */;
INSERT INTO `HostFamilies` VALUES (1,'Derache','Cédric','06644793','cedric.derache@hotmail.fr','Cédric Derache',1,NULL,NULL,'',NULL,NULL,NULL,0,'',NULL,1,'4 allée Maudy Piot 44200 Nantes',47.1928921,-1.5367827,NULL,1,0,2,1),(7,'Martin','Jacques',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,1,NULL,0);
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
  PRIMARY KEY (`animal_id`,`host_family_id`),
  KEY `host_family_id` (`host_family_id`),
  CONSTRAINT `animalstohostfamilies_ibfk_1` FOREIGN KEY (`host_family_id`) REFERENCES `HostFamilies` (`id`),
  CONSTRAINT `animalstohostfamilies_ibfk_2` FOREIGN KEY (`animal_id`) REFERENCES `Animals` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AnimalsToHostFamilies`
--

LOCK TABLES `AnimalsToHostFamilies` WRITE;
/*!40000 ALTER TABLE `AnimalsToHostFamilies` DISABLE KEYS */;
INSERT INTO `AnimalsToHostFamilies` VALUES (1,1,'2022-09-21',NULL);
/*!40000 ALTER TABLE `AnimalsToHostFamilies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HostFamilyKinds`
--

DROP TABLE IF EXISTS `HostFamilyKinds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HostFamilyKinds` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HostFamilyKinds`
--

LOCK TABLES `HostFamilyKinds` WRITE;
/*!40000 ALTER TABLE `HostFamilyKinds` DISABLE KEYS */;
INSERT INTO `HostFamilyKinds` VALUES (1,'Chats'),(2,'Chatons + Maman'),(3,'Chiens'),(4,'Chatons biberonnage'),(5,'Chiots'),(6,'Lapins');
/*!40000 ALTER TABLE `HostFamilyKinds` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HostFamilyToHostFamilyKinds`
--

DROP TABLE IF EXISTS `HostFamilyToHostFamilyKinds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HostFamilyToHostFamilyKinds` (
  `host_family_id` int NOT NULL,
  `host_family_kind_id` int DEFAULT NULL,
  KEY `host_family_id` (`host_family_id`),
  KEY `host_family_kind_id` (`host_family_kind_id`),
  CONSTRAINT `hostfamilytohostfamilykinds_ibfk_1` FOREIGN KEY (`host_family_id`) REFERENCES `HostFamilies` (`id`),
  CONSTRAINT `hostfamilytohostfamilykinds_ibfk_2` FOREIGN KEY (`host_family_kind_id`) REFERENCES `HostFamilyKinds` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HostFamilyToHostFamilyKinds`
--

LOCK TABLES `HostFamilyToHostFamilyKinds` WRITE;
/*!40000 ALTER TABLE `HostFamilyToHostFamilyKinds` DISABLE KEYS */;
INSERT INTO `HostFamilyToHostFamilyKinds` VALUES (1,2);
/*!40000 ALTER TABLE `HostFamilyToHostFamilyKinds` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `firstname` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `is_referent` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (1,'Derache','Cédric','cedric.derache@gmail.com',0),(2,'Seguin','Gaëtane','seguin.gaetane@gmail.com',1);
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
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
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `price_level` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Veterinarians`
--

LOCK TABLES `Veterinarians` WRITE;
/*!40000 ALTER TABLE `Veterinarians` DISABLE KEYS */;
INSERT INTO `Veterinarians` VALUES (6,'Docteur Vigneron','0240030714','vigneron@veterinaires.com',NULL,'Par mail','A la fin du mois','Par virement','155 Route de Clisson, 44230 Saint-Sébastien-sur-Loire',47.189485,-1.5141282,2),(7,'Clinique Vignes et Moine','0240339463',NULL,1,NULL,NULL,NULL,'5 Boulevard Pierre Huet, 44300 Vallet',47.1631177,-1.2754257,2),(8,'Clinique vétérinaire BONMORT - BURET - WILD','0240972026',NULL,1,NULL,NULL,NULL,'225 rue de Bretagne, 44440 Riaillé',47.5207609,-1.2989489,0),(9,'Clinique Vétérinaire Argos Nantes République','0253352734',NULL,0,NULL,NULL,NULL,'2 bis Place François II, 44200 Nantes',47.206614,-1.556629,0),(10,'Clinique vétérinaire de la Haute Forêt','0240331959',NULL,0,NULL,NULL,NULL,'164 Bd de l’Europe, 44120 Vertou',47.1678412,-1.465299,1),(11,'Clinique Dr Stéphane Gasselin','0240323095',NULL,0,NULL,NULL,NULL,'2 Rue du Moulinier, 44860 Pont-Saint-Martin',47.13099,-1.57975,0),(12,'Clinique du Dr LEBRETON Jean-Claude','0240312797',NULL,0,NULL,NULL,NULL,'16 Rue Georges Clemenceau, 44840 Les Sorinières',47.1485419,-1.5316061,0),(13,'Clinique Vétérinaire Argos Saint-Herblain','0240580180',NULL,0,NULL,NULL,NULL,'19 Place de La Révolution Française, 44800 Saint-Herblain',47.228574,-1.605053,0),(14,'Drs vétérinaires Chevrier et Leroux','0240861758',NULL,0,NULL,NULL,NULL,'1 rue du Pr Jean Bernard, 44220 Couëron',47.212139,-1.726584,0),(15,'Clinique vétérinaire de l\'Ouest','0240630607',NULL,0,NULL,NULL,NULL,'57 Rue de Bretagne, 44880 Sautron',47.2623992,-1.6731146,2),(16,'Clinique Vétérinaire Argos Nantes Cens','0253352788',NULL,0,NULL,NULL,NULL,'99 Rte de Rennes, 44700 Orvault',47.254036,-1.576976,0),(17,'Clinique Erdre et Compagnie','0240892514',NULL,0,NULL,NULL,NULL,'5 allée du Limeur, 44240 La Chapelle-sur-Erdre',47.2762086,-1.5457198,2),(18,'Argos Ste-Luce','0240258737',NULL,0,NULL,NULL,NULL,'39, rue Louis Gaudin 44980 Sainte-Luce',47.2533092,-1.4877223,0),(19,'Clinique Vétérinaire du Sillon','0240798759',NULL,0,NULL,NULL,NULL,'2 Boulevard de la Résistance, 44130 Blain\n',47.47248,-1.764632,1),(20,'Clinique Vétérinaire des docteurs Maréchal et Louis','0240018271',NULL,0,NULL,NULL,NULL,'30 Boulevard de la Libération, 44600 Saint-Nazaire',47.282555,-2.206573,NULL),(21,'Cabinet vétérinaire d\'Arthon-en-Retz','0240213786',NULL,0,NULL,NULL,NULL,'41 Z.A. Zone du Butai, 44320 Chaumes-en-Retz',47.144754,-1.888552,1),(22,'Clinique vétérinaire EspaceVet Avrillé','0241347501',NULL,0,NULL,NULL,NULL,'20 Rue des Frères Montgolfier, 49240 Avrillé',47.514254,-0.615503,2),(23,'Clinique vétérinaire des Iris','0240785283',NULL,1,NULL,NULL,NULL,'5 Imp. des Iris, 44270 Machecoul\n',46.9919694,-1.848034198853211,2),(24,'Animéa-1er site','0251360491',NULL,1,NULL,NULL,NULL,'33 bd des États Unis 85000 La Roche sur Yon',46.6649807,-1.4217134,1),(25,'Animéa - 2ème site','0251406349',NULL,0,NULL,NULL,NULL,'99, rue nationale 85280 La Ferrière',46.7101394,-1.3177734,1),(26,'Centre Hospitalier Vétérinaire Atlantia / Dr Risi','0240474009',NULL,0,NULL,NULL,NULL,'22 Rue René Viviani, 44200 Nantes',47.2096217,-1.5350128,NULL),(27,'Clinique Vétérinaire des docteurs Maréchal et Louis','0240018271',NULL,0,NULL,NULL,NULL,'30 Boulevard de la Libération, 44600 Saint-Nazaire',47.282555,-2.206573,0);
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `VeterinarianInterventions`
--

LOCK TABLES `VeterinarianInterventions` WRITE;
/*!40000 ALTER TABLE `VeterinarianInterventions` DISABLE KEYS */;
INSERT INTO `VeterinarianInterventions` VALUES (2,6,'2022-11-08','Rappel vaccin',1),(3,6,'2022-10-12','Stérilisation\nPrimo vaccination',1);
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

-- Dump completed on 2023-02-09 21:56:55
