// src/loaders/admin/inventory-main-loader.ts
import { LoaderFunction } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { api } from '../../lib/axios-api';
import type {
  InventoryOverviewResponse,
  InventoryStatsDTO,
} from '../../types/inventory';
import type { InventoryMainLoaderData } from '../../pages/admin/inventory/InventoryMainPage';

const EMPTY_STATS: InventoryStatsDTO = {
  totalProducts: 0,
  outOfStockCount: 0,
  totalStockValuation: 0,
  activeBrandsCount: 0,
};

export const inventoryMainLoader: LoaderFunction =
  async (): Promise<InventoryMainLoaderData> => {
    try {
      const { data } = await api.get<InventoryOverviewResponse>(
        '/admin/inventory/overview'
      );

      return {
        stats: data.stats ?? EMPTY_STATS,
        recentProducts: Array.isArray(data.recentProducts)
          ? data.recentProducts
          : [],
      };
    } catch (error) {
      let errorMessage = 'Failed to load inventory overview.';

      if (isAxiosError<{ message?: string }>(error)) {
        if (!error.response) {
          errorMessage =
            'Cannot reach the server. Check your connection or backend status.';
        } else {
          errorMessage =
            error.response.data?.message ||
            `Server error (${error.response.status}) while loading inventory.`;
        }
      }

      return {
        stats: EMPTY_STATS,
        recentProducts: [],
        error: errorMessage,
      };
    }
  };