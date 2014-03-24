#!/bin/bash
if [ -z "$APACHE_HOME" ]; then
    echo "Please set APACHE_HOME to the location of your Apache installation" 1>&2
    exit 1
fi
export PERL5LIB=${APACHE_HOME}/lib/site_perl
# Restart apache server
echo "Restarting Apache..."
${APACHE_HOME}/bin/httpd -k restart -d $PWD -f $PWD/conf/httpd.conf 
