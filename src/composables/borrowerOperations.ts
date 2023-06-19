import { ref } from "vue";
import { useAeppSdk } from "./aeppSdk";
import { Decimal } from "@liquity/lib-base";

const minNetDebt = ref<Decimal>(Decimal.ZERO);

const stableCoinGasCompensation = ref<Decimal>(Decimal.ZERO);
const borrowingFeeFloor = ref<Decimal>(Decimal.ZERO);

export function useBorrowerOperations() {
  const { contracts } = useAeppSdk();

  async function loadMinNetDebt() {
    minNetDebt.value = Decimal.fromBigNumberString(
      (
        await contracts.BorrowerOperations.methods.min_net_debt()
      ).decodedResult.toString()
    );
  }

  async function loadStableCoinGasCompensation() {
    stableCoinGasCompensation.value = Decimal.fromBigNumberString(
      (
        await contracts.BorrowerOperations.methods.aeusd_gas_compensation()
      ).decodedResult.toString()
    );
  }

  async function loadBorrowingFeeFloor() {
    borrowingFeeFloor.value = Decimal.fromBigNumberString(
      (
        await contracts.BorrowerOperations.methods.borrowing_fee_floor()
      ).decodedResult.toString()
    );
  }

  async function loadBorrowerOperationsInitialData() {
    await Promise.all([
      loadMinNetDebt(),
      loadStableCoinGasCompensation(),
      loadBorrowingFeeFloor(),
    ]);
  }

  return {
    loadMinNetDebt,
    minNetDebt,

    borrowingFeeFloor,
    stableCoinGasCompensation,

    loadBorrowerOperationsInitialData,
  };
}
