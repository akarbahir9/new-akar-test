import React from 'react';

export enum Language {
  ENGLISH = 'en',
  ARABIC = 'ar',
  SORANI = 'ckb', // Central Kurdish
  BADINI = 'kmr', // Northern Kurdish (using Arabic script for consistency in this region context usually, or Latin)
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

export enum View {
  DASHBOARD = 'DASHBOARD',
  FLOW_EDITOR = 'FLOW_EDITOR',
  SETTINGS = 'SETTINGS',
}

export interface Translation {
  dashboard: string;
  flowEditor: string;
  settings: string;
  welcome: string;
  totalFlows: string;
  activeUsers: string;
  successRate: string;
  recentActivity: string;
  createFlow: string;
  aiAssistant: string;
  askAi: string;
  typing: string;
  language: string;
  theme: string;
  darkMode: string;
  lightMode: string;
  genFlow: string;
  flowName: string;
  nodes: string;
  edges: string;
  execute: string;
  connectWallet: string; // Just a filler term for "Connect"
  logout: string;
  search: string;
}

export interface NavItem {
  id: View;
  icon: React.ReactNode;
  label: string;
}

export interface FlowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition';
  label: string;
  x: number;
  y: number;
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}