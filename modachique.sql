-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: modachique
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categorias`
--

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias` (
  `id_categoria` int NOT NULL AUTO_INCREMENT,
  `id_categoria_pai` int DEFAULT NULL,
  `nome_categoria` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `descricao` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `imagem` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id_categoria`),
  KEY `id_categoria_pai` (`id_categoria_pai`),
  CONSTRAINT `categorias_ibfk_1` FOREIGN KEY (`id_categoria_pai`) REFERENCES `categorias` (`id_categoria`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (1,NULL,'Roupa','Toda a roupa feminina',NULL),(2,NULL,'Calçado','Calçado feminino',NULL),(3,NULL,'Acessórios','Acessórios femininos',NULL),(4,1,'Vestidos',NULL,'http://localhost:5000/uploads/cf5rvaoelqokwnrx5kn3.png'),(5,1,'Calças e Calções',NULL,'http://localhost:5000/uploads/jzpjrrswqxtvtsmyoayl.png'),(6,1,'T-shirt e Tops',NULL,'http://localhost:5000/uploads/n0pwi26n42sgfe5xzitk.png'),(7,1,'Casacos',NULL,'http://localhost:5000/uploads/yhwh2frk7t3cvbmhpmlv.png'),(8,1,'Malhas',NULL,'http://localhost:5000/uploads/swpxzwp1b5u92a5fnx17.png'),(10,1,'Blusas',NULL,'http://localhost:5000/uploads/cshnswlgdvoceib1mgl7.png'),(11,1,'Sobretudos',NULL,'http://localhost:5000/uploads/lsytdllrp0cnso8ml4ns.png'),(12,1,'Saias',NULL,'http://localhost:5000/uploads/trnw8w5ylbuub2v6kb58.png'),(13,1,'Roupa de banho',NULL,'http://localhost:5000/uploads/ifyzknoxcluw0jsthutb.png'),(14,1,'Sweatshirts e Hoodies',NULL,'http://localhost:5000/uploads/ucrsefukcuptheosjn6k.png'),(15,1,'Blazers e coletes',NULL,'http://localhost:5000/uploads/azo7n6wpp44tacdbpy9i.png'),(16,1,'Macacões',NULL,'http://localhost:5000/uploads/hmexhko4fzxsspqeemm0.png'),(17,2,'Sapatilhas',NULL,'http://localhost:5000/uploads/ft82ybinbbsjwxigvfaw.png'),(18,2,'Sandálias',NULL,'http://localhost:5000/uploads/opqhudiwx8udb4ycudmq.png'),(19,2,'Botas',NULL,'http://localhost:5000/uploads/scinteo7p3phgcuhadr2.png'),(20,2,'Botins',NULL,'http://localhost:5000/uploads/t26w1imdw6qke0axgt9e.png'),(23,2,'Saltos altos',NULL,'http://localhost:5000/uploads/yoat0xvuf67xabiqm9h4.png'),(24,2,'Sapatos rasos',NULL,'http://localhost:5000/uploads/douams3qocaiyfoif17l.png'),(25,2,'Chinelos',NULL,'http://localhost:5000/uploads/gyblb6ns0htull3z2npb.png'),(26,3,'Malas de mão',NULL,'http://localhost:5000/uploads/pfi86oyhiywwr0gndpzx.png'),(27,3,'Carteiras',NULL,'http://localhost:5000/uploads/bhwtxzjxi9suk4ijg5gk.png'),(29,3,'Cintos',NULL,'http://localhost:5000/uploads/chm3z50qknmuftxy2ikw.png'),(31,3,'Lenços',NULL,'http://localhost:5000/uploads/l9llrryhykpdh0nqsv4x.png'),(32,3,'Óculos de sol',NULL,'http://localhost:5000/uploads/dacvr54porpiqh4pvwv4.png'),(34,3,'Bijuteria',NULL,'http://localhost:5000/uploads/tpej2ryxe15g9z1uu91g.png');
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `encomendas`
--

DROP TABLE IF EXISTS `encomendas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `encomendas` (
  `id_encomenda` int NOT NULL AUTO_INCREMENT,
  `id_utilizador` int NOT NULL,
  `id_morada` int DEFAULT NULL,
  `data_pedido` date NOT NULL DEFAULT (curdate()),
  `total_pago` decimal(10,2) NOT NULL,
  `portes_envio` decimal(10,2) DEFAULT '0.00',
  `taxa_cobranca` decimal(12,2) DEFAULT '0.00',
  `estado` enum('pendente','confirmado','enviado','entregue','cancelado') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'pendente',
  `metodo_pagamento` enum('cartao','paypal','mbway','cobranca','pagamento_loja') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `referencia_externa` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `processado_em` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_encomenda`),
  KEY `id_utilizador` (`id_utilizador`),
  KEY `id_morada` (`id_morada`),
  CONSTRAINT `encomendas_ibfk_1` FOREIGN KEY (`id_utilizador`) REFERENCES `utilizadores` (`id_utilizador`) ON DELETE CASCADE,
  CONSTRAINT `encomendas_ibfk_2` FOREIGN KEY (`id_morada`) REFERENCES `moradas` (`id_morada`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `encomendas`
--

LOCK TABLES `encomendas` WRITE;
/*!40000 ALTER TABLE `encomendas` DISABLE KEYS */;
/*!40000 ALTER TABLE `encomendas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favoritos`
--

DROP TABLE IF EXISTS `favoritos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favoritos` (
  `id_favorito` int NOT NULL AUTO_INCREMENT,
  `id_utilizador` int NOT NULL,
  `id_produto` int NOT NULL,
  `id_variante` int DEFAULT NULL,
  `data_adicao` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_favorito`),
  UNIQUE KEY `unico_favorito` (`id_utilizador`,`id_produto`,`id_variante`),
  KEY `id_produto` (`id_produto`),
  KEY `id_variante` (`id_variante`),
  CONSTRAINT `favoritos_ibfk_1` FOREIGN KEY (`id_utilizador`) REFERENCES `utilizadores` (`id_utilizador`) ON DELETE CASCADE,
  CONSTRAINT `favoritos_ibfk_2` FOREIGN KEY (`id_produto`) REFERENCES `produtos` (`id_produto`) ON DELETE CASCADE,
  CONSTRAINT `favoritos_ibfk_3` FOREIGN KEY (`id_variante`) REFERENCES `variante` (`id_variante`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favoritos`
--

LOCK TABLES `favoritos` WRITE;
/*!40000 ALTER TABLE `favoritos` DISABLE KEYS */;
/*!40000 ALTER TABLE `favoritos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `imagens_produto`
--

DROP TABLE IF EXISTS `imagens_produto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `imagens_produto` (
  `id_imagem` int NOT NULL AUTO_INCREMENT,
  `id_produto` int NOT NULL,
  `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ordem` int NOT NULL DEFAULT '1',
  `cor` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id_imagem`),
  UNIQUE KEY `imagem_unica` (`id_produto`,`ordem`,`cor`),
  KEY `idx_id_produto` (`id_produto`),
  CONSTRAINT `imagens_produto_ibfk_1` FOREIGN KEY (`id_produto`) REFERENCES `produtos` (`id_produto`) ON DELETE CASCADE,
  CONSTRAINT `ordem_valida` CHECK ((`ordem` between 1 and 6))
) ENGINE=InnoDB AUTO_INCREMENT=324 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `imagens_produto`
--

LOCK TABLES `imagens_produto` WRITE;
/*!40000 ALTER TABLE `imagens_produto` DISABLE KEYS */;
INSERT INTO `imagens_produto` VALUES (1,51,'http://localhost:5000/uploads/v9uojpyk0plwvsq7camf.jpg',1,'Prateado'),(2,51,'http://localhost:5000/uploads/insxbvue0qqhuesmjz7z.jpg',2,'Prateado'),(3,51,'http://localhost:5000/uploads/nqfgh5apif2rpu2x9jxz.png',3,'Prateado'),(4,51,'http://localhost:5000/uploads/e9l6vozxor3pol37tj3x.png',4,'Prateado'),(8,50,'http://localhost:5000/uploads/ikggzigly7xitbivq6cb.png',1,'Dourado'),(9,50,'http://localhost:5000/uploads/bp6di5nddf8fj8egxwco.png',2,'Dourado'),(10,50,'http://localhost:5000/uploads/m89h8jnumffqst1gxstm.png',3,'Dourado'),(11,49,'http://localhost:5000/uploads/svdt9htu9bvb7mkvjrwy.png',1,'Dourado'),(12,49,'http://localhost:5000/uploads/apttopcmgrjjvj31nrc0.png',2,'Dourado'),(13,49,'http://localhost:5000/uploads/zycbhu7yr2ffwalop2xu.png',3,'Dourado'),(18,48,'http://localhost:5000/uploads/yzyyswjvprkkkqodg48a.png',1,'Preto'),(19,48,'http://localhost:5000/uploads/appe36j0bt30ixrf5yle.png',2,'Preto'),(20,48,'http://localhost:5000/uploads/cogtjqfdvdf9c94zigtz.png',3,'Preto'),(21,48,'http://localhost:5000/uploads/iafzs3latplrwpxn7qxs.png',4,'Preto'),(22,47,'http://localhost:5000/uploads/jgbnpkfdhqoafacbwxhj.jpg',1,'Tartaruga'),(23,47,'http://localhost:5000/uploads/gebwtqxkrwlilqiyvaqa.jpg',2,'Tartaruga'),(24,47,'http://localhost:5000/uploads/xfobsth5hrsk0iodvshy.jpg',3,'Tartaruga'),(25,46,'http://localhost:5000/uploads/g88zlaxzpqxkc7xytq9f.jpg',1,'Castanho'),(26,46,'http://localhost:5000/uploads/evxi1juuikgvo7filafd.jpg',2,'Castanho'),(27,46,'http://localhost:5000/uploads/eeqkmimsfu4de2xbvebo.jpg',3,'Castanho'),(28,46,'http://localhost:5000/uploads/oqrgm9ive1rd9fsn54ho.jpg',4,'Castanho'),(29,45,'http://localhost:5000/uploads/hqblmwhuhlsn7tna8oac.jpg',1,'Rosa'),(30,45,'http://localhost:5000/uploads/ytrmibrcv3gwq7qjka2a.jpg',2,'Rosa'),(31,45,'http://localhost:5000/uploads/vpttrexsupahrktrhi5f.jpg',3,'Rosa'),(32,45,'http://localhost:5000/uploads/glq6twhthsqwdhldyvov.jpg',4,'Rosa'),(33,44,'http://localhost:5000/uploads/czpmaivwa1ddmujxyldi.png',1,'Dourado'),(34,44,'http://localhost:5000/uploads/vr79fremyxb61hmo03wp.png',2,'Dourado'),(35,44,'http://localhost:5000/uploads/fz1oudqvmwuzorc9fy4d.png',3,'Dourado'),(36,44,'http://localhost:5000/uploads/hhsmiscmz2v8lg06mqvw.png',4,'Dourado'),(37,43,'http://localhost:5000/uploads/mfgnsi35ioi2xpchz16l.jpg',1,'Camel'),(38,43,'http://localhost:5000/uploads/jiiqmnu5wqoal6mndywk.jpg',2,'Camel'),(39,43,'http://localhost:5000/uploads/aohw3k6atoyaw7fyaal0.jpg',3,'Camel'),(40,43,'http://localhost:5000/uploads/nicaa4eulfq3udixvs42.jpg',4,'Camel'),(41,43,'http://localhost:5000/uploads/pcn7bs1pdru53cy2xeyt.jpg',5,'Camel'),(42,43,'http://localhost:5000/uploads/qthgjxcteqsiitgtkd7d.jpg',6,'Camel'),(43,42,'http://localhost:5000/uploads/bsn142ryg2dxnhwpaceb.jpg',1,'Preto'),(44,42,'http://localhost:5000/uploads/ddobwfzyefkhoojkmb7h.jpg',2,'Preto'),(45,42,'http://localhost:5000/uploads/gwt7vja4jdx4cujypetc.jpg',3,'Preto'),(46,37,'http://localhost:5000/uploads/d0vslbpwvse13fakcq6n.png',1,'Camel'),(47,37,'http://localhost:5000/uploads/oa4gt7j7gycdheiobsvx.png',2,'Camel'),(48,37,'http://localhost:5000/uploads/xzqrlchy1agwe9nquy2h.png',3,'Camel'),(49,36,'http://localhost:5000/uploads/wmsnsyckn4yxsexnouuf.jpg',1,'Preto'),(50,36,'http://localhost:5000/uploads/nvviu2th4lykaeojuvhn.jpg',2,'Preto'),(51,36,'http://localhost:5000/uploads/kfbsqsztq2rbvmx6rr7s.jpg',3,'Preto'),(52,36,'http://localhost:5000/uploads/p6hcm5jxqimnahcl5edy.jpg',4,'Preto'),(53,36,'http://localhost:5000/uploads/izcb5zfuszcekizuuuuk.jpg',5,'Preto'),(58,40,'http://localhost:5000/uploads/yf1ndzra6mvy4dejv5ai.png',1,'Nude'),(59,40,'http://localhost:5000/uploads/kizhofzlkzbz7kb1vr4r.png',2,'Nude'),(60,40,'http://localhost:5000/uploads/ydaba4l1b6s0t8daymm5.png',3,'Nude'),(61,40,'http://localhost:5000/uploads/p0rmn8qvglckgupu3xlt.webp',4,'Nude'),(62,40,'http://localhost:5000/uploads/xpyl1rvcpbek0c5jx45z.png',5,'Nude'),(63,39,'http://localhost:5000/uploads/t42yev9qvecttmw3iymk.jpg',1,'Castanho'),(64,39,'http://localhost:5000/uploads/dej40wo7imsanv5thrgz.jpg',2,'Castanho'),(65,39,'http://localhost:5000/uploads/kzfy2qyx4nvgzerv8byp.jpg',3,'Castanho'),(66,39,'http://localhost:5000/uploads/wziunygj1zfdpmzjhfto.jpg',4,'Castanho'),(67,39,'http://localhost:5000/uploads/hfmpvmm85vgtgvs9huhm.jpg',5,'Castanho'),(68,38,'http://localhost:5000/uploads/hmj5iubwsjx5oz7tmvka.jpg',1,'Preto'),(69,38,'http://localhost:5000/uploads/fdxdaokdqbg9k2ksonbz.jpg',2,'Preto'),(70,38,'http://localhost:5000/uploads/pjviygzbtzie2np6legh.jpg',3,'Preto'),(71,38,'http://localhost:5000/uploads/qyssgae6m3icrl6b3hjj.jpg',4,'Preto'),(72,38,'http://localhost:5000/uploads/dbul2t41bm7vtnf8z4gt.jpg',5,'Preto'),(73,38,'http://localhost:5000/uploads/qg7skurirwytc9s2b2g0.jpg',6,'Preto'),(74,35,'http://localhost:5000/uploads/jko8ay8amxzpvg6klvnh.jpg',1,'Castanho'),(75,35,'http://localhost:5000/uploads/bkyb0mydynlrr09yczmg.jpg',2,'Castanho'),(76,35,'http://localhost:5000/uploads/llcay0lcqeyvo43nqhas.jpg',3,'Castanho'),(77,35,'http://localhost:5000/uploads/nssapvlwfgzhorvnzxzz.jpg',4,'Castanho'),(78,35,'http://localhost:5000/uploads/gzvctpl2kus0kmq3oc8r.jpg',5,'Castanho'),(79,35,'http://localhost:5000/uploads/ae5yal1v2x8u3rjtzj4k.jpg',6,'Castanho'),(80,34,'http://localhost:5000/uploads/nzynomkcdiq6w6cqkokb.jpg',1,'Dourado'),(81,34,'http://localhost:5000/uploads/msvidbwhouztj2kcij3w.jpg',2,'Dourado'),(82,34,'http://localhost:5000/uploads/tk5qnryi634cyeipgqxz.jpg',3,'Dourado'),(83,34,'http://localhost:5000/uploads/fzkdwq0kd75lo7fzvmr7.jpg',4,'Dourado'),(84,33,'http://localhost:5000/uploads/os5korzufam99k0qq5yw.jpg',1,'Bege'),(85,33,'http://localhost:5000/uploads/h8exsibfpi7w41qfblf3.jpg',2,'Bege'),(86,33,'http://localhost:5000/uploads/uwqdt0ckegous432vqkp.jpg',3,'Bege'),(87,33,'http://localhost:5000/uploads/zjuxx2zvabhsw3t9twll.jpg',4,'Bege'),(88,33,'http://localhost:5000/uploads/idmtalkmhgb3imibilyj.jpg',5,'Bege'),(89,32,'http://localhost:5000/uploads/qfvejfsprspmy3irpw0e.png',1,'Branco'),(90,32,'http://localhost:5000/uploads/x1hmls2mjs7b2zgjklui.png',2,'Branco'),(91,32,'http://localhost:5000/uploads/gu11vbyuf3gymb4agsbs.png',3,'Branco'),(92,32,'http://localhost:5000/uploads/bosi7q7quwoxpeya3cfo.png',4,'Branco'),(93,32,'http://localhost:5000/uploads/up4j0zv4dhhoynhv7vcq.png',5,'Branco'),(94,32,'http://localhost:5000/uploads/yc8kfcqur8znkseeougj.png',6,'Branco'),(106,29,'http://localhost:5000/uploads/eqj3a3lqewjcoriowffq.jpg',1,'Branco'),(107,29,'http://localhost:5000/uploads/oukscug5lsaua1rnqdrt.jpg',2,'Branco'),(108,29,'http://localhost:5000/uploads/wvxveabvomnxygdpkvze.jpg',3,'Branco'),(109,29,'http://localhost:5000/uploads/ozz6fixanox22yynehea.jpg',4,'Branco'),(110,29,'http://localhost:5000/uploads/m7rorne6hsax9g3n8zfi.jpg',5,'Branco'),(111,28,'http://localhost:5000/uploads/o2d88k8izs94nzb0hsif.jpg',1,'Preto'),(112,28,'http://localhost:5000/uploads/igskzabbf7zqghgrxqb8.jpg',2,'Preto'),(113,28,'http://localhost:5000/uploads/b7yoklma9dybvprxsebd.jpg',3,'Preto'),(114,28,'http://localhost:5000/uploads/da6fr6mwiwhelynhy8ub.jpg',4,'Preto'),(115,28,'http://localhost:5000/uploads/dkpbwybh4blfxctkvrgb.jpg',5,'Preto'),(116,27,'http://localhost:5000/uploads/xbz7li5vnqabdzv6kwmx.jpg',1,'Preto'),(117,27,'http://localhost:5000/uploads/sv662sshzremogwtvfh2.jpg',2,'Preto'),(118,27,'http://localhost:5000/uploads/wmbjfgd3r2dvb4okxveb.jpg',3,'Preto'),(119,27,'http://localhost:5000/uploads/fcubk3pywh1oh86w5f4y.jpg',4,'Preto'),(120,27,'http://localhost:5000/uploads/q2x6wq9bvr96rcd2rlf2.jpg',5,'Preto'),(121,26,'http://localhost:5000/uploads/boedvxy3br9ybojjhhii.jpg',1,'Rosa'),(122,26,'http://localhost:5000/uploads/ttbcwdmplg7fubehars3.jpg',2,'Rosa'),(123,26,'http://localhost:5000/uploads/uypb3ndn9rcqxs22mfhc.jpg',3,'Rosa'),(124,26,'http://localhost:5000/uploads/zaf7jklvol2ujuaeugp3.jpg',4,'Rosa'),(125,26,'http://localhost:5000/uploads/bm6u58xcujh5la9pt1co.jpg',5,'Rosa'),(126,25,'http://localhost:5000/uploads/xv0wmmqjyhyux55oqwby.jpg',1,'Cinza'),(127,25,'http://localhost:5000/uploads/pvjfqyn9itxqk3ouaaxd.jpg',2,'Cinza'),(128,25,'http://localhost:5000/uploads/z3q40n0zjpnurzulxsl4.jpg',3,'Cinza'),(129,25,'http://localhost:5000/uploads/yob9cclvtnba7r0lf21a.jpg',4,'Cinza'),(130,25,'http://localhost:5000/uploads/hqyaqq9uifp5scbunits.jpg',5,'Cinza'),(131,24,'http://localhost:5000/uploads/kps4yhuncxh8ffrir2hg.jpg',1,'Preto'),(132,24,'http://localhost:5000/uploads/nxjiialvy2ageh7uyyw5.jpg',2,'Preto'),(133,24,'http://localhost:5000/uploads/j8cl40m9gamoqcry41gu.jpg',3,'Preto'),(134,24,'http://localhost:5000/uploads/qmnhe6qktysruv6wjrbf.jpg',4,'Preto'),(135,24,'http://localhost:5000/uploads/xueppn1fwkyyisdefe7g.jpg',5,'Preto'),(136,23,'http://localhost:5000/uploads/qn9jreetbcycdl8igzsu.jpg',1,'Azul'),(137,23,'http://localhost:5000/uploads/qj5dcxuq8tfwbcycuas9.jpg',2,'Azul'),(138,23,'http://localhost:5000/uploads/gziernvvkjrdfpgobphu.jpg',3,'Azul'),(139,23,'http://localhost:5000/uploads/h0dewu2ycwqa8s4ruuqr.jpg',4,'Azul'),(140,23,'http://localhost:5000/uploads/sdgijshktsrjs28y81az.jpg',5,'Azul'),(141,23,'http://localhost:5000/uploads/pvxc1maz8oe0y1n9w1jn.jpg',6,'Azul'),(142,22,'http://localhost:5000/uploads/x7w2vl6lkixvvrtomoir.jpg',1,'Verde'),(143,22,'http://localhost:5000/uploads/gcwhklfzner3gyxnmfcb.jpg',2,'Verde'),(144,22,'http://localhost:5000/uploads/phzv95ea5jbriae4ly0j.jpg',3,'Verde'),(145,22,'http://localhost:5000/uploads/hanfsqwt1oc0rh95x84e.jpg',4,'Verde'),(146,21,'http://localhost:5000/uploads/rrmg7wjfn2yor09sukst.jpg',1,'Camel'),(147,21,'http://localhost:5000/uploads/b2t3jcozn8ajtvt23jiv.jpg',2,'Camel'),(148,21,'http://localhost:5000/uploads/fdbwnkyb6gcurjiirrpj.jpg',3,'Camel'),(149,21,'http://localhost:5000/uploads/p4bfljuhztrjgafi1dek.jpg',4,'Camel'),(150,21,'http://localhost:5000/uploads/fbozb37htj4z0ollp4sd.jpg',5,'Camel'),(151,21,'http://localhost:5000/uploads/vkq7ihl5qydwh5xo2hgc.jpg',6,'Camel'),(152,20,'http://localhost:5000/uploads/tiiml1q3tvmrmfujfhii.jpg',1,'Cinza'),(153,20,'http://localhost:5000/uploads/qwcdcpywmwqnxb4ivqwj.jpg',2,'Cinza'),(154,20,'http://localhost:5000/uploads/quudcrvrraxtlmm3j1fh.jpg',3,'Cinza'),(155,20,'http://localhost:5000/uploads/rqvmyzre8yjbrlynlmuv.jpg',4,'Cinza'),(156,19,'http://localhost:5000/uploads/d2adetmibrh3qqtctifx.jpg',1,'Azul'),(157,19,'http://localhost:5000/uploads/mmhobo3omck65xgfcplb.jpg',2,'Azul'),(158,19,'http://localhost:5000/uploads/fceyi7gihlwwrcmlooyz.jpg',3,'Azul'),(159,19,'http://localhost:5000/uploads/moxes9kvuudx4jik4dpb.jpg',4,'Azul'),(160,19,'http://localhost:5000/uploads/kq2ns3dfdcfi5qyrq0cs.jpg',5,'Azul'),(161,19,'http://localhost:5000/uploads/bsduiaautppxu72a4iey.jpg',6,'Azul'),(162,18,'http://localhost:5000/uploads/snyuee4uho8jrv79pywq.jpg',1,'Preto'),(163,18,'http://localhost:5000/uploads/nkv3dbmqkaggsi41zep5.jpg',2,'Preto'),(164,18,'http://localhost:5000/uploads/anxnl6fvjskgoa8zcbxt.jpg',3,'Preto'),(165,18,'http://localhost:5000/uploads/fvj9f0hfvlv3elyrbryc.jpg',4,'Preto'),(166,18,'http://localhost:5000/uploads/dgw74n98va89g7chszyv.jpg',5,'Preto'),(167,18,'http://localhost:5000/uploads/eudxth5qqai6rvx5remx.jpg',6,'Preto'),(168,17,'http://localhost:5000/uploads/zqnj54yg6kxxzw5oagrw.jpg',1,'Branco'),(169,17,'http://localhost:5000/uploads/o7efr4xoayttf3izi542.jpg',2,'Branco'),(170,17,'http://localhost:5000/uploads/b3wr2csgewqnucqrg7fy.jpg',3,'Branco'),(171,17,'http://localhost:5000/uploads/ynwdo2vjzy5n4msfdemt.jpg',4,'Branco'),(172,17,'http://localhost:5000/uploads/njvyx21xkw0asbaze9gm.jpg',5,'Branco'),(173,17,'http://localhost:5000/uploads/olhb95tbmqqb4jihopbe.jpg',6,'Branco'),(174,16,'http://localhost:5000/uploads/hcirmro0fn6gpjc3awfp.jpg',1,'Cinza'),(175,16,'http://localhost:5000/uploads/x7ocdywkxqoglyxuadmg.jpg',2,'Cinza'),(176,16,'http://localhost:5000/uploads/ofdaax2pjllfvc45nvam.jpg',3,'Cinza'),(177,16,'http://localhost:5000/uploads/nvs9mi2dqpvccokzaqel.jpg',4,'Cinza'),(178,16,'http://localhost:5000/uploads/snuubolr4m5zfbfrdito.jpg',5,'Cinza'),(179,16,'http://localhost:5000/uploads/eqnfxnk6npmycqhjqiq5.jpg',6,'Cinza'),(180,15,'http://localhost:5000/uploads/ekguovhlysvbcji7p69o.jpg',1,'Creme'),(181,15,'http://localhost:5000/uploads/ladmxrxbehn7fy4yfkds.jpg',2,'Creme'),(182,15,'http://localhost:5000/uploads/iuuhnbvbxt6tz1upsteb.jpg',3,'Creme'),(183,15,'http://localhost:5000/uploads/t0udw69tytjp3qzkslhh.jpg',4,'Creme'),(190,14,'http://localhost:5000/uploads/gvquwcviuvb0taz2yojg.jpg',1,'Rosa'),(191,14,'http://localhost:5000/uploads/yvarfufuxqt2zrtspkn6.jpg',2,'Rosa'),(192,14,'http://localhost:5000/uploads/pyqe09bw7mbgq02c49wb.jpg',3,'Rosa'),(193,13,'http://localhost:5000/uploads/r1papl11dh71a6vp7wqt.jpg',1,'Bege'),(194,13,'http://localhost:5000/uploads/mmyha6t7gtodhxwwysa0.jpg',2,'Bege'),(195,13,'http://localhost:5000/uploads/peefuglnt1ri1vwgw13k.jpg',3,'Bege'),(196,13,'http://localhost:5000/uploads/m5mehdbpzgmitpicaf7z.jpg',4,'Bege'),(197,13,'http://localhost:5000/uploads/jz6xsqju3s8mlzvfczv1.jpg',5,'Bege'),(198,12,'http://localhost:5000/uploads/hot62ovjtyp9myr7ih9x.jpg',1,'Camel'),(199,12,'http://localhost:5000/uploads/xiec8zwl9lreomwtjqau.jpg',2,'Camel'),(200,12,'http://localhost:5000/uploads/k0ke5zuwd7qp1s2rgs1c.jpg',3,'Camel'),(201,12,'http://localhost:5000/uploads/r65pn3qn2niqzv4ceq6l.jpg',4,'Camel'),(202,12,'http://localhost:5000/uploads/zjintupwrse26muhbyvr.jpg',5,'Camel'),(203,12,'http://localhost:5000/uploads/lqiyv5iovpc4jtd14dye.jpg',6,'Camel'),(204,11,'http://localhost:5000/uploads/bnhupcwwjkga5h89cic3.jpg',1,'Preto'),(205,11,'http://localhost:5000/uploads/pdlr26yixas6mp1hk2mz.jpg',2,'Preto'),(206,11,'http://localhost:5000/uploads/rfzuug8x023jiudau4jt.jpg',3,'Preto'),(207,11,'http://localhost:5000/uploads/ya0qghwozwlpwlibwctd.jpg',4,'Preto'),(208,11,'http://localhost:5000/uploads/do9cy3edhc9jbehl9km5.jpg',5,'Preto'),(209,11,'http://localhost:5000/uploads/rzwdqend8kzhj0ss2f94.jpg',6,'Preto'),(210,10,'http://localhost:5000/uploads/jua7ezhxtumcx0ywzccp.jpg',1,'Tie-Dye'),(211,10,'http://localhost:5000/uploads/ivm4wutvzfchyvcqqwoh.jpg',2,'Tie-Dye'),(212,10,'http://localhost:5000/uploads/zakrsz0fxb9bset1xbfs.jpg',3,'Tie-Dye'),(213,10,'http://localhost:5000/uploads/cp829jyngecedudnfgvp.jpg',4,'Tie-Dye'),(214,10,'http://localhost:5000/uploads/ovmaknhhulecijquasre.jpg',5,'Tie-Dye'),(215,9,'http://localhost:5000/uploads/ycx4peknoeflyocgbj0a.jpg',1,'Branco'),(216,9,'http://localhost:5000/uploads/kscuuvjaeeu5awknjfjh.jpg',2,'Branco'),(217,9,'http://localhost:5000/uploads/wcmfeuht7fxaln2sg4ku.jpg',3,'Branco'),(218,9,'http://localhost:5000/uploads/bedxnpefr3jlccrp1ojw.jpg',4,'Branco'),(219,9,'http://localhost:5000/uploads/zawttmeeqtusrpby2ho6.jpg',5,'Branco'),(220,9,'http://localhost:5000/uploads/wcf57e1z064jajn4ylnd.jpg',6,'Branco'),(221,8,'http://localhost:5000/uploads/h0ako5jzrjkuabddzbwo.jpg',1,'Verde Militar'),(222,8,'http://localhost:5000/uploads/fkt10hr9yvp6n9ioy4wx.jpg',2,'Verde Militar'),(223,8,'http://localhost:5000/uploads/pn3giufuks98t9lx1ttb.jpg',3,'Verde Militar'),(224,8,'http://localhost:5000/uploads/u7o5byjgrwws7mx3bcnu.jpg',4,'Verde Militar'),(225,8,'http://localhost:5000/uploads/zdzngj9wlr31ssldelr4.jpg',5,'Verde Militar'),(226,8,'http://localhost:5000/uploads/iporkigfepjfrqdrz94o.jpg',6,'Verde Militar'),(227,7,'http://localhost:5000/uploads/orsnisshnog5qw3xvgln.jpg',1,'Azul Claro'),(228,7,'http://localhost:5000/uploads/uwacm7q1z8bp5npeijdx.jpg',2,'Azul Claro'),(229,7,'http://localhost:5000/uploads/pcloxajcstjgr1uyvtag.jpg',3,'Azul Claro'),(230,7,'http://localhost:5000/uploads/clyp6hg7p2mxfvpavo01.jpg',4,'Azul Claro'),(231,7,'http://localhost:5000/uploads/bsemeataencbrpdgihfs.jpg',5,'Azul Claro'),(232,7,'http://localhost:5000/uploads/seeunnqiv82efzpsms1b.jpg',6,'Azul Claro'),(239,5,'http://localhost:5000/uploads/hzbcjodmtowkahzbsakh.jpg',1,'Azul'),(240,5,'http://localhost:5000/uploads/ncs7af0g7u3ppa0v0mgy.jpg',2,'Azul'),(241,5,'http://localhost:5000/uploads/egvkzrtnouxmaowqpjxx.jpg',3,'Azul'),(242,5,'http://localhost:5000/uploads/ml7bueq26htbbx3vvovo.jpg',4,'Azul'),(243,5,'http://localhost:5000/uploads/lm5xmfvqn30t6yrd4s64.jpg',5,'Azul'),(244,5,'http://localhost:5000/uploads/gohekng36sqcbbutpraz.jpg',6,'Azul'),(251,4,'http://localhost:5000/uploads/xauhjyv2fwuqhus70ts4.jpg',1,'Azul Ganga'),(252,4,'http://localhost:5000/uploads/ijnxsfmgo2ozlt6u79ng.jpg',2,'Azul Ganga'),(253,4,'http://localhost:5000/uploads/rrsm2xpa2q07fgam5iz4.jpg',3,'Azul Ganga'),(254,4,'http://localhost:5000/uploads/vllzijlcp3oyhe6m3iow.jpg',4,'Azul Ganga'),(255,4,'http://localhost:5000/uploads/oplfmbyndflv2v5bpign.jpg',5,'Azul Ganga'),(256,4,'http://localhost:5000/uploads/rvvrxrvn09f7ig9rfy0b.jpg',6,'Azul Ganga'),(257,3,'http://localhost:5000/uploads/numoodmyi6yjogasf785.jpg',1,'Preto'),(258,3,'http://localhost:5000/uploads/qm2ct7twu0jarlq5zvms.jpg',2,'Preto'),(259,3,'http://localhost:5000/uploads/stvloiuno7qkqh62hvdx.jpg',3,'Preto'),(260,3,'http://localhost:5000/uploads/mhs3elvfdq11u8h1qcdg.jpg',4,'Preto'),(261,3,'http://localhost:5000/uploads/agr0vtulewm92c15jebg.jpg',5,'Preto'),(262,3,'http://localhost:5000/uploads/m1lgaci2sumoh6kl8mnz.jpg',6,'Preto'),(263,2,'http://localhost:5000/uploads/d4izu4znx61aurqtn7wz.jpg',1,'Bege'),(264,2,'http://localhost:5000/uploads/o3dfhfa5jan5gxkxslha.jpg',2,'Bege'),(265,2,'http://localhost:5000/uploads/jsluvrd5sxhoayqzicj4.jpg',3,'Bege'),(266,2,'http://localhost:5000/uploads/rq78zxvsmmeuodeljmvx.jpg',4,'Bege'),(267,2,'http://localhost:5000/uploads/p3zix3drwgbmhllhijfx.jpg',5,'Bege'),(268,2,'http://localhost:5000/uploads/vcl5sfl9gibjbccjc6ck.jpg',6,'Bege'),(269,1,'http://localhost:5000/uploads/vfok3lfme4qvllwuvwdu.jpg',1,'Floral'),(270,1,'http://localhost:5000/uploads/nujfg1m0nmjkwphddljj.jpg',2,'Floral'),(271,1,'http://localhost:5000/uploads/tdirtpotiystlbuxzu5c.jpg',3,'Floral'),(272,1,'http://localhost:5000/uploads/ctn0oa5zb4pmnbc7bhfn.jpg',4,'Floral'),(273,1,'http://localhost:5000/uploads/ojslfi4s1xbunau9wqir.jpg',5,'Floral'),(274,1,'http://localhost:5000/uploads/hwnlt1rylxogwubzhk6a.jpg',6,'Floral'),(285,41,'http://localhost:5000/uploads/kdeqwsukqnwlyzkggj2q.jpg',1,'Preto'),(286,41,'http://localhost:5000/uploads/xhb4unyxc85vkv4lucft.png',2,'Preto'),(287,41,'http://localhost:5000/uploads/epzwa5aiah26eqfqrijx.png',3,'Preto'),(288,41,'http://localhost:5000/uploads/rp8nvwn5l9zunvra6paz.jpg',4,'Preto'),(289,6,'http://localhost:5000/uploads/muybahu0e9y8kt3mvuam.jpg',1,'Creme'),(290,6,'http://localhost:5000/uploads/exvrouji1zib0szuxhkc.jpg',2,'Creme'),(291,6,'http://localhost:5000/uploads/xyq8evv0m0rzj5zcvvuf.jpg',3,'Creme'),(292,6,'http://localhost:5000/uploads/bddbwlt6bg2dnlw7k3e8.jpg',4,'Creme'),(293,6,'http://localhost:5000/uploads/iwptfv5ilikdhabhrfbr.jpg',5,'Creme'),(294,6,'http://localhost:5000/uploads/tbnuoocgsdsurwpswkuo.jpg',6,'Creme'),(295,30,'http://localhost:5000/uploads/r7gktkumepw8zgsglys6.png',1,'Rosa'),(296,30,'http://localhost:5000/uploads/wocn72rfznsrelfcr3gr.png',2,'Rosa'),(297,30,'http://localhost:5000/uploads/ch743reiqlb5jvnddhde.jpg',3,'Rosa'),(298,30,'http://localhost:5000/uploads/mpz6g8g0mj3a5nctzf0s.jpg',4,'Rosa'),(299,30,'http://localhost:5000/uploads/hiaabvfrlkgj9paitbak.jpg',5,'Rosa'),(312,31,'http://localhost:5000/uploads/zhepbl9jzovrgefpkgde.jpg',1,'Branco'),(313,31,'http://localhost:5000/uploads/p05pvgluil0kmirj8hkd.jpg',2,'Branco'),(314,31,'http://localhost:5000/uploads/gkx162hpjdkedrmrltnf.jpg',3,'Branco'),(315,31,'http://localhost:5000/uploads/u5xqkv8jtg0izg19lhvz.jpg',4,'Branco'),(316,31,'http://localhost:5000/uploads/xxlcelyhwz2rb8v9ynvf.jpg',5,'Branco'),(317,31,'http://localhost:5000/uploads/zr9oya4xa6gd1lf609pf.jpg',6,'Branco'),(318,31,'http://localhost:5000/uploads/vbztfpiuhwa7s7fe2ilk.png',1,'Preto'),(319,31,'http://localhost:5000/uploads/sl2yzo7klb2o45wpfwha.png',2,'Preto'),(320,31,'http://localhost:5000/uploads/mbujttmtxaekj34bazdd.png',3,'Preto'),(321,31,'http://localhost:5000/uploads/atmmd7axzu2vzsmbfhdx.png',4,'Preto'),(322,31,'http://localhost:5000/uploads/umkkegrqq0junderfzgq.png',5,'Preto'),(323,31,'http://localhost:5000/uploads/qrymogskp9kh3yfxx4ee.png',6,'Preto');
/*!40000 ALTER TABLE `imagens_produto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `linhas_encomenda`
--

DROP TABLE IF EXISTS `linhas_encomenda`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `linhas_encomenda` (
  `id_item` int NOT NULL AUTO_INCREMENT,
  `id_encomenda` int NOT NULL,
  `id_variante` int NOT NULL,
  `quantidade` int NOT NULL DEFAULT '1',
  `preco_unitario` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_item`),
  KEY `id_encomenda` (`id_encomenda`),
  KEY `id_variante` (`id_variante`),
  CONSTRAINT `linhas_encomenda_ibfk_1` FOREIGN KEY (`id_encomenda`) REFERENCES `encomendas` (`id_encomenda`) ON DELETE CASCADE,
  CONSTRAINT `linhas_encomenda_ibfk_2` FOREIGN KEY (`id_variante`) REFERENCES `variante` (`id_variante`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `linhas_encomenda`
--

LOCK TABLES `linhas_encomenda` WRITE;
/*!40000 ALTER TABLE `linhas_encomenda` DISABLE KEYS */;
/*!40000 ALTER TABLE `linhas_encomenda` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `marcas`
--

DROP TABLE IF EXISTS `marcas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `marcas` (
  `id_marca` int NOT NULL AUTO_INCREMENT,
  `nome_marca` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `descricao` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `imagem_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id_marca`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `marcas`
--

LOCK TABLES `marcas` WRITE;
/*!40000 ALTER TABLE `marcas` DISABLE KEYS */;
INSERT INTO `marcas` VALUES (1,'Moda Chique','A nossa marca exclusiva','http://localhost:5000/uploads/v7zijbus3eiruuiizidf.png'),(2,'Zara','Moda contemporânea para o dia a dia','http://localhost:5000/uploads/l2okicyxjx1d99nr0ls0.png'),(3,'Mango','Elegância mediterrânea e sofisticação','http://localhost:5000/uploads/urc2gexagh505ufm6vvp.png'),(4,'H&M','Moda acessível e sustentável','http://localhost:5000/uploads/aahaagflf1nllhvqkyff.png'),(5,'Massimo Dutti','Elegância clássica e atemporal','http://localhost:5000/uploads/uthljdyuqrbhdumm33zr.png'),(6,'Stradivarius','Tendências jovens e urbanas','http://localhost:5000/uploads/ounz6o6mnwvgdyb3gati.png'),(7,'Bershka','Estilo urbano e descontraído','http://localhost:5000/uploads/bbdpnqctpyylfzxcndb7.png'),(8,'Pull&Bear','Moda casual e confortável','http://localhost:5000/uploads/nal6iyh0gzvjnymf7ufh.png'),(9,'Levi\'s','O clássico do denim americano','http://localhost:5000/uploads/nxlylq9gi1xxyab4uoku.png'),(10,'Nike','Desempenho e estilo desportivo','http://localhost:5000/uploads/gacvjvkvk8erfapgs8z4.png'),(11,'Guess','Glamour e sensualidade americana','http://localhost:5000/uploads/ghrqioaljj1atjbctknz.png'),(12,'Tommy Hilfiger','Preppy americano com toque europeu','http://localhost:5000/uploads/mdmnv5u61hwtjj754uzv.png');
/*!40000 ALTER TABLE `marcas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medidas`
--

DROP TABLE IF EXISTS `medidas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medidas` (
  `id_medida` int NOT NULL AUTO_INCREMENT,
  `id_utilizador` int NOT NULL,
  `busto` decimal(5,1) DEFAULT NULL,
  `cintura` decimal(5,1) DEFAULT NULL,
  `anca` decimal(5,1) DEFAULT NULL,
  `altura` decimal(5,1) DEFAULT NULL,
  `tam_eu` varchar(10) DEFAULT NULL,
  `tam_int` varchar(10) DEFAULT NULL,
  `atualizado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_medida`),
  UNIQUE KEY `id_utilizador` (`id_utilizador`),
  CONSTRAINT `medidas_ibfk_1` FOREIGN KEY (`id_utilizador`) REFERENCES `utilizadores` (`id_utilizador`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medidas`
--

LOCK TABLES `medidas` WRITE;
/*!40000 ALTER TABLE `medidas` DISABLE KEYS */;
INSERT INTO `medidas` VALUES (1,1,192.0,123.0,123.0,123.0,NULL,NULL,'2026-05-11 12:40:28');
/*!40000 ALTER TABLE `medidas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mensagens_suporte`
--

DROP TABLE IF EXISTS `mensagens_suporte`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mensagens_suporte` (
  `id_mensagem` int NOT NULL AUTO_INCREMENT,
  `id_utilizador` int NOT NULL,
  `assunto` varchar(255) NOT NULL,
  `mensagem` text NOT NULL,
  `estado` enum('aberta','respondida','fechada') DEFAULT 'aberta',
  `lida_admin` tinyint(1) DEFAULT '0',
  `lida_cliente` tinyint(1) DEFAULT '1',
  `criado_em` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_mensagem`),
  KEY `id_utilizador` (`id_utilizador`),
  CONSTRAINT `mensagens_suporte_ibfk_1` FOREIGN KEY (`id_utilizador`) REFERENCES `utilizadores` (`id_utilizador`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mensagens_suporte`
--

LOCK TABLES `mensagens_suporte` WRITE;
/*!40000 ALTER TABLE `mensagens_suporte` DISABLE KEYS */;
/*!40000 ALTER TABLE `mensagens_suporte` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `moradas`
--

DROP TABLE IF EXISTS `moradas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `moradas` (
  `id_morada` int NOT NULL AUTO_INCREMENT,
  `id_utilizador` int NOT NULL,
  `rua` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `cidade` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `codigo_postal` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `pais` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Portugal',
  `predefinida` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id_morada`),
  KEY `id_utilizador` (`id_utilizador`),
  CONSTRAINT `moradas_ibfk_1` FOREIGN KEY (`id_utilizador`) REFERENCES `utilizadores` (`id_utilizador`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `moradas`
--

LOCK TABLES `moradas` WRITE;
/*!40000 ALTER TABLE `moradas` DISABLE KEYS */;
INSERT INTO `moradas` VALUES (1,1,'Rua das Flores, 12','Porto','4000-001','Portugal',1),(4,1,'Rua Principal, N87, Torre de Chão do Pereiro','Penela','3230-340','Portugal',0),(6,9,'dsadsasa','dsadsa','dsadsasads','Portugal',0),(7,9,'','','','Portugal',0),(8,9,'Pedro Moreira','VILA MAIOR VFR','4525-511','Portugal',0),(9,9,'Pedro Moreira','VILA MAIOR VFR','4525-511','Portugal',0);
/*!40000 ALTER TABLE `moradas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `produtos`
--

DROP TABLE IF EXISTS `produtos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `produtos` (
  `id_produto` int NOT NULL AUTO_INCREMENT,
  `id_categoria` int DEFAULT NULL,
  `id_marca` int DEFAULT NULL,
  `nome_produto` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `preco` decimal(10,2) NOT NULL,
  `preco_anterior` decimal(10,2) DEFAULT NULL,
  `descricao` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `materiais` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guia_cuidados` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stock` int DEFAULT '0',
  PRIMARY KEY (`id_produto`),
  KEY `id_categoria` (`id_categoria`),
  KEY `id_marca` (`id_marca`),
  CONSTRAINT `produtos_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`) ON DELETE SET NULL,
  CONSTRAINT `produtos_ibfk_2` FOREIGN KEY (`id_marca`) REFERENCES `marcas` (`id_marca`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produtos`
--

LOCK TABLES `produtos` WRITE;
/*!40000 ALTER TABLE `produtos` DISABLE KEYS */;
INSERT INTO `produtos` VALUES (1,4,2,'Vestido Midi Floral',49.90,69.90,'Vestido midi com estampado floral vibrante. Silhueta fluida e feminina, perfeito para o dia a dia ou ocasiões especiais.','100% Viscose','Lavar à mão a 30°C. Não torcer.',40),(2,4,3,'Vestido Linho Bege',69.90,NULL,'Vestido em linho natural com corte reto e detalhe no decote. Elegante e atemporal.','55% Linho, 45% Algodão','Lavar a 30°C. Engomar a temperatura média.',25),(3,4,1,'Vestido Seda Preta',89.90,NULL,'Vestido em cetim com alças finas e corte em viés. Ideal para noite ou eventos formais.','100% Poliéster Reciclado','Lavar à mão. Não usar secador.',20),(4,4,4,'Vestido Curto Ganga',29.90,39.90,'Vestido curto em ganga com botões frontais e cinto incluído. Casual e versátil.','99% Algodão, 1% Elastano','Lavar a 40°C. Pode usar secador.',35),(5,5,9,'Jeans Skinny Azul',59.90,NULL,'Calças de ganga skinny de cintura alta com lavagem clássica. O básico essencial de qualquer guarda-roupa.','98% Algodão, 2% Elastano','Lavar a 30°C. Não branquear.',50),(6,5,2,'Calças Wide Leg Creme',45.90,59.90,'Calças de perna larga em tecido fluido. Elegantes e confortáveis para qualquer ocasião.','100% Poliéster','Lavar a 30°C. Engomar a temperatura baixa.',30),(7,5,4,'Calções Ganga Curtos',24.90,NULL,'Calções de ganga com bainhas dobradas e cintura ajustável. Perfeitos para os dias quentes.','100% Algodão','Lavar a 40°C.',45),(8,5,7,'Calças Cargo Verde',39.90,NULL,'Calças cargo com múltiplos bolsos. Estilo urbano e funcional.','100% Algodão','Lavar a 30°C.',28),(9,6,4,'T-shirt Básica Algodão',12.90,NULL,'T-shirt básica de algodão orgânico com corte regular. Disponível em várias cores.','100% Algodão Orgânico','Lavar a 40°C. Pode usar secador.',100),(10,6,7,'Top Cropped Tie-Dye',19.90,24.90,'Top cropped com efeito tie-dye. Estilo descontraído e colorido.','95% Algodão, 5% Elastano','Lavar à mão a 30°C.',40),(11,6,6,'Top Satin Alças',22.90,NULL,'Top em cetim com alças finas e detalhe franzido. Elegante e versátil.','100% Poliéster','Lavar à mão. Não torcer.',35),(12,7,3,'Casaco Oversize Camel',89.90,119.90,'Casaco oversize em lã mistura com corte reto. Peça atemporal e sofisticada.','60% Lã, 40% Poliéster','Lavar a seco.',20),(13,7,5,'Casaco Trench Bege',129.90,NULL,'Trench coat clássico em gabardine com cinto. Elegância britânica intemporal.','65% Poliéster, 35% Algodão','Lavar a seco recomendado.',15),(14,7,12,'Casaco Puffer Rosa',79.90,99.90,'Casaco puffer acolchoado leve e quente. Ideal para os dias frios de inverno.','Exterior: 100% Nylon. Enchimento: 100% Poliéster','Lavar a 30°C. Não engomar.',25),(15,8,5,'Camisola Tricot Creme',59.90,NULL,'Camisola em tricot de malha grossa. Quente e sofisticada para o inverno.','50% Lã Merino, 50% Acrílico','Lavar à mão a 30°C. Secar deitada.',30),(16,8,3,'Cardigan Oversize Cinza',49.90,64.90,'Cardigan oversize em malha macia com botões frontais. Perfeito para usar com vestidos ou calças.','80% Acrílico, 20% Lã','Lavar à mão. Secar deitada.',35),(17,10,2,'Blusa Romântica Branca',35.90,NULL,'Blusa com mangas bufantes e detalhe de bordado no decote. Feminina e elegante.','100% Algodão','Lavar a 30°C. Engomar com vapor.',30),(18,10,5,'Blusa Seda Preta',79.90,NULL,'Blusa em seda natural com laço no decote. Sofisticada e versátil.','100% Seda Natural','Lavar à mão com detergente suave.',20),(19,10,6,'Blusa Ganga Oversize',29.90,39.90,'Blusa em ganga ligeira com botões frontais. Casual e descontraída.','100% Algodão','Lavar a 30°C.',40),(20,11,5,'Sobretudo Lã Cinza',159.90,NULL,'Sobretudo em lã pura com corte estruturado. Peça de investimento para o guarda-roupa de inverno.','80% Lã, 20% Poliamida','Lavar a seco.',12),(21,11,3,'Sobretudo Camel Comprido',139.90,179.90,'Sobretudo comprido em mistura de lã com botões dourados. Elegância clássica.','70% Lã, 30% Poliéster','Lavar a seco recomendado.',15),(22,12,2,'Saia Midi Plissada Verde',39.90,49.90,'Saia midi plissada em tecido fluido. Elegante e versátil para várias ocasiões.','100% Poliéster','Lavar a 30°C. Não torcer.',40),(23,12,6,'Saia Mini Ganga',29.90,NULL,'Saia mini em ganga com cintura elástica. Casual e jovial.','98% Algodão, 2% Elastano','Lavar a 40°C.',50),(24,12,1,'Saia Lápis Preta',44.90,NULL,'Saia lápis midi em tecido texturado. Perfeita para o escritório ou eventos formais.','65% Poliéster, 35% Viscose','Lavar a 30°C. Engomar a temperatura média.',25),(25,14,8,'Hoodie Oversize Cinza',34.90,NULL,'Hoodie oversize com bolso canguru. Confortável para o dia a dia.','80% Algodão, 20% Poliéster','Lavar a 40°C. Pode usar secador.',60),(26,14,7,'Sweatshirt Cropped Rosa',29.90,39.90,'Sweatshirt cropped com grafismo frontal. Estilo urbano e descontraído.','85% Algodão, 15% Poliéster','Lavar a 40°C.',45),(27,14,4,'Hoodie Zip Preto',39.90,NULL,'Hoodie com fecho zip frontal e capuz. Versátil e confortável.','80% Algodão, 20% Poliéster','Lavar a 40°C.',40),(28,15,2,'Blazer Estruturado Preto',79.90,99.90,'Blazer estruturado com forro interior. Perfeito para o ambiente profissional ou look casual chique.','65% Poliéster, 35% Viscose','Lavar a seco recomendado.',25),(29,15,5,'Blazer Linho Branco',99.90,NULL,'Blazer em linho natural. Elegante e fresco para os meses mais quentes.','55% Linho, 45% Algodão','Lavar a 30°C. Engomar.',18),(30,15,3,'Colete Tweed Rosa',59.90,74.90,'Colete em tweed com botões dourados. Peça versátil que eleva qualquer look.','60% Lã, 30% Acrílico, 10% Poliéster','Lavar a seco.',20),(31,17,10,'Nike Air Force 1',109.90,NULL,'Sapatilhas clássicas com sola de borracha. Ícone do streetwear feminino.','Exterior: Couro sintético. Sola: Borracha','Limpar com pano húmido.',40),(32,17,4,'Sapatilhas Canvas Brancas',24.90,34.90,'Sapatilhas em canvas com sola vulcanizada. O básico do verão.','100% Algodão Canvas. Sola: Borracha','Lavar à mão.',55),(33,17,8,'Sapatilhas Dad Shoe Bege',49.90,NULL,'Sapatilhas chunky com plataforma. Estilo 90s em versão moderna.','Exterior: Têxtil e sintético. Sola: EVA','Limpar com pano húmido.',30),(34,18,1,'Sandálias Rasas Douradas',34.90,NULL,'Sandálias rasas com tiras metalizadas e fivela ajustável. Elegantes e confortáveis.','Exterior: Sintético metalizado. Sola: Borracha','Não molhar. Limpar com pano seco.',35),(35,18,6,'Sandálias Plataforma Castanhas',44.90,59.90,'Sandálias com plataforma em cortiça e tiras em pele sintética.','Exterior: Pele sintética. Plataforma: Cortiça','Limpar com pano húmido.',25),(36,19,3,'Botas Cano Alto Preto',89.90,109.90,'Botas de cano alto com tacão bloco. Sofisticadas e confortáveis para o outono-inverno.','Exterior: Couro sintético. Sola: Borracha','Limpar com creme de calçado. Guardar com forma.',20),(37,19,1,'Botas Chelsea Camel',79.90,NULL,'Botas Chelsea em pele sintética com elásticos laterais. Clássicas e versáteis.','Exterior: Pele sintética. Sola: Borracha','Limpar com pano húmido e creme neutro.',22),(38,20,2,'Botins Salto Bloco Preto',59.90,74.90,'Botins com salto bloco e biqueira quadrada. Tendência da estação.','Exterior: Sintético. Sola: Borracha sintética','Limpar com pano húmido.',28),(39,20,6,'Botins Cowboy Castanhos',69.90,NULL,'Botins de inspiração cowboy com bordados frontais. Peça de destaque em qualquer look.','Exterior: Pele sintética. Sola: Borracha','Limpar com creme de calçado.',18),(40,23,11,'Scarpin Clássico Nude',89.90,NULL,'Scarpin de bico fino em pele sintética. Elegante e sofisticado para ocasiões especiais.','Exterior: Pele sintética. Sola: Couro sintético','Limpar com pano seco. Guardar em saco.',20),(41,23,1,'Sandália Salto Agulha Preta',79.90,99.90,'Sandália de salto agulha com tira no tornozelo. Sensual e elegante.','Exterior: Sintético. Sola: Borracha','Não molhar. Limpar com pano seco.',18),(42,26,11,'Mala Tote Preta',129.90,NULL,'Mala tote em pele sintética de alta qualidade. Espaçosa e elegante para o dia a dia.','Exterior: Pele sintética. Forro: Poliéster','Limpar com pano húmido. Guardar recheada.',20),(43,26,3,'Mala Shopper Camel',79.90,99.90,'Mala shopper em canvas com alças em pele. Prática e estilosa.','Exterior: Canvas 100% Algodão. Alças: Pele sintética','Lavar o exterior com pano húmido.',25),(44,26,1,'Mini Bag Dourada',59.90,NULL,'Mini bag com corrente dourada. Perfeita para saídas à noite.','Exterior: Sintético metalizado. Forro: Poliéster','Limpar com pano seco.',30),(45,27,11,'Carteira Bifold Rosa',49.90,NULL,'Carteira bifold compacta com múltiplos compartimentos para cartões.','Exterior: Pele sintética','Limpar com pano seco.',35),(46,27,1,'Carteira Grande Castanha',69.90,79.90,'Carteira grande com porta-moedas e múltiplos bolsos interiores.','Exterior: Pele sintética premium','Limpar com creme neutro.',25),(47,32,11,'Óculos Cat Eye Tartaruga',79.90,NULL,'Óculos de sol cat eye com armação em acetato. Proteção UV400.','Armação: Acetato. Lentes: Policarbonato','Limpar com pano de microfibra. Guardar em estojo.',30),(48,32,1,'Óculos Oversized Pretos',49.90,64.90,'Óculos de sol oversized com lentes espelhadas. Proteção UV400.','Armação: Metal. Lentes: Policarbonato','Limpar com pano de microfibra.',40),(49,34,1,'Colar Delicado Dourado',24.90,NULL,'Colar delicado banhado a ouro com pendente de estrela. Minimalista e elegante.','Metal banhado a ouro 18k','Não molhar. Guardar em saco anti-oxidação.',50),(50,34,11,'Brincos Argola Grandes',29.90,NULL,'Brincos de argola XL banhados a ouro. Clássicos e versáteis.','Metal banhado a ouro 18k','Não molhar. Limpar com pano seco.',45),(51,34,1,'Pulseira Elos Prateada',19.90,24.90,'Pulseira de elos em aço inoxidável prateado. Resistente e elegante.','Aço inoxidável','Limpar com pano seco.',60);
/*!40000 ALTER TABLE `produtos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `respostas_suporte`
--

DROP TABLE IF EXISTS `respostas_suporte`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `respostas_suporte` (
  `id_resposta` int NOT NULL AUTO_INCREMENT,
  `id_mensagem` int NOT NULL,
  `mensagem` text NOT NULL,
  `is_admin` tinyint(1) DEFAULT '0',
  `criado_em` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_resposta`),
  KEY `id_mensagem` (`id_mensagem`),
  CONSTRAINT `respostas_suporte_ibfk_1` FOREIGN KEY (`id_mensagem`) REFERENCES `mensagens_suporte` (`id_mensagem`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `respostas_suporte`
--

LOCK TABLES `respostas_suporte` WRITE;
/*!40000 ALTER TABLE `respostas_suporte` DISABLE KEYS */;
/*!40000 ALTER TABLE `respostas_suporte` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `utilizadores`
--

DROP TABLE IF EXISTS `utilizadores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `utilizadores` (
  `id_utilizador` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `prefixo_tel` enum('+351','+34','+33','+44','+49','+55','+352','+39') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '+351',
  `perfil` enum('cliente','admin') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'cliente',
  `aceita_termos` tinyint(1) DEFAULT '0',
  `data_criada` datetime DEFAULT CURRENT_TIMESTAMP,
  `reset_token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reset_token_expira` datetime DEFAULT NULL,
  PRIMARY KEY (`id_utilizador`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utilizadores`
--

LOCK TABLES `utilizadores` WRITE;
/*!40000 ALTER TABLE `utilizadores` DISABLE KEYS */;
INSERT INTO `utilizadores` VALUES (1,'João Morais','joaop13smorais@gmail.com','$2b$10$z7fOMuxRndtcUNLx4zoxzOFLlqZ0whKXA/osDp.SG23xiOiuTeCCq','918723666','+351','cliente',1,'2026-04-29 16:44:19',NULL,NULL),(6,'Admin','admin@modachique.pt','$2b$10$iMj8JoKMUehM8w.UnVUqnudBYW2M/rq9TQYxlv2zMt4QVJihHUzLe',NULL,'+351','admin',1,'2026-04-29 16:55:13',NULL,NULL),(9,'Pedro Moreira','p.moreira5555@gmail.com','$2b$10$pH2I628XVuArT.q5PbRmR.MWDN4RfIIBCbjzZwkUmWyJf6YLuhsSm','918241741','+351','cliente',1,'2026-05-06 20:57:09','7598b96da32db3d46bef7dc70ca5afa1e4d3ff81ce822ad7ab78441f9e51fc8e','2026-05-06 22:02:14'),(10,'Andre Barreira','andre2013barreira@gmail.com','$2b$10$dprXqnX8SQEhdH7kRedQjOWNS0D6aZKs/CAxhG8kR4FeUvSYhHgFW','912332123','+351','cliente',1,'2026-05-11 21:33:10',NULL,NULL);
/*!40000 ALTER TABLE `utilizadores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `variante`
--

DROP TABLE IF EXISTS `variante`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `variante` (
  `id_variante` int NOT NULL AUTO_INCREMENT,
  `id_produto` int NOT NULL,
  `tamanho` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `cor` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `stock_variante` int DEFAULT '0',
  `hex_cor` varchar(7) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id_variante`),
  KEY `id_produto` (`id_produto`),
  CONSTRAINT `variante_ibfk_1` FOREIGN KEY (`id_produto`) REFERENCES `produtos` (`id_produto`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=151 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `variante`
--

LOCK TABLES `variante` WRITE;
/*!40000 ALTER TABLE `variante` DISABLE KEYS */;
INSERT INTO `variante` VALUES (1,1,'S','Floral',15,'#F5A9BC'),(2,1,'M','Floral',15,'#F5A9BC'),(3,1,'L','Floral',10,'#F5A9BC'),(4,2,'S','Bege',10,'#F5F5DC'),(5,2,'M','Bege',10,'#F5F5DC'),(6,2,'L','Bege',5,'#F5F5DC'),(7,3,'S','Preto',8,'#000000'),(8,3,'M','Preto',8,'#000000'),(9,3,'L','Preto',4,'#000000'),(10,4,'S','Azul Ganga',15,'#5D76A9'),(11,4,'M','Azul Ganga',15,'#5D76A9'),(12,4,'L','Azul Ganga',5,'#5D76A9'),(22,8,'S','Verde Militar',10,'#4B5320'),(23,8,'M','Verde Militar',10,'#4B5320'),(24,8,'L','Verde Militar',8,'#4B5320'),(25,9,'S','Branco',40,'#FFFFFF'),(26,9,'M','Branco',40,'#FFFFFF'),(27,9,'L','Branco',20,'#FFFFFF'),(28,10,'S','Tie-Dye',20,NULL),(29,10,'M','Tie-Dye',20,NULL),(30,11,'S','Preto',15,'#000000'),(31,11,'M','Preto',20,'#000000'),(32,12,'M','Camel',10,'#C19A6B'),(33,12,'L','Camel',10,'#C19A6B'),(34,13,'S','Bege',7,'#F5F5DC'),(35,13,'M','Bege',8,'#F5F5DC'),(36,14,'S','Rosa',10,'#FFC0CB'),(37,14,'M','Rosa',15,'#FFC0CB'),(38,15,'S','Creme',15,'#FFFDD0'),(39,15,'M','Creme',15,'#FFFDD0'),(40,16,'Único','Cinza',35,'#808080'),(41,17,'S','Branco',15,'#FFFFFF'),(42,17,'M','Branco',15,'#FFFFFF'),(43,18,'S','Preto',10,'#000000'),(44,18,'M','Preto',10,'#000000'),(45,19,'M','Azul',20,'#4682B4'),(46,19,'L','Azul',20,'#4682B4'),(47,20,'S','Cinza',6,'#808080'),(48,20,'M','Cinza',6,'#808080'),(49,21,'M','Camel',8,'#C19A6B'),(50,21,'L','Camel',7,'#C19A6B'),(51,22,'S','Verde',20,'#008000'),(52,22,'M','Verde',20,'#008000'),(53,23,'S','Azul',25,'#0000FF'),(54,23,'M','Azul',25,'#0000FF'),(55,24,'36','Preto',12,'#000000'),(56,24,'38','Preto',13,'#000000'),(57,25,'L','Cinza',30,'#808080'),(58,25,'XL','Cinza',30,'#808080'),(59,26,'S','Rosa',20,'#FFC0CB'),(60,26,'M','Rosa',25,'#FFC0CB'),(61,27,'M','Preto',20,'#000000'),(62,27,'L','Preto',20,'#000000'),(63,31,'37','Branco',10,'#FFFFFF'),(64,31,'38','Branco',10,'#FFFFFF'),(65,32,'36','Branco',30,'#FFFFFF'),(66,32,'37','Branco',25,'#FFFFFF'),(67,33,'37','Bege',15,'#F5F5DC'),(68,33,'38','Bege',15,'#F5F5DC'),(69,34,'37','Dourado',15,'#FFD700'),(70,34,'38','Dourado',10,'#FFD700'),(71,35,'36','Castanho',8,'#8B4513'),(72,35,'37','Castanho',10,'#8B4513'),(73,36,'37','Preto',8,'#000000'),(74,36,'38','Preto',6,'#000000'),(75,37,'37','Camel',12,'#C19A6B'),(76,37,'38','Camel',10,'#C19A6B'),(77,49,'Único','Dourado',50,'#FFD700'),(78,50,'Único','Dourado',45,'#FFD700'),(79,51,'Único','Prateado',60,'#C0C0C0'),(80,47,'Único','Tartaruga',30,'#43302E'),(81,48,'Único','Preto',40,'#000000'),(82,42,'Único','Preto',20,'#000000'),(83,43,'Único','Camel',25,'#C19A6B'),(84,44,'Único','Dourado',30,'#FFD700'),(85,45,'Único','Rosa',35,'#FFC0CB'),(86,46,'Único','Castanho',25,'#8B4513'),(93,28,'S','Preto',8,'#000000'),(94,28,'M','Preto',10,'#000000'),(95,28,'L','Preto',7,'#000000'),(96,29,'S','Branco',6,'#FFFFFF'),(97,29,'M','Branco',6,'#FFFFFF'),(98,29,'L','Branco',6,'#FFFFFF'),(99,30,'S','Rosa',10,'#FFC0CB'),(100,30,'M','Rosa',10,'#FFC0CB'),(101,34,'36','Dourado',10,'#FFD700'),(106,35,'38','Castanho',7,'#8B4513'),(107,37,'36','Camel',5,'#C19A6B'),(108,37,'37','Camel',10,'#C19A6B'),(109,37,'38','Camel',7,'#C19A6B'),(110,36,'36','Preto',6,'#000000'),(113,38,'36','Preto',10,'#000000'),(114,38,'37','Preto',10,'#000000'),(115,38,'38','Preto',8,'#000000'),(116,39,'36','Castanho',6,'#8B4513'),(117,39,'37','Castanho',8,'#8B4513'),(118,39,'38','Castanho',4,'#8B4513'),(119,41,'36','Preto',6,'#000000'),(120,41,'37','Preto',6,'#000000'),(121,41,'38','Preto',6,'#000000'),(122,40,'36','Nude',6,'#E3C5AF'),(123,40,'37','Nude',8,'#E3C5AF'),(124,40,'38','Nude',6,'#E3C5AF'),(125,5,'XS','Azul',10,'#0000FF'),(126,5,'S','Azul',15,'#0000FF'),(127,5,'M','Azul',15,'#0000FF'),(128,5,'L','Azul',10,'#0000FF'),(129,5,'XL','Azul',5,'#0000FF'),(130,6,'S','Creme',10,'#FFFDD0'),(131,6,'M','Creme',15,'#FFFDD0'),(132,6,'L','Creme',10,'#FFFDD0'),(133,6,'XL','Creme',5,'#FFFDD0'),(134,7,'XS','Azul Claro',10,'#ADD8E6'),(135,7,'S','Azul Claro',15,'#ADD8E6'),(136,7,'M','Azul Claro',15,'#ADD8E6'),(137,7,'L','Azul Claro',10,'#ADD8E6'),(147,31,'36','Preto',5,'#000000'),(148,31,'37','Preto',5,'#000000'),(149,31,'38','Preto',5,'#000000'),(150,31,'39','Preto',5,'#000000');
/*!40000 ALTER TABLE `variante` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-14 15:51:04
