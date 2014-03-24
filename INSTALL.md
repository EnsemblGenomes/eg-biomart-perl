=============
Quick Install
=============

Before starting you'll need apache and mod_perl installed. You are also advised 
to read the full installation instructions available on http://www.biomart.org/ 

Please note that the example supplied, conf/registryURLPointer.xml, contains details 
of Ensembl Genomes release 22 mart databases from the Ensembl Genomes public MySQL
server mysql.ebi.ac.uk. 

This should only be used for testing, and should NOT be used for running your own 
mart server. For running production marts, please download the MySQL dumps from 
ftp://ftp.ensemblgenomes.org/pub/current and load onto your own local MySQL server.

Setup
=====

Create a file conf/settings.conf (based on settings.conf.example).

Change the following line to a location where temporary files can be written by the web user:

    resultsDir1=/path/to/test/files

Change the followings line in conf/settings.conf:

    apacheBinary=/path/to/apache/bin/httpd
    serverHost=localhost
    port=5555

Change the following line in conf/log4perl.conf to specify the log location:

    log4perl.appender.logFile.filename = /path/to/logs/log4perl_log


1) Using helper scripts
=======================

Alternatively, use the standalone shell scripts provided:

    # configure and start Apache (accepts defaults)
    cd eg-biomart-perl
    export APACHE_HOME=[path to Apache]
    ./redo.sh conf/registryURLPointer.xml 
    
    # (re)start the apache server
    ./restart.sh
    
    # stop the apache server
    ./stop.sh

2) Direct configuration
=======================

    # configure biomart
    cd eg-biomart-perl
    perl bin/configure.pl -r conf/exampleMartURLLocation.xml

Follow the prompts, if you unsure what to answer hit return. 

    # run your standalone apache instance 
    cd eg-biomart-perl
    [path to Apache]/bin/httpd -d $PWD

(the path needs to be the same as chosen in step one of your configuration)

Point your browser to http://localhost:5555
(or change the port if you chosen a different option in the configuration step)

If you are having problems or need more information consult the documentation
available on www.biomart.org. You can also consult the Ensembl Genomes development
team on dev@ensembl.org or helpdesk@ensemblgenomes.org.

