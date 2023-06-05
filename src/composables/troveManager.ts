import { ref } from "vue";
import { useLqty } from "./lqty";
import { useAeppSdk } from "./aeppSdk";

const loadingBorrowingRate = ref(false);
const borrowingRate = ref(0);

const activeTrove = ref();
export function useTroveManager() {
  const { contracts } = useLqty();
  const { activeAccount } = useAeppSdk();

  async function getCompositeDebt(dept: any) {
    return (await contracts.TroveManager.methods.get_composite_debt(dept))
      .decodedResult;
  }

  async function loadBorrowingRate() {
    loadingBorrowingRate.value = true;

    borrowingRate.value = (
      await contracts.TroveManager.methods.get_borrowing_rate_with_decay()
    ).decodedResult;

    loadingBorrowingRate.value = false;
  }

  async function getActualDebtFromComposite(dept: any) {
    return (
      await contracts.TroveManager.methods.get_actual_debt_from_composite(dept)
    ).decodedResult;
  }

  async function loadActiveTrove() {
    console.info("========================");
    console.info("loadActiveTrove ::", activeAccount.value);
    console.info("========================");
    const { decodedResult } = await contracts.TroveManager.methods.troves(
      activeAccount.value
    );

    console.info("========================");
    console.info("troves.value ::", decodedResult);
    console.info("========================");
    activeTrove.value = decodedResult;
  }

  return {
    getCompositeDebt,
    loadBorrowingRate,
    getActualDebtFromComposite,

    loadActiveTrove,
    activeTrove,

    loadingBorrowingRate,
    borrowingRate,
  };
}
