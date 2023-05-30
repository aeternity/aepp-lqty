import { ref } from "vue";
import { useLqty } from "./lqty";

const loadingMinNetDebt = ref(false);
const minNetDebt = ref(0);

const stableCoinGasCompensation = ref(0);
const borrowingFeeFloor = ref(0);

export function useBorrowerOperations() {
  const { contracts } = useLqty();

  async function loadMinNetDebt() {
    loadingMinNetDebt.value = true;
    minNetDebt.value = (
      await contracts.BorrowerOperations.methods.min_net_debt()
    ).decodedResult;

    loadingMinNetDebt.value = false;
  }

  async function loadStableCoinGasCompensation() {
    stableCoinGasCompensation.value = (
      await contracts.BorrowerOperations.methods.aeusd_gas_compensation()
    ).decodedResult;
  }

  async function loadBorrowingFeeFloor() {
    borrowingFeeFloor.value = (
      await contracts.BorrowerOperations.methods.borrowing_fee_floor()
    ).decodedResult;
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
    loadingMinNetDebt,

    borrowingFeeFloor,
    stableCoinGasCompensation,

    loadBorrowerOperationsInitialData,
  };
}
