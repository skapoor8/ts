#!/bin/bash
IMPORT_FILE=$(find ./src/backups -print0 | xargs -r -0 ls -1 -t | head -1);
echo "Importing: $IMPORT_FILE";
mysql node_mikro_mysql_elist_manager < "$IMPORT_FILE";