/**
 * Upload agent images to 0G storage
 * Run: npx tsx scripts/upload-images-to-0g.ts
 * 
 * Requires:
 * - ZEROG_PRIVATE_KEY (with testnet tokens)
 * - ZEROG_STORAGE_NODE
 * - ZEROG_CHAIN_RPC
 */

import { uploadToZeroG } from '../app/services/zero-g-storage';

// Images to upload with their current IPFS CIDs (for reference)
const IMAGES_TO_UPLOAD = [
  // SLD Visual base images (from genome-metadata.ts)
  { name: 'agent', currentCid: 'bafkreihdpulp5riv3dkhtomi2iurgeypvplhdsi3nnkumzmvx725xc4yly', url: 'https://ipfs.io/ipfs/bafkreihdpulp5riv3dkhtomi2iurgeypvplhdsi3nnkumzmvx725xc4yly' },
  { name: 'openclaw', currentCid: 'bafkreigyk2c7gg5ijwvg4v6pyopcioatdjsfffvnkplgqyc2t3jowe3t7e', url: 'https://ipfs.io/ipfs/bafkreigyk2c7gg5ijwvg4v6pyopcioatdjsfffvnkplgqyc2t3jowe3t7e' },
  { name: 'molt', currentCid: 'bafkreicyrwnh4oxk4e53kly7kzmlpb345pqr5gd2v5acf4kcyl75e4hjdy', url: 'https://ipfs.io/ipfs/bafkreicyrwnh4oxk4e53kly7kzmlpb345pqr5gd2v5acf4kcyl75e4hjdy' },
  { name: 'picoclaw', currentCid: 'bafkreic7ec6elxd7b425wpsovvgkumidkqsxmgj5ffnhp6icznagaqlgti', url: 'https://ipfs.io/ipfs/bafkreic7ec6elxd7b425wpsovvgkumidkqsxmgj5ffnhp6icznagaqlgti' },
  { name: 'vault', currentCid: 'bafkreibxujpkkylek6uznnl2d2d4vmpxi3aiowxyx2ydf5xo4xexcnksau', url: 'https://ipfs.io/ipfs/bafkreibxujpkkylek6uznnl2d2d4vmpxi3aiowxyx2ydf5xo4xexcnksau' },
  { name: 'nftmail', currentCid: 'bafkreiftlxmthuftcrcxa27jtsigsuf2s37dngcxpmqrnhefjaybstpscm', url: 'https://ipfs.io/ipfs/bafkreiftlxmthuftcrcxa27jtsigsuf2s37dngcxpmqrnhefjaybstpscm' },
  
  // NFT collection icons (from pair-nft/page.tsx)
  { name: 'ens-icon', currentCid: 'bafkreifv35abvqlhdtc4g2i4xelnmxnhaac7exyu6r24o3fbgthwcmupwy', url: 'https://ipfs.io/ipfs/bafkreifv35abvqlhdtc4g2i4xelnmxnhaac7exyu6r24o3fbgthwcmupwy' },
  { name: 'chonk-icon', currentCid: 'bafkreiczeqhex35dvj4ewbzn2gyqnbgqb22np5zgp223vnbfhaod6sv4sq', url: 'https://ipfs.io/ipfs/bafkreiczeqhex35dvj4ewbzn2gyqnbgqb22np5zgp223vnbfhaod6sv4sq' },
  { name: 'pownft-icon', currentCid: 'bafkreick55xkc2ucnmk2wjbzl6a5chqkvmwjll4oqbqajfh5mapd3s7fku', url: 'https://ipfs.io/ipfs/bafkreick55xkc2ucnmk2wjbzl6a5chqkvmwjll4oqbqajfh5mapd3s7fku' },
  { name: 'normie-icon', currentCid: 'bafkreigdisoyfs75rneioevm5irn2k4prdddtuum5bpn27bykhjtdc4fii', url: 'https://ipfs.io/ipfs/bafkreigdisoyfs75rneioevm5irn2k4prdddtuum5bpn27bykhjtdc4fii' },
  { name: 'other-icon', currentCid: 'bafkreid7jamriw5jneuarcq2q6lrbfsqe76eebv6r2rworrnhyj2rpsuem', url: 'https://ipfs.io/ipfs/bafkreid7jamriw5jneuarcq2q6lrbfsqe76eebv6r2rworrnhyj2rpsuem' },
];

async function downloadImage(url: string): Promise<Buffer | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`Failed to download ${url}: ${res.status}`);
      return null;
    }
    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (e) {
    console.error(`Error downloading ${url}:`, e);
    return null;
  }
}

async function main() {
  console.log('=== Uploading images to 0G Storage ===\n');
  
  const results: { name: string; oldCid: string; newCid: string; url: string }[] = [];
  
  for (const img of IMAGES_TO_UPLOAD) {
    console.log(`Processing: ${img.name}`);
    console.log(`  Current: ${img.currentCid}`);
    
    // Download from IPFS
    const buffer = await downloadImage(img.url);
    if (!buffer) {
      console.log(`  ❌ Failed to download, skipping\n`);
      continue;
    }
    console.log(`  Downloaded: ${buffer.length} bytes`);
    
    // Upload to 0G
    const result = await uploadToZeroG(buffer, `${img.name}.png`);
    if (!result || !result.cid) {
      console.log(`  ❌ Failed to upload to 0G\n`);
      continue;
    }
    
    console.log(`  ✅ 0G CID: ${result.cid}`);
    console.log(`  ✅ URL: ${result.url}\n`);
    
    results.push({
      name: img.name,
      oldCid: img.currentCid,
      newCid: result.cid,
      url: result.url,
    });
  }
  
  // Print summary
  console.log('\n=== UPLOAD COMPLETE ===');
  console.log('\nUpdate these in your code:\n');
  
  console.log('// SLD_VISUAL (genome-metadata.ts)');
  results.filter(r => !r.name.includes('-icon')).forEach(r => {
    console.log(`${r.name}: '${r.newCid}', // was: ${r.oldCid}`);
  });
  
  console.log('\n// NFT Collection Icons (pair-nft/page.tsx)');
  results.filter(r => r.name.includes('-icon')).forEach(r => {
    const shortName = r.name.replace('-icon', '');
    console.log(`${shortName}: '${r.newCid}', // was: ${r.oldCid}`);
  });
  
  console.log('\n=== ENV Check ===');
  console.log(`ZEROG_PRIVATE_KEY: ${process.env.ZEROG_PRIVATE_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log(`ZEROG_STORAGE_NODE: ${process.env.ZEROG_STORAGE_NODE || 'https://storage-node-testnet.0g.ai'}`);
  console.log(`ZEROG_CHAIN_RPC: ${process.env.ZEROG_CHAIN_RPC || 'https://evmrpc-testnet.0g.ai'}`);
}

main().catch(console.error);
