/// <reference types="vite/client" />
import { describe, it, expect } from 'vitest';
import appSource from '../App.tsx?raw';
import { HELP_CATEGORIES, HELP_VERSION, PROBLEM_SOLUTIONS } from '../data/help/categories';
import { HELP_ROLES, HELP_DEPARTMENTS, HELP_WORK_CATEGORIES, HELP_ISSUES } from '../data/help/guides';
import {
  LIFECYCLE_STEPS,
  HELP_SCREEN_DIRECTORY,
  HELP_WALKTHROUGHS,
  PLATFORM_MINDMAP,
  HELP_FAQS,
  HELP_GLOSSARY,
  ONBOARDING_PATHS,
} from '../data/help/catalogues';
import type { MindmapNode } from '../data/help/types';

function extractAppRoutes(): Set<string> {
  const matches = [...appSource.matchAll(/<Route\s+path="([^"]+)"/g)].map((m) => m[1]);
  return new Set(matches.filter((r) => r !== '*'));
}

function collectMindmapRoutes(node: MindmapNode, out: string[] = []): string[] {
  if (node.route) out.push(node.route);
  if (node.children) {
    for (const child of node.children) {
      collectMindmapRoutes(child, out);
    }
  }
  return out;
}

function normalizeBaseRoute(route: string): string {
  return route.split('?')[0];
}

describe('Help & Platform Knowledge Centre data and route integrity', () => {
  const appRoutes = extractAppRoutes();

  it('defines all 30 Help categories with unique IDs and valid relatedScreen links', () => {
    expect(HELP_VERSION).toBeTruthy();
    expect(HELP_CATEGORIES.length).toBe(30);
    const ids = new Set(HELP_CATEGORIES.map((c) => c.id));
    expect(ids.size).toBe(30);

    for (const category of HELP_CATEGORIES) {
      expect(category.summary.length).toBeGreaterThan(15);
      for (const link of category.relatedScreens) {
        expect(appRoutes.has(normalizeBaseRoute(link.route))).toBe(true);
      }
    }
  });

  it('validates every route in HELP_SCREEN_DIRECTORY, PLATFORM_MINDMAP, and ONBOARDING_PATHS exists in App.tsx', () => {
    expect(HELP_SCREEN_DIRECTORY.length).toBeGreaterThanOrEqual(25);
    for (const screen of HELP_SCREEN_DIRECTORY) {
      expect(appRoutes.has(normalizeBaseRoute(screen.route))).toBe(true);
    }

    const mindmapRoutes = collectMindmapRoutes(PLATFORM_MINDMAP);
    expect(mindmapRoutes.length).toBeGreaterThan(5);
    for (const route of mindmapRoutes) {
      expect(appRoutes.has(normalizeBaseRoute(route))).toBe(true);
    }

    for (const path of ONBOARDING_PATHS) {
      for (const step of path.steps) {
        if (step.route) {
          expect(appRoutes.has(normalizeBaseRoute(step.route))).toBe(true);
        }
      }
    }
  });

  it('covers roles, departments, lifecycle steps, and problem-solution mappings', () => {
    expect(HELP_ROLES.length).toBeGreaterThanOrEqual(12);
    expect(HELP_DEPARTMENTS.length).toBeGreaterThanOrEqual(6);
    expect(HELP_WORK_CATEGORIES.length).toBeGreaterThanOrEqual(6);
    expect(HELP_ISSUES.length).toBeGreaterThanOrEqual(5);
    expect(LIFECYCLE_STEPS.length).toBe(18);
    expect(PROBLEM_SOLUTIONS.length).toBeGreaterThan(0);

    const roleIds = new Set(HELP_ROLES.map((r) => r.id));
    expect(roleIds.size).toBe(HELP_ROLES.length);

    const problemIds = new Set(PROBLEM_SOLUTIONS.map((p) => p.id));
    expect(problemIds.size).toBe(PROBLEM_SOLUTIONS.length);
  });

  it('includes walkthroughs, FAQs, and glossary entries with non-empty fields', () => {
    expect(HELP_WALKTHROUGHS.length).toBeGreaterThanOrEqual(5);
    expect(HELP_FAQS.length).toBeGreaterThanOrEqual(8);
    expect(HELP_GLOSSARY.length).toBeGreaterThanOrEqual(10);

    for (const faq of HELP_FAQS) {
      expect(faq.question.length).toBeGreaterThan(5);
      expect(faq.answer.length).toBeGreaterThan(15);
    }
    for (const term of HELP_GLOSSARY) {
      expect(term.term.length).toBeGreaterThan(1);
      expect(term.plainDefinition.length).toBeGreaterThan(10);
    }
  });
});
