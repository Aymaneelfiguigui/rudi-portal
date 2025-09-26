#!/bin/bash

# Script to fix docker-compose.yml image names
# Run this from the ci/docker-compose/portal/ directory

# Get the RUDI version from the project
RUDI_VERSION="3.2.6"  # You can also get this dynamically: $(xmlstarlet sel -N mvn='http://maven.apache.org/POM/4.0.0' -t -m '/mvn:project/mvn:version' -v . -n ../../../pom.xml)

echo "Updating docker-compose.yml with correct image names (version: $RUDI_VERSION)..."

# Create a backup
cp docker-compose.yml docker-compose.yml.backup

# Update image names to match the built images
sed -i "s/registry-image/rudi\/registry:$RUDI_VERSION/g" docker-compose.yml
sed -i "s/gateway-image/rudi\/gateway:$RUDI_VERSION/g" docker-compose.yml
sed -i "s/strukture-image/rudi\/strukture:$RUDI_VERSION/g" docker-compose.yml
sed -i "s/acl-image/rudi\/acl:$RUDI_VERSION/g" docker-compose.yml
sed -i "s/kalim-image/rudi\/kalim:$RUDI_VERSION/g" docker-compose.yml
sed -i "s/konsult-image/rudi\/konsult:$RUDI_VERSION/g" docker-compose.yml
sed -i "s/kos-image/rudi\/kos:$RUDI_VERSION/g" docker-compose.yml
sed -i "s/projekt-image/rudi\/projekt:$RUDI_VERSION/g" docker-compose.yml
sed -i "s/selfdata-image/rudi\/selfdata:$RUDI_VERSION/g" docker-compose.yml
sed -i "s/konsent-image/rudi\/konsent:$RUDI_VERSION/g" docker-compose.yml
sed -i "s/apigateway-image/rudi\/apigateway:$RUDI_VERSION/g" docker-compose.yml
sed -i "s/nodestub-image/rudi\/nodestub:$RUDI_VERSION/g" docker-compose.yml

echo "Docker compose file updated successfully!"
echo "Original file backed up as docker-compose.yml.backup"

# Show the changes
echo ""
echo "Updated image references:"
grep "image:" docker-compose.yml