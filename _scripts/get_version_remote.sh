# Get the latest tag from the remote repository
VERSION=$(git describe --tags --always --abbrev=0)

echo $VERSION