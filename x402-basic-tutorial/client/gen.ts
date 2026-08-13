import { mnemonicFromSeed } from "@algorandfoundation/algokit-utils/algo25";
import crypto from "crypto";

const seed = crypto.randomBytes(32);
const mnemonic = mnemonicFromSeed(seed);
console.log("MNEMONIC=" + mnemonic);
