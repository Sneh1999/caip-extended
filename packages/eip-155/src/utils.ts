import {
  AccountIdSplitParams,
  AssetNameParams,
  IdentifierSpec,
  getParams,
  isValidId,
  splitParams,
} from "caip-common";
import createKeccakHash from "keccak";

const eip155ChainIdRegex = new RegExp(`/^\d{1,32}$/`);

export function isValidEIP155ChainId(
  id: string,
  spec: IdentifierSpec
): boolean {
  if (!isValidId(id, spec)) {
    return false;
  }

  const params = splitParams(id, spec);

  if (!isValidEIP155ChainIdNamespaceAndReference(params[0], params[1])) {
    return false;
  }

  return true;
}

export function isValidEIP155AccountId(
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

  if (!isValidEIP155ChainIdNamespaceAndReference(namespace, reference)) {
    return false;
  }

  if (!isValidEIP155ChecksumAddress(address)) {
    return false;
  }

  return true;
}

export function isValidEIP155AssetName(
  id: string,
  spec: IdentifierSpec
): boolean {
  if (!isValidId(id, spec)) {
    return false;
  }

  const { namespace, reference } = getParams<AssetNameParams>(id, spec);

  if (!isValidEIP155AssetNamespaceAndReference(namespace, reference)) {
    return false;
  }
}

export function isValidEIP155AssetNamespaceAndReference(
  namespace: string,
  reference: string
): boolean {
  if (namespace !== "erc20" && namespace !== "erc721") {
    return false;
  }
  if (!isValidEIP155ChecksumAddress(reference)) {
    return false;
  }

  return true;
}

export function isValidEIP155ChainIdNamespaceAndReference(
  namespace: string,
  reference: string
): boolean {
  if (namespace !== "eip155") {
    return false;
  }

  if (!eip155ChainIdRegex.test(reference)) {
    return false;
  }

  return true;
}

export const isValidAddress = (address: string) =>
  new RegExp(`/^0x[a-fA-F0-9]{40}$/`).test(address);

// Referenced from https://eips.ethereum.org/EIPS/eip-55
export const toChecksumAddress = (address: string) => {
  address = address.toLowerCase().replace("0x", "");
  var hash = createKeccakHash("keccak256").update(address).digest("hex");
  var ret = "0x";

  for (var i = 0; i < address.length; i++) {
    if (parseInt(hash[i], 16) >= 8) {
      ret += address[i].toUpperCase();
    } else {
      ret += address[i];
    }
  }

  return ret;
};

export function isValidEIP155ChecksumAddress(address: string): boolean {
  if (!isValidAddress(address)) {
    return false;
  }

  return address === toChecksumAddress(address);
}
