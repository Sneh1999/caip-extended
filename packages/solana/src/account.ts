import {
  AccountIdParams,
  getParams,
  AccountIdSplitParams,
  AccountId,
} from "caip-common";
import { isValidSolanaAccountId, isValidSolanaAddress } from "./utils";
import { SolanaChainId } from "./chain";

export class SolanaAccountId extends AccountId {
  constructor(params: AccountIdParams | string) {
    super(params);

    if (typeof params === "string") {
      params = SolanaAccountId.parse(params);
    }

    this.chainId = new SolanaChainId(params.chainId);

    if (!isValidSolanaAddress(params.address)) {
      throw new Error(`Invalid ${AccountId.spec.name} provided: ${params}`);
    }

    super.address = params.address;
  }

  public static parse(id: string): AccountIdParams {
    if (isValidSolanaAccountId(id, this.spec)) {
      throw new Error(`Invalid ${this.spec.name} provided: ${id}`);
    }

    const { namespace, reference, address } = getParams<AccountIdSplitParams>(
      id,
      this.spec
    );
    const chainId = new SolanaChainId({ namespace, reference });

    return new SolanaAccountId({ chainId, address }).toJSON();
  }
}
