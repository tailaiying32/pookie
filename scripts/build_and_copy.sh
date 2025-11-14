cd client
npm install 
npm run build


rm -rf ../server/dist
cp -R dist ../server/dist

cd ..