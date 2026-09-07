import type { Reward, RewardRedemptionRequest } from '../types';

export interface RedemptionResult {
  success: boolean;
  newBalance: number;
  newRequest?: RewardRedemptionRequest;
  error?: string;
}

/**
 * Handles requesting a reward redemption:
 * - Checks if points balance is sufficient.
 * - Deducts cost from points balance.
 * - Creates a pending redemption request for Mom's approval.
 */
export function processRewardRedemption(
  reward: Reward,
  currentBalance: number
): RedemptionResult {
  if (currentBalance < reward.costPoints) {
    return {
      success: false,
      newBalance: currentBalance,
      error: 'Puntos insuficientes'
    };
  }

  const newRequest: RewardRedemptionRequest = {
    id: `req-${Date.now()}`,
    rewardId: reward.id,
    rewardTitle: reward.title,
    costPoints: reward.costPoints,
    icon: reward.icon,
    requestedAt: new Date().toISOString(),
    status: 'pending'
  };

  return {
    success: true,
    newBalance: currentBalance - reward.costPoints,
    newRequest
  };
}

/**
 * Handles rejecting a reward redemption:
 * - Refunds points to the balance.
 * - Removes or updates the request status.
 */
export function refundRejectedRedemption(
  request: RewardRedemptionRequest,
  currentBalance: number
): number {
  return currentBalance + request.costPoints;
}
