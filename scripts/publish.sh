npm adduser
ORIG_DIRECTORY=`pwd`
PACKAGE_SOURCE=build/packages
for package in $PACKAGE_SOURCE/*/
do
    PACKAGE_DIR="$(basename ${package})"
    cd $package

    PACKAGE_NAME=`node -e "console.log(require('./package.json').name)"`

    cd $ORIG_DIRECTORY

  echo "Publishing ${PACKAGE_NAME}@${VERSION} --tag ${TAG}"
  npm publish

#   cd $ORIG_DIRECTORY
done