division=$1
release_number=$2

echo "TO CREATE conf/settings.conf for $1"
# COMMENT OUT SERVER BLOCK
serverblock=`grep -n "SERVER $division" conf/settings.conf | cut -f1 -d:`
sed -i "$((serverblock+1)), $((serverblock+2)) s/^#//" conf/settings.conf

# COMMENT OUT URLPREFIX
urlblock=`grep -n "URL $division" conf/settings.conf | cut -f1 -d:`
sed -i "$((urlblock+1)), $((urlblock+2)) s/^#//" conf/settings.conf

# COMMENT OUT COLOR
colourblock=`grep -n "COLOUR $division" conf/settings.conf | cut -f1 -d:`
sed -i "$((colourblock+1)), $((colourblock+7)) s/^#//" conf/settings.conf

# Update dirs
sed -i -e "s/e<ensembl_release_number>/www_$release_number/" -i -e "s/<division>/$division/" conf/settings.conf
