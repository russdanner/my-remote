#!/usr/bin/env bash

cd "$(dirname "$0")"

if ! [ -x "$(command -v react-scripts-ts)" ]; then
  yarn build
  exit 1
fi

echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo ">>> Starting app build"
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo ""

# Pull in any new dependencies
yarn

# Build the app
react-scripts-ts build

# Copy bundle on to static assets directory
cp build/static/js/main.*.js ../../static-assets/js/main.js

# Remove the source map reference
sed -i '' -e '$ d' ../../static-assets/js/main.js

# Insert the copyright banner
cat license.txt > main.js.tmp
cat ../../static-assets/js/main.js >> main.js.tmp
mv main.js.tmp ../../static-assets/js/main.js

# Delete the `build` output folder
rm -rf build

echo "Building stylesheet..."
sass --no-source-map ../sass/main.scss:../../static-assets/css/main.css

echo ""
echo "<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<"
echo "<<< Build completed successfully :)"
echo "<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<"

