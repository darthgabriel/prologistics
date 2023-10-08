/*
Navicat MySQL Data Transfer

Source Server         : autoWeb
Source Server Version : 80031
Source Host           : 45.187.92.49:3306
Source Database       : ocg_prologistics

Target Server Type    : MYSQL
Target Server Version : 80031
File Encoding         : 65001

Date: 2023-10-04 21:31:45
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for cuestionarios_base
-- ----------------------------
DROP TABLE IF EXISTS `cuestionarios_base`;
CREATE TABLE `cuestionarios_base` (
  `id` int NOT NULL,
  `id_cliente` int DEFAULT NULL,
  `id_encuesta` int DEFAULT NULL,
  `id_pregunta` int DEFAULT NULL,
  `respuesta` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Table structure for encuestas_base
-- ----------------------------
DROP TABLE IF EXISTS `encuestas_base`;
CREATE TABLE `encuestas_base` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Table structure for encuestas_data
-- ----------------------------
DROP TABLE IF EXISTS `encuestas_data`;
CREATE TABLE `encuestas_data` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_encuesta` int DEFAULT NULL,
  `id_pregunta` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Table structure for info_clientes
-- ----------------------------
DROP TABLE IF EXISTS `info_clientes`;
CREATE TABLE `info_clientes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cedula` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `primernombre` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `segundonombre` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `primerapellido` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `segundoapellido` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `telefono` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Table structure for preguntas_base
-- ----------------------------
DROP TABLE IF EXISTS `preguntas_base`;
CREATE TABLE `preguntas_base` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `isTexto` tinyint DEFAULT NULL,
  `isFecha` tinyint DEFAULT NULL,
  `isSeleccion` tinyint DEFAULT NULL,
  `id_pregCadena` int DEFAULT NULL,
  `condicion` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Table structure for preguntas_seleccion
-- ----------------------------
DROP TABLE IF EXISTS `preguntas_seleccion`;
CREATE TABLE `preguntas_seleccion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_pregunta` int DEFAULT NULL,
  `valor` text COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
