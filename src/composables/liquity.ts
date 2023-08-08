import { useAeppSdk } from "@/composables";
import { decimalify, numberify, panic } from "@/utils";
import {
  Decimal,
  Fees,
  LQTYStake,
  StabilityDeposit,
  Trove,
  TroveListingParams,
  TroveWithPendingRedistribution,
  UserTrove,
  UserTroveStatus,
} from "@liquity/lib-base";

enum BackendTroveStatus {
  nonExistent,
  active,
  closedByOwner,
  closedByLiquidation,
  closedByRedemption,
}
const userTroveStatusFrom = (
  backendStatus: BackendTroveStatus
): UserTroveStatus =>
  backendStatus === BackendTroveStatus.nonExistent
    ? "nonExistent"
    : backendStatus === BackendTroveStatus.active
    ? "open"
    : backendStatus === BackendTroveStatus.closedByOwner
    ? "closedByOwner"
    : backendStatus === BackendTroveStatus.closedByLiquidation
    ? "closedByLiquidation"
    : backendStatus === BackendTroveStatus.closedByRedemption
    ? "closedByRedemption"
    : panic(new Error(`invalid backendStatus ${backendStatus}`));

export function useLiquity() {
  const { contracts } = useAeppSdk();

  /**
   * Get the total amount of collateral and debt that has been redistributed.
   */
  async function getTotalRedistributed(overrides = {}): Promise<Trove> {
    const [collateral, debt] = await Promise.all([
      contracts.TroveManager.methods.l_ae({ ...overrides }).then(decimalify),
      contracts.TroveManager.methods
        .l_aeusd_debt({ ...overrides })
        .then(decimalify),
    ]);

    return new Trove(collateral, debt);
  }

  async function getTroveBeforeRedistribution(
    address: string,
    overrides = {}
  ): Promise<TroveWithPendingRedistribution> {
    const [trove, snapshot] = await Promise.all([
      contracts.TroveManager.methods
        .troves(address, { ...overrides })
        .then((result: any) => result.decodedResult),
      contracts.TroveManager.methods
        .reward_snapshots(address, {
          ...overrides,
        })
        .then((result: any) => result.decodedResult),
    ]);

    if (trove.status === BackendTroveStatus.active) {
      return new TroveWithPendingRedistribution(
        address,
        userTroveStatusFrom(trove.status),
        decimalify(trove.coll),
        decimalify(trove.debt),
        decimalify(trove.stake),
        new Trove(decimalify(snapshot.ETH), decimalify(snapshot.LUSDDebt))
      );
    } else {
      return new TroveWithPendingRedistribution(
        address,
        userTroveStatusFrom(trove.status)
      );
    }
  }

  async function getTrove(address: string, overrides = {}): Promise<UserTrove> {
    const [trove, totalRedistributed] = await Promise.all([
      getTroveBeforeRedistribution(address, overrides),
      getTotalRedistributed(overrides),
    ]);

    return trove.applyRedistribution(totalRedistributed);
  }

  async function getNumberOfTroves(overrides = {}): Promise<number> {
    return contracts.TroveManager.methods
      .get_trove_owners_count({
        ...overrides,
      })
      .then((result: any) => {
        console.info("========================");
        console.info("getNumberOfTroves ::", result);
        console.info("getNumberOfTroves ::", parseInt(result.decodedResult));
        console.info("========================");

        return Decimal.from(parseInt(result.decodedResult));
      });
  }

  async function getPrice(overrides = {}): Promise<Decimal> {
    return contracts.PriceFeedTestnet.methods
      .fetch_price({ ...overrides })
      .then(decimalify);
  }

  /** @internal */
  async function _getActivePool(overrides = {}): Promise<Trove> {
    const [activeCollateral, activeDebt] = await Promise.all(
      [
        contracts.ActivePool.methods.get_ae({ ...overrides }),
        contracts.ActivePool.methods.get_aeusd_debt({ ...overrides }),
      ].map((getBigNumber) => getBigNumber.then(decimalify))
    );

    return new Trove(activeCollateral, activeDebt);
  }

  /** @internal */
  async function _getDefaultPool(overrides = {}): Promise<Trove> {
    const [liquidatedCollateral, closedDebt] = await Promise.all(
      [
        contracts.DefaultPool.methods.get_ae({ ...overrides }),
        contracts.DefaultPool.methods.get_aeusd_debt({ ...overrides }),
      ].map((getBigNumber) => getBigNumber.then(decimalify))
    );

    return new Trove(liquidatedCollateral, closedDebt);
  }

  /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getTotal} */
  async function getTotal(overrides = {}): Promise<Trove> {
    const [activePool, defaultPool] = await Promise.all([
      _getActivePool(overrides),
      _getDefaultPool(overrides),
    ]);

    return activePool.add(defaultPool);
  }

  /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getStabilityDeposit} */
  async function getStabilityDeposit(
    address?: string,
    overrides = {}
  ): Promise<StabilityDeposit> {
    //
    const [
      { frontEndTag, initialValue },
      currentLUSD,
      collateralGain,
      lqtyReward,
    ] = await Promise.all(
      [
        contracts.StabilityPool.methods.deposits(address, { ...overrides }),
        contracts.StabilityPool.methods.get_total_aeusd_deposits(address, {
          ...overrides,
        }),
        contracts.StabilityPool.methods.get_depositor_ae_gain(address, {
          ...overrides,
        }),
        contracts.StabilityPool.methods.get_front_end_lqty_gain(address, {
          ...overrides,
        }),
      ].map((result: any) => result.decodedResult)
    );

    return new StabilityDeposit(
      decimalify(initialValue),
      decimalify(currentLUSD),
      decimalify(collateralGain),
      decimalify(lqtyReward),
      frontEndTag
    );
  }

  /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getRemainingStabilityPoolLQTYReward} */
  async function getRemainingStabilityPoolLQTYReward(
    overrides = {}
  ): Promise<Decimal> {
    const issuanceCap = Decimal.from(1000000);
    // const issuanceCap = this.connection.totalStabilityPoolLQTYReward;
    // const totalLQTYIssued = decimalify(
    //   await communityIssuance.totalLQTYIssued({ ...overrides })
    // );
    const totalLQTYIssued = await contracts.CommunityIssuance.methods
      .issue_lqty({ ...overrides })
      .then(decimalify);

    // totalLQTYIssued approaches but never reaches issuanceCap
    return issuanceCap.sub(totalLQTYIssued);
  }

  /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getLUSDInStabilityPool} */
  function getLUSDInStabilityPool(overrides = {}): Promise<Decimal> {
    return contracts.StabilityPool.methods
      .get_total_aeusd_deposits({ ...overrides })
      .then(decimalify);
  }

  /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getLUSDBalance} */
  function getLUSDBalance(address?: string, overrides = {}): Promise<Decimal> {
    return contracts.AEUSDToken.methods
      .balance(address, { ...overrides })
      .then(decimalify);
    // return contracts.AEUSDToken.methods.balanceOf(address, { ...overrides }).then(decimalify);
  }

  /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getLQTYBalance} */
  function getLQTYBalance(address?: string, overrides = {}): Promise<Decimal> {
    const { lqtyToken } = _getContracts(this.connection);

    return lqtyToken.balanceOf(address, { ...overrides }).then(decimalify);
  }

  /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getUniTokenBalance} */
  function getUniTokenBalance(
    address?: string,
    overrides = {}
  ): Promise<Decimal> {
    const { uniToken } = _getContracts(this.connection);

    return uniToken.balanceOf(address, { ...overrides }).then(decimalify);
  }

  /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getUniTokenAllowance} */
  function getUniTokenAllowance(
    address?: string,
    overrides = {}
  ): Promise<Decimal> {
    const { uniToken, unipool } = _getContracts(this.connection);

    return uniToken
      .allowance(address, unipool.address, { ...overrides })
      .then(decimalify);
  }

  /** @internal */
  async function _getRemainingLiquidityMiningLQTYRewardCalculator(
    overrides = {}
  ): Promise<(blockTimestamp: number) => Decimal> {
    const { unipool } = _getContracts(this.connection);

    const [totalSupply, rewardRate, periodFinish, lastUpdateTime] =
      await Promise.all([
        unipool.totalSupply({ ...overrides }),
        unipool.rewardRate({ ...overrides }).then(decimalify),
        unipool.periodFinish({ ...overrides }).then(numberify),
        unipool.lastUpdateTime({ ...overrides }).then(numberify),
      ]);

    return (blockTimestamp: number) =>
      rewardRate.mul(
        Math.max(
          0,
          periodFinish -
            (totalSupply.isZero() ? lastUpdateTime : blockTimestamp)
        )
      );
  }

  /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getRemainingLiquidityMiningLQTYReward} */
  async function getRemainingLiquidityMiningLQTYReward(
    overrides = {}
  ): Promise<Decimal> {
    const [calculateRemainingLQTY, blockTimestamp] = await Promise.all([
      this._getRemainingLiquidityMiningLQTYRewardCalculator(overrides),
      this._getBlockTimestamp(overrides?.blockTag),
    ]);

    return calculateRemainingLQTY(blockTimestamp);
  }

  /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getLiquidityMiningStake} */
  function getLiquidityMiningStake(
    address?: string,
    overrides = {}
  ): Promise<Decimal> {
    const { unipool } = _getContracts(this.connection);

    return unipool.balanceOf(address, { ...overrides }).then(decimalify);
  }

  /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getTotalStakedUniTokens} */
  function getTotalStakedUniTokens(overrides = {}): Promise<Decimal> {
    const { unipool } = _getContracts(this.connection);

    return unipool.totalSupply({ ...overrides }).then(decimalify);
  }

  /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getLiquidityMiningLQTYReward} */
  function getLiquidityMiningLQTYReward(
    address?: string,
    overrides = {}
  ): Promise<Decimal> {
    const { unipool } = _getContracts(this.connection);

    return unipool.earned(address, { ...overrides }).then(decimalify);
  }

  /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getCollateralSurplusBalance} */
  function getCollateralSurplusBalance(
    address?: string,
    overrides = {}
  ): Promise<Decimal> {
    const { collSurplusPool } = _getContracts(this.connection);

    return collSurplusPool
      .getCollateral(address, { ...overrides })
      .then(decimalify);
  }

  /** {@inheritDoc @liquity/lib-base#ReadableLiquity.(getTroves:2)} */
  async function getTroves(
    params: TroveListingParams,
    overrides = {}
  ): Promise<UserTrove[]> {
    const { multiTroveGetter } = _getContracts(this.connection);

    expectPositiveInt(params, "first");
    expectPositiveInt(params, "startingAt");

    if (!validSortingOptions.includes(params.sortedBy)) {
      throw new Error(
        `sortedBy must be one of: ${validSortingOptions
          .map((x) => `"${x}"`)
          .join(", ")}`
      );
    }

    const [totalRedistributed, backendTroves] = await Promise.all([
      params.beforeRedistribution
        ? undefined
        : this.getTotalRedistributed({ ...overrides }),
      multiTroveGetter.getMultipleSortedTroves(
        params.sortedBy === "descendingCollateralRatio"
          ? params.startingAt ?? 0
          : -((params.startingAt ?? 0) + 1),
        params.first,
        { ...overrides }
      ),
    ]);

    const troves = mapBackendTroves(backendTroves);

    if (totalRedistributed) {
      return troves.map((trove) =>
        trove.applyRedistribution(totalRedistributed)
      );
    } else {
      return troves;
    }
  }

  /** @internal */
  function _getBlockTimestamp(blockTag?: BlockTag): Promise<number> {
    return _getBlockTimestamp(this.connection, blockTag);
  }

  /** @internal */
  async function _getFeesFactory(
    overrides = {}
  ): Promise<(blockTimestamp: number, recoveryMode: boolean) => Fees> {
    const { troveManager } = _getContracts(this.connection);

    const [lastFeeOperationTime, baseRateWithoutDecay] = await Promise.all([
      troveManager.lastFeeOperationTime({ ...overrides }),
      troveManager.baseRate({ ...overrides }).then(decimalify),
    ]);

    return (blockTimestamp, recoveryMode) =>
      new Fees(
        baseRateWithoutDecay,
        MINUTE_DECAY_FACTOR,
        BETA,
        convertToDate(lastFeeOperationTime.toNumber()),
        convertToDate(blockTimestamp),
        recoveryMode
      );
  }

  /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getFees} */
  async function getFees(overrides = {}): Promise<Fees> {
    const [createFees, total, price, blockTimestamp] = await Promise.all([
      _getFeesFactory(overrides),
      getTotal(overrides),
      getPrice(overrides),
      _getBlockTimestamp(overrides?.blockTag),
    ]);

    return createFees(
      blockTimestamp,
      total.collateralRatioIsBelowCritical(price)
    );
  }

  /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getLQTYStake} */
  async function getLQTYStake(
    address?: string,
    overrides = {}
  ): Promise<LQTYStake> {
    const [stakedLQTY, collateralGain, lusdGain] = await Promise.all(
      [
        contracts.LQTYStaking.methods.stake(address, { ...overrides }),
        // contracts.LQTYStaking.methods.stakes(address, { ...overrides }),
        contracts.LQTYStaking.methods.get_pending_ae_gain(address, {
          ...overrides,
        }),
        contracts.LQTYStaking.methods.get_pending_aeusd_gain(address, {
          ...overrides,
        }),
      ].map((getBigNumber) => getBigNumber.then(decimalify))
    );

    return new LQTYStake(stakedLQTY, collateralGain, lusdGain);
  }

  /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getTotalStakedLQTY} */
  async function getTotalStakedLQTY(overrides = {}): Promise<Decimal> {
    // TODO: contract method missing
    return contracts.LQTYToken.methods
      .total_supply({ ...overrides })
      .then(decimalify);
    // return contracts.LQTYStaking.methods.totalLQTYStaked({ ...overrides }).then(decimalify);
  }

  /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getFrontendStatus} */
  async function getFrontendStatus(
    address?: string,
    overrides = {}
  ): Promise<FrontendStatus> {
    address ??= _requireFrontendAddress(this.connection);
    const { stabilityPool } = _getContracts(this.connection);

    const { registered, kickbackRate } = await stabilityPool.frontEnds(
      address,
      { ...overrides }
    );

    return registered
      ? { status: "registered", kickbackRate: decimalify(kickbackRate) }
      : { status: "unregistered" };
  }

  return {
    getTotalRedistributed,
    getTroveBeforeRedistribution,
    getTrove,
    getNumberOfTroves,
    getPrice,
    getTotal,
    getStabilityDeposit,
    getRemainingStabilityPoolLQTYReward,
    getLUSDInStabilityPool,
    getLUSDBalance,
    getLQTYBalance,
    getUniTokenBalance,
    getUniTokenAllowance,
    getRemainingLiquidityMiningLQTYReward,
    getLiquidityMiningStake,
    getTotalStakedUniTokens,
    getLiquidityMiningLQTYReward,
    getCollateralSurplusBalance,
    getTroves,
    getFees,
    getLQTYStake,
    getTotalStakedLQTY,
    getFrontendStatus,
  };
}
