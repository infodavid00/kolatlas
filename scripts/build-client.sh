
cd client
npm run build
cd ..
rm -rf src/views
mv client/dist src/
mv src/dist src/views
