import { ref } from "vue";
import useAeSdk from "./aeSdk";
import { useLqty } from "./lqty";

const loadingBorrowingRate = ref(false);
const borrowingRate = ref(0);

export function useTroveManager() {
  const { contracts } = useLqty();
  const { contractByteArrayEncoder } = useAeSdk();

  async function getCompositeDebt(dept: any) {
    const get_composite_debt =
      await contracts.TroveManager.methods.get_composite_debt(dept);
    return contractByteArrayEncoder.decode(
      get_composite_debt.result.returnValue
    );
  }

  async function loadBorrowingRate() {
    loadingBorrowingRate.value = true;
    const get_borrowing_fee =
      await contracts.TroveManager.methods.get_borrowing_rate_with_decay();
    borrowingRate.value = contractByteArrayEncoder.decode(
      get_borrowing_fee.result.returnValue
    );
    console.log("borrowingRate ::", borrowingRate.value);

    loadingBorrowingRate.value = false;
  }

  async function getActualDebtFromComposite(dept: any) {
    const get_actual_debt_from_composite =
      await contracts.TroveManager.methods.get_actual_debt_from_composite(dept);
    return contractByteArrayEncoder.decode(
      get_actual_debt_from_composite.result.returnValue
    );
  }

  return {
    getCompositeDebt,
    loadBorrowingRate,
    getActualDebtFromComposite,

    loadingBorrowingRate,
    borrowingRate,
  };
}
