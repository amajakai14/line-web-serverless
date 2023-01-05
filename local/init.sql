CREATE USER 'lineserverdb'@'%' IDENTIFIED BY 'lineserverpw';
GRANT ALL PRIVILEGES ON *.* TO 'lineserverdb'@'%';
CREATE DATABASE linemenudb;
