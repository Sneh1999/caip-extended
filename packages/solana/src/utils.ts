import {
  AccountIdSplitParams,
  IdentifierSpec,
  getParams,
  isValidId,
  splitParams,
} from "caip-common";

// Define the base58btc pattern
const base58BTCChars =
  "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const base58BTCPattern = new RegExp(`^[${base58BTCChars}]+$`);

const solanaAddressRegex = new RegExp("[1-9A-HJ-NP-Za-km-z]{32,44}");

export function isValidSolanaChainId(
  id: string,
  spec: IdentifierSpec
): boolean {
  if (!isValidId(id, spec)) {
    return false;
  }

  const params = splitParams(id, spec);

  if (!isValidSolanaNamespaceAndReference(params[0], params[1])) {
    return false;
  }

  return true;
}

export function isValidSolanaAccountId(
  id: string,
  spec: IdentifierSpec
): boolean {
  if (!isValidId(id, spec)) {
    return false;
  }

  const { namespace, reference, address } = getParams<AccountIdSplitParams>(
    id,
    this.spec
  );

  if (!isValidSolanaNamespaceAndReference(namespace, reference)) {
    return false;
  }

  if (!isValidSolanaAddress(address)) {
    return false;
  }

  return true;
}

export function isValidSolanaNamespaceAndReference(
  namespace: string,
  reference: string
): boolean {
  if (namespace !== "solana") {
    return false;
  }

  // solana reference should only be 32 characters long
  if (reference.length !== 32) {
    return false;
  }

  // Check if the string matches the base58btc pattern
  if (!base58BTCPattern.test(reference)) {
    return false;
  }
}

export function isValidSolanaAddress(address: string): boolean {
  return solanaAddressRegex.test(address);
}
