import { useAeppSdk } from "@/composables";
import { Decimal } from "@liquity/lib-base";
import { defineStore } from "pinia";

export const useStabilityPool = defineStore(
  "stabilityPool",
  () => {
    const { contracts, onAccount } = useAeppSdk();
    //------------------------------------------------------------------------------
    // REWARD CALCULATOR FUNCTIONS FOR DEPOSITOR AND FRONT END
    //------------------------------------------------------------------------------

    /**
     * Calculates the AE gain earned by the deposit since its last snapshots were taken.
     * Given by the formula:  E = d0 * (S - S(0))/P(0)
     * where S(0) and P(0) are the depositor's snapshots of the sum S and product P, respectively.
     * d0 is the last recorded deposit value.
     */
    async function getDepositorAeGain(depositor: string): Promise<Decimal> {
      const deposit = (
        await contracts.StabilityPool.methods.get_depositor_ae_gain(depositor)
      ).decodedResult;
      return Decimal.fromBigNumberString(deposit);
    }

    /**
     * Return the LQTY gain earned by the front end.
     * Given by the formula:
     *  E = D0 * (G - G(0))/P(0)
     *  where G(0) and P(0) are the depositor's
     *  snapshots of the sum G and product P, respectively.
     *
     * D0 is the last recorded value of the front end's total tagged deposits.
     */
    async function getFrontEndLqtyGain(frontEnd: string): Promise<Decimal> {
      const frontEndLqtyGain = (
        await contracts.StabilityPool.methods.get_front_end_lqty_gain(frontEnd)
      ).decodedResult;
      return Decimal.fromBigNumberString(frontEndLqtyGain);
    }

    /**
     * Calculate the LQTY gain earned by a deposit since its last snapshots were taken.
     * Given by the formula:  LQTY = d0 * (G - G(0))/P(0)
     * where G(0) and P(0) are the depositor's
     * snapshots of the sum G and product P, respectively.
     * d0 is the last recorded deposit value.
     */
    async function getDepositorLqtyGain(depositor: string): Promise<Decimal> {
      const deposit = (
        await contracts.StabilityPool.methods.get_depositor_lqty_gain(depositor)
      ).decodedResult;
      return Decimal.fromBigNumberString(deposit);
    }

    //------------------------------------------------------------------------------
    // EXTERNAL DEPOSITOR FUNCTIONS
    //------------------------------------------------------------------------------

    /**
     * - Triggers a LQTY issuance, based on time passed since the last issuance.
     *   The LQTY issuance is shared between *all* depositors and front ends
     * - Tags the deposit with the provided front end tag param, if it's a new deposit
     * - Sends depositor's accumulated gains (LQTY, AE) to depositor
     * - Sends the tagged front end's accumulated LQTY gains to the tagged front end
     * - Increases deposit and tagged front end's stake, and takes new snapshots for each.
     */
    async function provideToSP(amount: Decimal, frontEnd?: string) {
      const result = await contracts.StabilityPool.methods.provide_to_sp(
        amount.bigNumber,
        frontEnd
      );
      return result;
    }

    /**
     * - Triggers a LQTY issuance, based on time passed since the last issuance. The LQTY issuance is shared between *all* depositors and front ends
     * - Removes the deposit's front end tag if it is a full withdrawal
     * - Sends all depositor's accumulated gains (LQTY, AE) to depositor
     * - Sends the tagged front end's accumulated LQTY gains to the tagged front end
     * - Decreases deposit and tagged front end's stake, and takes new snapshots for each.
     *
     * If _amount > userDeposit, the user withdraws all of their compounded deposit.
     */
    async function withdrawFromSP(amount: Decimal) {
      const result = await contracts.StabilityPool.methods.withdraw_from_sp(
        amount.bigNumber,
        {
          onAccount: onAccount(),
        }
      );
      return result;
    }

    /**
     * - Triggers a LQTY issuance, based on time passed since the last issuance. The LQTY issuance is shared between *all* depositors and front ends
     * - Sends all depositor's LQTY gain to depositor
     * - Sends all tagged front end's LQTY gain to the tagged front end
     * - Transfers the depositor's entire AE gain from the Stability Pool to the caller's trove
     * - Leaves their compounded deposit in the Stability Pool
     * - Updates snapshots for deposit and tagged front end stake
     */
    async function withdrawAeGainToTrove() {
      const result =
        await contracts.StabilityPool.methods.withdraw_ae_gain_to_trove({
          onAccount: onAccount(),
        });
      return result;
    }

    //------------------------------------------------------------------------------
    // LIQUIDATION FUNCTIONS
    //------------------------------------------------------------------------------

    /**
     * Cancels out the specified debt against the AEUSD
     * contained in the Stability Pool (as far as possible)
     * and transfers the Trove's AE collateral from ActivePool to StabilityPool.
     * Only called by liquidation functions in the TroveManager.
     */
    async function offset(debtToOffset: Decimal, collToAdd: Decimal) {
      const result = await contracts.StabilityPool.methods.offset(
        debtToOffset.bigNumber,
        collToAdd.bigNumber,
        {
          onAccount: onAccount(),
        }
      );
      return result;
    }

    async function loadStabilityPoolInitialData() {
      console.info("========================");
      console.info("loadStabilityPoolInitialData ::");
      console.info("========================");
    }

    return {
      loadStabilityPoolInitialData,

      getDepositorAeGain,
      getFrontEndLqtyGain,
      getDepositorLqtyGain,

      provideToSP,
      withdrawFromSP,
      withdrawAeGainToTrove,
      offset,
    };
  },
  { persist: true }
);
