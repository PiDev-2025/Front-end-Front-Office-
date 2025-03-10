# Clean JS
rm -rf node_modules
npm cache clean --force
npm install

cd ios
rm -rf Pods Podfile.lock build
pod deintegrate
pod cache clean --all
pod install
cd ..
