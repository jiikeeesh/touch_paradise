const fs = require('fs');

const omdPath = 'node_modules/next/dist/compiled/@vercel/og';

if (fs.existsSync(omdPath)) {
  fs.writeFileSync(`${omdPath}/index.edge.js`, 'module.exports = { ImageResponse: class ImageResponse {} };');
  try {
    fs.unlinkSync(`${omdPath}/resvg.wasm`);
  } catch (err) {}
  console.log('Successfully stripped @vercel/og limits');
} else {
  console.log('Path not found');
}
