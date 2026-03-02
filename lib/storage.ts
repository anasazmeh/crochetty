// R2 bucket binding is injected by Cloudflare Workers runtime.
// The binding name "R2" is declared in wrangler.toml.
// In local Next.js dev (non-Workers), we fall back to a public URL.

const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL ?? "";

export function getProductImageUrl(key: string): string {
  if (!key) return "/placeholder.jpg";
  if (key.startsWith("http")) return key;
  return `${R2_PUBLIC_URL}/${key}`;
}

interface R2Bucket {
  put(
    key: string,
    value: ArrayBuffer,
    options?: { httpMetadata?: { contentType?: string } }
  ): Promise<void>;
}

export async function uploadProductImage(
  file: ArrayBuffer,
  key: string,
  contentType: string
): Promise<string> {
  // Cloudflare Workers global binding
  const r2 = (globalThis as Record<string, unknown>)["R2"] as R2Bucket | undefined;
  if (!r2) {
    throw new Error(
      "R2 binding not available. This function only works on Cloudflare Workers."
    );
  }
  await r2.put(key, file, { httpMetadata: { contentType } });
  return getProductImageUrl(key);
}
