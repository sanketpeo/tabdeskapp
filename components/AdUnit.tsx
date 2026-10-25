"use client";

import React from "react";

export type AdSlotType =
  | "leaderboard" // 728x90
  | "rectangle" // 300x250
  | "skyscraper" // 160x600
  | "mobile-banner" // 320x50
  | "responsive";

interface AdUnitProps {
  slotType: AdSlotType;
  className?: string;
  isSticky?: boolean;
  adClient?: string;
  adSlot?: string;
}

export default function AdUnit({
  slotType: _slotType,
  className: _className = "",
  isSticky: _isSticky = false,
  adClient: _adClient,
  adSlot: _adSlot,
}: AdUnitProps) {
  // Advertising areas currently disabled
  return null;
}
