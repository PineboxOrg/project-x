rm -rf build/
echo "Compiling Typescript..."
./node_modules/.bin/tsc
echo "Compiled Typescript"

rsync -a --exclude=*.ts packages/ build/packages
echo "angular-plugins plugins available at build/packages:"
ls build/packages
