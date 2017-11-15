#!/bin/bash -x



if [ -z "$1" ] || [ ! -d "$1" ];then
    echo "Supply a valid config dir"
    exit 1
else
    export ENSEMBL_MART_CONF_DIR=$1
fi


echo -ne 'n' | perl bin/configure.pl --clean -r 'registry.xml' || {
    echo "Failed to rerun configure.pl with $ref"
    exit 1
}

./restart.sh $ENSEMBL_MART_CONF_DIR
