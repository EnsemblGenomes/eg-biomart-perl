#!/bin/bash -x

reg=$1
defreg="./conf/registryURLPointer.xml"
if [ -z "$reg" ]; then
    reg=$defreg
fi
reg=$(readlink -f $reg)

echo -ne 'n' | perl bin/configure.pl --clean -r $reg || {
    echo "Failed to rerun configure.pl with $ref"
    exit 1
}

./restart.sh