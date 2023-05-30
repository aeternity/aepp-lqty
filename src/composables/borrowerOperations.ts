import { ref } from "vue";
import useAeSdk from "./aeSdk";
import { useLqty } from "./lqty";

const loadingMinNetDebt = ref(false);
const minNetDebt = ref(0);

export function useBorrowerOperations() {
  const { contracts } = useLqty();
  const { contractByteArrayEncoder } = useAeSdk();

  async function loadMinNetDebt() {
    loadingMinNetDebt.value = true;
    const get_min_net_debt =
      await contracts.BorrowerOperations.methods.min_net_debt();
    minNetDebt.value = contractByteArrayEncoder.decode(
      get_min_net_debt.result.returnValue
    );
    console.log("minNetDebt ::", minNetDebt.value);

    loadingMinNetDebt.value = false;
  }

  return {
    loadMinNetDebt,
    minNetDebt,
    loadingMinNetDebt,
  };
}
