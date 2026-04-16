import { ethers } from 'ethers';

const ZEROG_RPC = process.env.ZEROG_CHAIN_RPC || 'https://evmrpc-testnet.0g.ai';
const ZEROG_PRIVATE_KEY = process.env.ZEROG_PRIVATE_KEY || process.env.ZEROG_STORAGE_KEY || '';
const ZEROG_STORAGE_NODE = process.env.ZEROG_STORAGE_NODE || 'https://storage-node-testnet.0g.ai';
const ZEROG_INDEXER_URL = process.env.ZEROG_INDEXER_URL || 'https://indexer-testnet.0g.ai';
const ZEROG_FLOW_ADDRESS = process.env.ZEROG_FLOW_ADDRESS || '0x0460aA47b41a66694c0a73f667a40812ed49e9dD'; // standard flow contract
const ZEROG_GATEWAY = process.env.NEXT_PUBLIC_ZEROG_GATEWAY || process.env.ZEROG_GATEWAY || `${ZEROG_STORAGE_NODE}/download`;

export async function uploadToZeroG(data: Blob | string | Buffer, filename: string): Promise<{ cid: string; url: string } | null> {
  const isMock = !ZEROG_PRIVATE_KEY || !ZEROG_STORAGE_NODE;
  if (isMock) {
    console.warn(`[0G Storage] Environment variables missing. Mocking upload for ${filename}...`);
    const mockHash = `mock-0g-${Date.now()}-${filename}`;
    return { cid: mockHash, url: zeroGGatewayUrl(mockHash) };
  }

  try {
    const { ZgFile, Indexer, getFlowContract } = await import('@0glabs/0g-ts-sdk');

    const provider = new ethers.JsonRpcProvider(ZEROG_RPC);
    const signer = new ethers.Wallet(ZEROG_PRIVATE_KEY, provider);
    const flowContract = getFlowContract(ZEROG_FLOW_ADDRESS, signer);
    
    let buffer: Buffer;
    if (typeof data === 'string') {
      buffer = Buffer.from(data, 'utf-8');
    } else if (data instanceof Buffer) {
      buffer = data;
    } else {
      buffer = Buffer.from(await data.arrayBuffer());
    }

    const file = await ZgFile.fromBuffer(buffer);
    const [tree, err] = await file.merkleTree();
    if (err) {
      console.error("0G File processing error:", err);
      throw err;
    }

    const rootHash = tree.rootHash();
    
    // Submit on-chain Flow
    const tx = await flowContract.submit({ ...tree.submission() });
    await tx.wait(); // Wait for 0G flow confirmation

    // Upload to 0G Storage
    const indexerUrl = ZEROG_INDEXER_URL || ZEROG_STORAGE_NODE; // Fallback pattern 
    
    try {
      const indexer = new Indexer(indexerUrl);
      await indexer.upload(file, 0, ZEROG_STORAGE_NODE);
    } catch (e) {
      // In early TS SDK the upload signature might be indexer.upload(ZEROG_STORAGE_NODE, file) or file, 0, url.
      // Based on docs briefing: await indexer.upload(ZEROG_STORAGE_NODE, file);
      const idx = new Indexer(ZEROG_INDEXER_URL);
      await idx.upload(ZEROG_STORAGE_NODE, file);
    }
    
    // Convert roothash hex
    const cid = rootHash.startsWith('0x') ? rootHash : `0x${rootHash}`;
    
    return {
      cid,
      url: zeroGGatewayUrl(cid),
    };
  } catch (err) {
    console.error("uploadToZeroG failed:", err);
    return { cid: "", url: "" };
  }
}

export function zeroGGatewayUrl(cid: string): string {
  // Return the URL to download this file based on 0G Gateway/Node standard
  // 0g typically downloads via <storage-node>/<roothash> or something similar.
  const base = ZEROG_GATEWAY.replace(/\/$/, "");
  if (!cid) return base;
  return `${base}/${cid}`;
}
