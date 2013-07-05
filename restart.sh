#!/bin/bash
export PERL5LIB=/nfs/panda/ensemblgenomes/external/httpd-2.2.22/lib/site_perl
# Restart apache server
echo "Restarting Apache..."
/nfs/panda/ensemblgenomes/external/httpd-2.2.22/bin/httpd -k restart -d $PWD -f $PWD/conf/httpd.conf 