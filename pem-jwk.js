import fs from "fs";
import { pem2jwk } from "pem-jwk";

const publicPem = fs.readFileSync("public.pem", "utf8");
const jwk = pem2jwk(publicPem);

// Add metadata for JWKS
const jwks = {
  keys: [
    {
      ...jwk,
      kid: "my-key-id",  // Key ID for rotation
      use: "sig",        // signing
      alg: "RS256"       // algorithm
    }
  ]
};

console.log(JSON.stringify(jwks, null, 2));
