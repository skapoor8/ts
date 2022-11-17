#!/bin/bash
mkdir -p src/backups
mysqldump node_mikro_mysql_elist_manager > src/backups/$(date +%Y-%m-%d-%H-%M-%S).sql