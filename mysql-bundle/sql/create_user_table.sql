CREATE TABLE `user` (
  `id`       BIGINT(20)  NOT NULL AUTO_INCREMENT,
  `nickname` VARCHAR(50) NOT NULL,
  `username` VARCHAR(50)          DEFAULT NULL,
  `gender`   VARCHAR(10)          DEFAULT NULL,
  `age`      INT(11)              DEFAULT NULL,
  PRIMARY KEY (`id`)
)
  ENGINE = InnoDB
  AUTO_INCREMENT = 1
  DEFAULT CHARSET = utf8;