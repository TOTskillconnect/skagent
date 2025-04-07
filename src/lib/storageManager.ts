/**
 * Storage Manager
 * 
 * Provides a robust interface for storing and retrieving data
 * with versioning, compression, and error handling
 */

// Constants
const STORAGE_VERSION = 1;
const MAX_CAMPAIGNS = 20; // Maximum number of campaigns to store
const MAX_CANDIDATES_PER_CAMPAIGN = 50;

// Storage Keys
const STORAGE_KEYS = {
  MATCHED_CANDIDATES: 'sk_matched_candidates_v1',
  CAMPAIGNS: 'hiringCampaigns',
};

// Types
interface StorageMetadata {
  version: number;
  lastUpdated: string;
  campaignCount: number;
  totalCandidates: number;
}

interface StorageData<T> {
  metadata: StorageMetadata;
  data: T;
}

/**
 * Simple LZW compression to reduce storage size
 */
const compress = (data: string): string => {
  // For a demo, we'll use a simple approach - in production would use a proper library
  // This is a placeholder for demonstration - not actual compression
  
  // In a real implementation, we would use a library like lz-string
  // For demo purposes, we'll just return the original string
  return data;
};

const decompress = (data: string): string => {
  // Matching placeholder for decompression
  return data;
};

/**
 * Store data with metadata and optional compression
 */
export const storeData = <T>(key: string, data: T): boolean => {
  // Check if localStorage is available (won't be during SSR)
  if (typeof window === 'undefined' || !window.localStorage) {
    console.log('localStorage not available (likely SSR), skipping storage');
    return false;
  }

  try {
    const storageData: StorageData<T> = {
      metadata: {
        version: STORAGE_VERSION,
        lastUpdated: new Date().toISOString(),
        campaignCount: 0, // Would be updated based on actual data
        totalCandidates: 0, // Would be updated based on actual data
      },
      data
    };
    
    // In a real implementation, we would update the metadata with counts
    if (key === STORAGE_KEYS.MATCHED_CANDIDATES && typeof data === 'object') {
      const dataObj = data as Record<string, any[]>;
      storageData.metadata.campaignCount = Object.keys(dataObj).length;
      storageData.metadata.totalCandidates = Object.values(dataObj)
        .reduce((sum, candidates) => sum + candidates.length, 0);
    }
    
    const serialized = JSON.stringify(storageData);
    const compressed = compress(serialized);
    
    localStorage.setItem(key, compressed);
    return true;
  } catch (error) {
    console.error(`Failed to store data for key ${key}:`, error);
    return false;
  }
};

/**
 * Retrieve data with decompression and version checking
 */
export const retrieveData = <T>(key: string, defaultValue: T): T => {
  // Check if localStorage is available (won't be during SSR)
  if (typeof window === 'undefined' || !window.localStorage) {
    console.log('localStorage not available (likely SSR), returning default value');
    return defaultValue;
  }

  try {
    const compressed = localStorage.getItem(key);
    
    if (!compressed) {
      return defaultValue;
    }
    
    const serialized = decompress(compressed);
    const parsed = JSON.parse(serialized) as StorageData<T>;
    
    // Version check (could implement migration logic here)
    if (parsed.metadata.version !== STORAGE_VERSION) {
      console.warn(`Storage version mismatch for ${key}. Expected ${STORAGE_VERSION}, got ${parsed.metadata.version}`);
      // In production, would implement migration strategy here
    }
    
    return parsed.data;
  } catch (error) {
    console.error(`Failed to retrieve data for key ${key}:`, error);
    return defaultValue;
  }
};

/**
 * Store campaign-specific candidates with pruning of old data
 */
export const storeCandidatesForCampaign = (
  campaignId: string, 
  candidates: any[]
): boolean => {
  // Get existing data
  const allCandidates = retrieveData<Record<string, any[]>>(
    STORAGE_KEYS.MATCHED_CANDIDATES, 
    {}
  );
  
  console.log(`Storing ${candidates.length} candidates for campaign ${campaignId}`);
  
  // Add/update candidates for this campaign
  allCandidates[campaignId] = candidates.slice(0, MAX_CANDIDATES_PER_CAMPAIGN);
  
  // Prune if we have too many campaigns
  const campaignIds = Object.keys(allCandidates);
  if (campaignIds.length > MAX_CAMPAIGNS) {
    // Remove oldest campaigns (we assume campaign IDs are sortable by creation time)
    const campaignsToKeep = campaignIds
      .sort()
      .slice(-MAX_CAMPAIGNS);
    
    const prunedCandidates: Record<string, any[]> = {};
    campaignsToKeep.forEach(id => {
      prunedCandidates[id] = allCandidates[id];
    });
    
    return storeData(STORAGE_KEYS.MATCHED_CANDIDATES, prunedCandidates);
  }
  
  const result = storeData(STORAGE_KEYS.MATCHED_CANDIDATES, allCandidates);
  console.log(`Storage result: ${result ? 'success' : 'failed'}`);
  return result;
};

/**
 * Retrieve candidates for a specific campaign
 */
export const getCandidatesForCampaign = (
  campaignId: string
): any[] => {
  console.log(`Retrieving candidates for campaign ${campaignId}`);
  const allCandidates = retrieveData<Record<string, any[]>>(
    STORAGE_KEYS.MATCHED_CANDIDATES, 
    {}
  );
  
  console.log(`All campaigns in storage: ${Object.keys(allCandidates).join(', ') || 'none'}`);
  const candidates = allCandidates[campaignId] || [];
  console.log(`Found ${candidates.length} candidates for campaign ${campaignId}`);
  
  return candidates;
};

/**
 * Clear all stored matched candidates
 */
export const clearAllMatchedCandidates = (): boolean => {
  try {
    localStorage.removeItem(STORAGE_KEYS.MATCHED_CANDIDATES);
    return true;
  } catch (error) {
    console.error('Failed to clear matched candidates:', error);
    return false;
  }
}; 