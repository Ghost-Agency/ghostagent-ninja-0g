import { ZgFile, Indexer } from '@0gfoundation/0g-ts-sdk';
import { ethers } from 'ethers';
import * as fs from 'fs';
import * as path from 'path';

// Turbo Indexer configuration bounds for 0G Testnet
const RPC_URL = process.env.ZEROG_RPC_URL || 'https://evmrpc-testnet.0g.ai';
const INDEXER_RPC = process.env.ZEROG_INDEXER_URL || 'https://indexer-storage-testnet-turbo.0g.ai';
const PRIVATE_KEY = process.env.TREASURY_PRIVATE_KEY || ''; // Must have faucet funds

if (!PRIVATE_KEY) {
  console.error("❌ CRITICAL ERROR: TREASURY_PRIVATE_KEY is missing in the environment variables.");
  process.exit(1);
}

const provider = new ethers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const indexer = new Indexer(INDEXER_RPC);

const OUTPUT_MAP_FILE = path.join(__dirname, '..', '0g-asset-map.json');

async function uploadImageToZeroG(filePath: string): Promise<string> {
  const file = await ZgFile.fromFilePath(filePath);
  
  // Construct internal Merkle Tree structure synchronously before broadcast
  const [tree, treeErr] = await file.merkleTree();
  if (treeErr !== null) {
      throw new Error(`Failed to generate Merkle tree for ${filePath}: ${treeErr}`);
  }

  const rootHashHex = tree?.rootHash() || '';
  console.log(`[0G HASHING] Merkle Root calculated: ${rootHashHex}`);

  // Push to DA Indexer
  const [tx, err] = await indexer.upload(file, RPC_URL, signer);
  if (err !== null) {
      throw new Error(`Upload transaction failed for ${filePath}: ${err}`);
  }

  await file.close(); 
  
  // Safe extraction based on payload architecture (under 4GB single root)
  if (tx && 'rootHash' in tx) {
      return tx.rootHash;
  } else if (tx && 'rootHashes' in tx) {
      return (tx as Record<string, any>).rootHashes[0];
  }

  return rootHashHex; 
}

async function bulkUploadDirectory(targetDir: string) {
  console.log(`\n🚀 Initializing 0G Storage Bulk Importer...`);
  console.log(`📂 Source Directory: ${targetDir}`);
  
  if (!fs.existsSync(targetDir)) {
      console.error(`❌ CRITICAL ERROR: Directory ${targetDir} does not exist.`);
      return;
  }

  const files = fs.readdirSync(targetDir);
  const mediaMap: Record<string, string> = {};

  for (const fileName of files) {
      const fullPath = path.join(targetDir, fileName);
      if (fs.statSync(fullPath).isFile() && !fileName.startsWith('.')) {
          console.log(`\n⬆️ Uploading ${fileName}...`);
          try {
              const rootHash = await uploadImageToZeroG(fullPath);
              mediaMap[fileName] = rootHash;
              console.log(`✅ Success | File: ${fileName} -> RootHash: ${rootHash}`);
          } catch (error) {
              console.error(`🛑 FAILED to upload ${fileName}:`, error);
          }
      }
  }

  fs.writeFileSync(OUTPUT_MAP_FILE, JSON.stringify(mediaMap, null, 2));
  console.log(`\n🎉 Upload pass completed! JSON mapping preserved at ${OUTPUT_MAP_FILE}`);
}

// Intercept argv payload for the target directory
const targetFolderArg = process.argv[2];
if (!targetFolderArg) {
  console.log("⚠️ Usage: npx ts-node scripts/upload-images-0g.ts <ABSOLUTE_PATH_TO_IMAGE_FOLDER>");
  process.exit(1);
}

bulkUploadDirectory(targetFolderArg).catch(console.error);
