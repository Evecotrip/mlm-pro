/**
 * Hierarchy API
 * Handles MLM hierarchy tree, search, and statistics
 * MLM Investment Platform
 */

import { getTokenFromCookies } from "./register-user-api";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// ============================================
// TYPE DEFINITIONS
// ============================================

/**
 * User status in hierarchy
 */
export type HierarchyUserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

/**
 * Investment profile types
 */
export type ProfileType = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND' | null;

/**
 * Hierarchy member node
 */
export interface HierarchyNode {
  id: string;
  referralCode: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string | null;
  level: number;
  currentProfile: ProfileType;
  totalInvestment: string;
  activeInvestments: number;
  directReferrals: number;
  totalDownline: number;
  totalEarnings: string;
  status: HierarchyUserStatus;
  joinedAt: string;
  children: HierarchyNode[];
}

/**
 * Hierarchy tree response
 */
export interface HierarchyTree {
  root: HierarchyNode;
  totalLevels: number;
  totalMembers: number;
  displayedLevels: number;
  maxDisplayLevel: number;
}

/**
 * Path node in search result
 */
export interface PathNode {
  id: string;
  referralCode: string;
  firstName: string;
  lastName: string;
  level: number;
}

/**
 * Hierarchy search result
 */
export interface HierarchySearchResult {
  found: boolean;
  node: HierarchyNode | null;
  path: PathNode[];
  level: number;
}

/**
 * Level breakdown statistics
 */
export interface LevelBreakdown {
  level: number;
  count: number;
  totalInvestment: string;
  totalEarnings: string;
}

/**
 * Hierarchy statistics
 */
export interface HierarchyStats {
  totalDownline: number;
  directReferrals: number;
  levelBreakdown: LevelBreakdown[];
  activeMembers: number;
  totalInvestment: string;
  totalEarnings: string;
}

/**
 * Members at specific level
 */
export interface LevelMembers {
  level: number;
  members: HierarchyNode[];
  count: number;
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Get hierarchy tree (up to 5 levels by default)
 * @param maxLevel - Maximum levels to display (default: 5)
 * @returns Promise with hierarchy tree
 */
export async function getHierarchyTree(
  maxLevel: number = 5
): Promise<ApiResponse<HierarchyTree>> {
  try {
    const token = getTokenFromCookies();
    
    if (!token) {
      return {
        success: false,
        message: "Authentication token not found. Please login again.",
      };
    }

    const url = `${BASE_URL}/api/v1/hierarchy/tree${maxLevel ? `?maxLevel=${maxLevel}` : ''}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || "Failed to fetch hierarchy tree",
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching hierarchy tree");
    return {
      success: false,
      message: "Network error while fetching hierarchy tree",
    };
  }
}

/**
 * Search hierarchy by referral code
 * @param referralCode - Referral code to search for
 * @returns Promise with search result including path
 */
export async function searchHierarchy(
  referralCode: string
): Promise<ApiResponse<HierarchySearchResult>> {
  try {
    const token = getTokenFromCookies();
    
    if (!token) {
      return {
        success: false,
        message: "Authentication token not found. Please login again.",
      };
    }

    const response = await fetch(`${BASE_URL}/api/v1/hierarchy/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ referralCode }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || "Failed to search hierarchy",
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error searching hierarchy");
    return {
      success: false,
      message: "Network error while searching hierarchy",
    };
  }
}

/**
 * Get members at a specific level
 * @param level - Level number (1, 2, 3, etc.)
 * @returns Promise with members at that level
 */
export async function getMembersAtLevel(
  level: number
): Promise<ApiResponse<LevelMembers>> {
  try {
    const token = getTokenFromCookies();
    
    if (!token) {
      return {
        success: false,
        message: "Authentication token not found. Please login again.",
      };
    }

    const response = await fetch(`${BASE_URL}/api/v1/hierarchy/level/${level}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || `Failed to fetch members at level ${level}`,
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching members at level ${level}`);
    return {
      success: false,
      message: "Network error while fetching level members",
    };
  }
}

/**
 * Get hierarchy statistics
 * @returns Promise with hierarchy statistics
 */
export async function getHierarchyStats(): Promise<ApiResponse<HierarchyStats>> {
  try {
    const token = getTokenFromCookies();
    
    if (!token) {
      return {
        success: false,
        message: "Authentication token not found. Please login again.",
      };
    }

    const response = await fetch(`${BASE_URL}/api/v1/hierarchy/stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || "Failed to fetch hierarchy statistics",
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching hierarchy statistics");
    return {
      success: false,
      message: "Network error while fetching hierarchy statistics",
    };
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get status color for UI
 */
export function getHierarchyStatusColor(status: HierarchyUserStatus): string {
  switch (status) {
    case 'ACTIVE':
      return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    case 'INACTIVE':
      return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    case 'SUSPENDED':
      return 'text-red-400 bg-red-400/10 border-red-400/20';
    default:
      return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
  }
}

/**
 * Get profile color for UI
 */
export function getProfileColor(profile: ProfileType): string {
  switch (profile) {
    case 'BRONZE':
      return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
    case 'SILVER':
      return 'text-slate-600 bg-slate-100 dark:bg-slate-800';
    case 'GOLD':
      return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
    case 'PLATINUM':
      return 'text-cyan-600 bg-cyan-100 dark:bg-cyan-900/20';
    case 'DIAMOND':
      return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
    default:
      return 'text-slate-400 bg-slate-100 dark:bg-slate-800';
  }
}

/**
 * Get level color for UI (gradient based on depth)
 */
export function getLevelColor(level: number): string {
  const colors = [
    'text-blue-600 dark:text-blue-400',      // Level 0
    'text-emerald-600 dark:text-emerald-400', // Level 1
    'text-purple-600 dark:text-purple-400',   // Level 2
    'text-orange-600 dark:text-orange-400',   // Level 3
    'text-pink-600 dark:text-pink-400',       // Level 4
    'text-cyan-600 dark:text-cyan-400',       // Level 5+
  ];
  return colors[Math.min(level, colors.length - 1)];
}

/**
 * Format full name
 */
export function getFullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.trim() || 'Unknown User';
}

/**
 * Calculate total members in tree (recursive)
 */
export function countTotalMembers(node: HierarchyNode): number {
  let count = 1; // Count current node
  node.children.forEach(child => {
    count += countTotalMembers(child);
  });
  return count;
}

/**
 * Get max depth of tree (recursive)
 */
export function getMaxDepth(node: HierarchyNode, currentDepth: number = 0): number {
  if (node.children.length === 0) {
    return currentDepth;
  }
  
  let maxChildDepth = currentDepth;
  node.children.forEach(child => {
    const childDepth = getMaxDepth(child, currentDepth + 1);
    maxChildDepth = Math.max(maxChildDepth, childDepth);
  });
  
  return maxChildDepth;
}

/**
 * Flatten hierarchy tree to array
 */
export function flattenHierarchy(node: HierarchyNode): HierarchyNode[] {
  const result: HierarchyNode[] = [node];
  node.children.forEach(child => {
    result.push(...flattenHierarchy(child));
  });
  return result;
}

/**
 * Find node by ID in tree
 */
export function findNodeById(node: HierarchyNode, id: string): HierarchyNode | null {
  if (node.id === id) {
    return node;
  }
  
  for (const child of node.children) {
    const found = findNodeById(child, id);
    if (found) {
      return found;
    }
  }
  
  return null;
}

/**
 * Find node by referral code in tree
 */
export function findNodeByReferralCode(
  node: HierarchyNode, 
  referralCode: string
): HierarchyNode | null {
  if (node.referralCode === referralCode) {
    return node;
  }
  
  for (const child of node.children) {
    const found = findNodeByReferralCode(child, referralCode);
    if (found) {
      return found;
    }
  }
  
  return null;
}

/**
 * Get all nodes at specific level
 */
export function getNodesAtLevel(node: HierarchyNode, targetLevel: number): HierarchyNode[] {
  const result: HierarchyNode[] = [];
  
  function traverse(currentNode: HierarchyNode, currentLevel: number) {
    if (currentLevel === targetLevel) {
      result.push(currentNode);
      return;
    }
    
    currentNode.children.forEach(child => {
      traverse(child, currentLevel + 1);
    });
  }
  
  traverse(node, 0);
  return result;
}

/**
 * Calculate total investment in tree
 */
export function calculateTotalInvestment(node: HierarchyNode): number {
  let total = parseFloat(node.totalInvestment || '0');
  node.children.forEach(child => {
    total += calculateTotalInvestment(child);
  });
  return total;
}

/**
 * Calculate total earnings in tree
 */
export function calculateTotalEarnings(node: HierarchyNode): number {
  let total = parseFloat(node.totalEarnings || '0');
  node.children.forEach(child => {
    total += calculateTotalEarnings(child);
  });
  return total;
}

/**
 * Format member card data for display
 */
export interface MemberCardData {
  id: string;
  name: string;
  email: string;
  referralCode: string;
  level: number;
  profile: ProfileType;
  investment: number;
  earnings: number;
  directReferrals: number;
  totalDownline: number;
  status: HierarchyUserStatus;
  joinedAt: Date;
}

export function formatMemberCard(node: HierarchyNode): MemberCardData {
  return {
    id: node.id,
    name: getFullName(node.firstName, node.lastName),
    email: node.email,
    referralCode: node.referralCode,
    level: node.level,
    profile: node.currentProfile,
    investment: parseFloat(node.totalInvestment || '0'),
    earnings: parseFloat(node.totalEarnings || '0'),
    directReferrals: node.directReferrals,
    totalDownline: node.totalDownline,
    status: node.status,
    joinedAt: new Date(node.joinedAt),
  };
}
