import { useAccounts } from "@/store/accounts";
import { ref } from "vue";
import { useAeppSdk } from "./aeppSdk";
import { Decimal } from "@liquity/lib-base";

const loadingBorrowingRate = ref(false);
const borrowingRate = ref(0);

const activeTrove = ref();
export function useTroveManager() {
  const accounts = useAccounts();
  const { contracts } = useAeppSdk();

  async function getCompositeDebt(dept: Decimal | any): Promise<Decimal> {
    return Decimal.fromBigNumberString(
      (
        await contracts.TroveManager.methods.get_composite_debt(dept)
      ).decodedResult.toString()
    );
  }

  async function getActualDebtFromComposite(dept: Decimal): Promise<Decimal> {
    return Decimal.fromBigNumberString(
      (
        await contracts.TroveManager.methods.get_actual_debt_from_composite(
          dept
        )
      ).decodedResult
    );
  }

  async function getBorrowingFee(borrowAmount: Decimal): Promise<Decimal> {
    return Decimal.from(
      (
        await contracts.TroveManager.methods.get_borrowing_fee(borrowAmount)
      ).decodedResult.toString()
    );
  }

  async function loadBorrowingRate() {
    loadingBorrowingRate.value = true;

    borrowingRate.value = (
      await contracts.TroveManager.methods.get_borrowing_rate_with_decay()
    ).decodedResult;

    loadingBorrowingRate.value = false;
  }

  async function loadActiveTrove() {
    try {
      const { decodedResult } = await contracts.TroveManager.methods.troves(
        accounts.activeAccount
      );

      activeTrove.value = decodedResult;
    } catch (error: any) {
      if (error.message.includes('tx_nonce_too_high_for_account')) {
        setTimeout(() => {
          loadActiveTrove();
        }, 1000)
      }
    }
  }

  return {
    loadBorrowingRate,

    getActualDebtFromComposite,
    getBorrowingFee,
    getCompositeDebt,

    loadActiveTrove,
    activeTrove,

    loadingBorrowingRate,
    borrowingRate,
  };
}
