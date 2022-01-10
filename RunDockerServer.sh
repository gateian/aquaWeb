#!/usr/bin/env bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

docker run  -p 80:80 -v $SCRIPT_DIR:/usr/local/apache2/htdocs/ --name aquaweb-1  httpd