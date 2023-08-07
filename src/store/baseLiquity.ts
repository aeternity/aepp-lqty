// Utilities
import { useAeppSdk } from "@/composables";
import { Decimal } from "@liquity/lib-base";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useBaseLiquity = defineStore(
  "baseLiquity",
  () => {
    const { contracts, onAccount } = useAeppSdk();

    /**
     * Amount of AEUSD to be locked in gas pool on opening troves
     */
    const _gasCompensation = ref();
    const gasCompensation = computed<Decimal>(() =>
      Decimal.fromBigNumberString(_gasCompensation.value ?? 0)
    );
    async function loadGasCompensation() {
      _gasCompensation.value = (
        await contracts.StabilityPool.methods.aeusd_gas_compensation()
      ).decodedResult;
      return _gasCompensation.value;
    }

    /**
     * Minimum collateral ratio for individual troves
     */
    const _troveMinCollRatio = ref();
    const troveMinCollRatio = computed<Decimal>(() =>
      Decimal.fromBigNumberString(_troveMinCollRatio.value ?? 0)
    );
    async function loadTroveMinCollRatio() {
      _troveMinCollRatio.value = (
        await contracts.StabilityPool.methods.mcr()
      ).decodedResult;
      return _troveMinCollRatio.value;
    }

    /**
     * Critical system collateral ratio.
     * If the system's total collateral ratio (TCR) falls below the CCR,
     * Recovery Mode is triggered.
     */
    const _collateralRatioLimit = ref();
    const collateralRatioLimit = computed<Decimal>(() =>
      Decimal.fromBigNumberString(_collateralRatioLimit.value ?? 0)
    );
    async function loadCollateralRatioLimit() {
      _collateralRatioLimit.value = (
        await contracts.StabilityPool.methods.ccr()
      ).decodedResult;
      return _collateralRatioLimit.value;
    }

    /**
     * Minimum amount of net AEUSD debt a trove must have
     */
    const _troveMinNetDebt = ref();
    const troveMinNetDebt = computed<Decimal>(() =>
      Decimal.fromBigNumberString(_troveMinNetDebt.value ?? 0)
    );
    async function loadTroveMinNetDebt() {
      _troveMinNetDebt.value = (
        await contracts.StabilityPool.methods.min_net_debt()
      ).decodedResult;
      return _troveMinNetDebt.value;
    }

    /**
     * Minimum borrowing fee floor.
     */
    const _borrowingFeeFloor = ref();
    const borrowingFeeFloor = computed<Decimal>(() =>
      Decimal.fromBigNumberString(_borrowingFeeFloor.value ?? 0)
    );
    async function loadBorrowingFeeFloor() {
      _borrowingFeeFloor.value = (
        await contracts.StabilityPool.methods.borrowing_fee_floor()
      ).decodedResult;
      return _borrowingFeeFloor.value;
    }

    async function loadBaseLiquityInitialData() {
      await Promise.all([
        loadGasCompensation(),
        loadTroveMinCollRatio(),
        loadCollateralRatioLimit(),
        loadTroveMinNetDebt(),
        loadBorrowingFeeFloor(),
      ]);
      console.info("========================");
      console.info("== loadBaseLiquityInitialData ==");
      console.info('gasCompensation ::', gasCompensation.value.prettify(2));
      console.info('troveMinCollRatio ::', troveMinCollRatio.value.prettify(2));
      console.info('collateralRatioLimit ::', collateralRatioLimit.value.prettify(2));
      console.info('troveMinNetDebt ::', troveMinNetDebt.value.prettify(2));
      console.info('borrowingFeeFloor ::', borrowingFeeFloor.value.prettify(2));
      console.info("========================");

    }

    return {
      loadBaseLiquityInitialData,

      gasCompensation,
      troveMinCollRatio,
      collateralRatioLimit,
      troveMinNetDebt,
      borrowingFeeFloor
    };
  },
  { persist: true }
);
