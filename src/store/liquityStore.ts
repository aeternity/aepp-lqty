import { useAeppSdk } from "@/composables";
import { useLiquity } from "@/composables/liquity";
import {
  Decimal,
  Fees,
  FrontendStatus,
  LQTYStake,
  StabilityDeposit,
  Trove,
  TroveWithPendingRedistribution,
  UserTrove,
} from "@liquity/lib-base";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useLiquityStore = defineStore("liquityStore", () => {
  const { contracts, onAccount } = useAeppSdk();
  const liquityHelpers = useLiquity();
  /** Status of currently used frontend. */
  const frontend = ref<FrontendStatus>();

  /** Status of user's own frontend. */
  const ownFrontend = ref<FrontendStatus>();

  /** Number of Troves that are currently open. */
  const numberOfTroves = ref<number>();

  /** User's native currency balance (e.g. Ether). */
  const accountBalance = ref<Decimal>(Decimal.ZERO);

  /** User's LUSD token balance. */
  const lusdBalance = ref<Decimal>(Decimal.ZERO);

  /** User's LQTY token balance. */
  const lqtyBalance = ref<Decimal>(Decimal.ZERO);

  /** User's Uniswap ETH/LUSD LP token balance. */
  const uniTokenBalance = ref<Decimal>(Decimal.ZERO);

  /** The liquidity mining contract's allowance of user's Uniswap ETH/LUSD LP tokens. */
  const uniTokenAllowance = ref<Decimal>(Decimal.ZERO);

  /** Remaining LQTY that will be collectively rewarded to liquidity miners. */
  const remainingLiquidityMiningLQTYReward = ref<Decimal>(Decimal.ZERO);

  /** Amount of Uniswap ETH/LUSD LP tokens the user has staked in liquidity mining. */
  const liquidityMiningStake = ref<Decimal>(Decimal.ZERO);

  /** Total amount of Uniswap ETH/LUSD LP tokens currently staked in liquidity mining. */
  const totalStakedUniTokens = ref<Decimal>(Decimal.ZERO);

  /** Amount of LQTY the user has earned through mining liquidity. */
  const liquidityMiningLQTYReward = ref<Decimal>(Decimal.ZERO);

  /**
   * Amount of leftover collateral available for withdrawal to the user.
   *
   * @remarks
   * See {@link ReadableLiquity.getCollateralSurplusBalance | getCollateralSurplusBalance()} for
   * more information.
   */
  const collateralSurplusBalance = ref<Decimal>(Decimal.ZERO);

  /** Current price of the native currency (e.g. Ether) in USD. */
  const price = ref<Decimal>(Decimal.ZERO);

  /** Total amount of LUSD currently deposited in the Stability Pool. */
  const lusdInStabilityPool = ref<Decimal>(Decimal.ZERO);

  /** Total collateral and debt in the Liquity system. */
  const total = ref<Trove>(new Trove());

  /**
   * Total collateral and debt per stake that has been liquidated through redistribution.
   *
   * @remarks
   * Needed when dealing with instances of {@link TroveWithPendingRedistribution}.
   */
  const totalRedistributed = ref<Trove>(new Trove());

  /**
   * User's Trove in its state after the last direct modification.
   *
   * @remarks
   * The current state of the user's Trove can be found as
   * {@link LiquityStoreDerivedState.trove | trove}.
   */
  const troveBeforeRedistribution = ref<TroveWithPendingRedistribution>();

  /** User's stability deposit. */
  const stabilityDeposit = ref<StabilityDeposit>();

  /** Remaining LQTY that will be collectively rewarded to stability depositors. */
  const remainingStabilityPoolLQTYReward = ref<Decimal>(Decimal.ZERO);

  /** @internal */
  const _feesInNormalMode = ref<Fees>();

  /** User's LQTY stake. */
  const lqtyStake = ref<LQTYStake>();

  /** Total amount of LQTY currently staked. */
  const totalStakedLQTY = ref<Decimal>(Decimal.ZERO);

  /** @internal */
  const _riskiestTroveBeforeRedistribution =
    ref<TroveWithPendingRedistribution>();

  /** Current state of user's Trove */
  const trove = ref<UserTrove>();

  /** Calculator for current fees. */
  const fees = ref<Fees>();

  /**
   * Current borrowing rate.
   *
   * @remarks
   * A value between 0 and 1.
   *
   * @example
   * For example a value of 0.01 amounts to a borrowing fee of 1% of the borrowed amount.
   */
  const borrowingRate = ref<Decimal>(Decimal.ZERO);

  /**
   * Current redemption rate.
   *
   * @remarks
   * Note that the actual rate paid by a redemption transaction will depend on the amount of LUSD
   * being redeemed.
   *
   * Use {@link Fees.redemptionRate} to calculate a precise redemption rate.
   */
  const redemptionRate = ref<Decimal>(Decimal.ZERO);

  /**
   * Whether there are any Troves with collateral ratio below the
   * {@link MINIMUM_COLLATERAL_RATIO | minimum}.
   */
  const haveUndercollateralizedTroves = ref<boolean>();

  async function preloadInitialData() {
    const [
      _numberOfTroves,
      _price,
      _lusdInStabilityPool,
      _total,
      _totalStakedLQTY,
    ] = await Promise.all([
      liquityHelpers.getNumberOfTroves(),
      liquityHelpers.getPrice(),
      liquityHelpers.getLUSDInStabilityPool(),
      liquityHelpers.getTotal(),
      liquityHelpers.getTotalStakedLQTY(),
    ]);

    numberOfTroves.value = _numberOfTroves;
    price.value = _price;
    lusdInStabilityPool.value = _lusdInStabilityPool;
    total.value = _total;
    totalStakedLQTY.value = _totalStakedLQTY;

    console.info("========================");
    console.info("loaded ::", {
      _numberOfTroves,
      _price,
      _lusdInStabilityPool,
      _total,
      _totalStakedLQTY,
    });
    console.info("========================");
  }

  return {
    preloadInitialData,

    frontend,
    ownFrontend,
    numberOfTroves,
    accountBalance,
    lusdBalance,
    lqtyBalance,
    uniTokenBalance,
    uniTokenAllowance,
    remainingLiquidityMiningLQTYReward,
    liquidityMiningStake,
    totalStakedUniTokens,
    liquidityMiningLQTYReward,
    collateralSurplusBalance,
    price,
    lusdInStabilityPool,
    total,
    totalRedistributed,
    troveBeforeRedistribution,
    stabilityDeposit,
    remainingStabilityPoolLQTYReward,
    _feesInNormalMode,
    lqtyStake,
    totalStakedLQTY,
    _riskiestTroveBeforeRedistribution,

    trove,
    fees,
    borrowingRate,
    redemptionRate,
    haveUndercollateralizedTroves,
  };
});
