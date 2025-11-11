#!/bin/bash

VERSION_REMOTE=$(bash ./_scripts/get_version_remote.sh)
VERSION_LOCAL=$(bash ./_scripts/get_version_local.sh)

# check if VERSION_REMOTE is empty or hash string
if [ -z "$VERSION_REMOTE" ]; then
    echo $VERSION_LOCAL
    exit 0
fi

REMOTE_MAJOR=$(echo $VERSION_REMOTE | cut -d '.' -f1 | xargs)
REMOTE_MINOR=$(echo $VERSION_REMOTE | cut -d '.' -f2 | xargs)
REMOTE_PATCH=$(echo $VERSION_REMOTE | cut -d '.' -f3 | xargs)

LOCAL_MAJOR=$(echo $VERSION_LOCAL | cut -d '.' -f1 | xargs)
LOCAL_MINOR=$(echo $VERSION_LOCAL | cut -d '.' -f2 | xargs)
LOCAL_PATCH=$(echo $VERSION_LOCAL | cut -d '.' -f3 | xargs)

NEW_VERSION=$VERSION_LOCAL
NEW_PATCH=$(($REMOTE_PATCH + 1))

if [ "$REMOTE_MAJOR" -gt "$LOCAL_MAJOR" ]; then
    NEW_VERSION="$REMOTE_MAJOR.$REMOTE_MINOR.$NEW_PATCH"
elif [ "$REMOTE_MAJOR" -eq "$LOCAL_MAJOR" ]; then
    if [ "$REMOTE_MINOR" -gt "$LOCAL_MINOR" ]; then
        NEW_VERSION="$REMOTE_MAJOR.$REMOTE_MINOR.$NEW_PATCH"
    elif [ "$REMOTE_MINOR" -eq "$LOCAL_MINOR" ]; then
        if [ "$REMOTE_PATCH" -gt "$LOCAL_PATCH" ]; then
            NEW_VERSION="$REMOTE_MAJOR.$REMOTE_MINOR.$NEW_PATCH"
        fi
        if [ "$REMOTE_PATCH" -eq "$LOCAL_PATCH" ]; then
            NEW_VERSION="$REMOTE_MAJOR.$REMOTE_MINOR.$NEW_PATCH"
        fi
    fi
fi

# Update the version in the package.json file
sed -i'' -e 's/"version": "'$VERSION_LOCAL'"/"version": "'$NEW_VERSION'"/g' package.json
rm -rf package.json-e

echo $NEW_VERSION
