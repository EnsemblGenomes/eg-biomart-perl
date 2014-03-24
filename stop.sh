#!/bin/bash
export PERL5LIB=/nfs/panda/ensemblgenomes/external/httpd-2.2.22/lib/site_perl
# Restart apache server
echo "Stopping Apache..."
/nfs/panda/ensemblgenomes/external/httpd-2.2.22/bin/httpd -k stop -d $PWD -f $PWD/conf/httpd.conf 