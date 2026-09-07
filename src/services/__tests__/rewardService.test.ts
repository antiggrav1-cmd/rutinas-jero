import { describe, it, expect } from 'vitest';
import { processRewardRedemption, refundRejectedRedemption } from '../rewardService';
import type { Reward, RewardRedemptionRequest } from '../../types';

describe('rewardService', () => {
  const sampleReward: Reward = {
    id: 'r-1',
    title: '30 min videojuegos',
    costPoints: 50,
    icon: 'gamepad',
    redeemedCount: 0
  };

  it('should deny redemption if balance is lower than cost', () => {
    const result = processRewardRedemption(sampleReward, 30);
    expect(result.success).toBe(false);
    expect(result.newBalance).toBe(30);
    expect(result.error).toBe('Puntos insuficientes');
  });

  it('should deduct points and create pending request if balance is sufficient', () => {
    const result = processRewardRedemption(sampleReward, 80);
    expect(result.success).toBe(true);
    expect(result.newBalance).toBe(30);
    expect(result.newRequest).toBeDefined();
    expect(result.newRequest?.status).toBe('pending');
    expect(result.newRequest?.costPoints).toBe(50);
  });

  it('should refund points correctly on rejected redemption', () => {
    const sampleRequest: RewardRedemptionRequest = {
      id: 'req-1',
      rewardId: 'r-1',
      rewardTitle: '30 min videojuegos',
      costPoints: 50,
      icon: 'gamepad',
      requestedAt: '2026-09-06T00:00:00.000Z',
      status: 'pending'
    };

    const newBalance = refundRejectedRedemption(sampleRequest, 30);
    expect(newBalance).toBe(80);
  });
});
