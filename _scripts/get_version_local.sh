# Get the version of the firmware from the _VERSION.h file
VERSION=$(grep '	"version": ' package.json | cut -d ' ' -f2 | cut -d ',' -f1 | tail -n1 | xargs)

echo $VERSION