/**
 * Timeline-aware data access layer.
 * Filters and transforms mock data based on the current time point.
 */

import { getState } from '../store.js';
import { stories, activityFeed, epics, engagement, invoices } from './mock-data.js';

const TIME_ORDER = ['day1', 'day3', 'day5', 'day7', 'week2', 'week4', 'week6', 'week12'];

function timeIndex(tp) {
  return TIME_ORDER.indexOf(tp);
}

/**
 * Returns true if the given timepoint is at or after the item's visibleFrom.
 */
function isVisible(item, currentTP) {
  if (!item.visibleFrom) return true;
  return timeIndex(currentTP) >= timeIndex(item.visibleFrom);
}

/**
 * Get the state of a story at a given time point.
 * Falls back to the most recent defined state.
 */
function getStoryState(story, tp) {
  if (!story.stateByTime) return { status: story.status, progress: 0 };

  let lastState = { status: 'backlog', progress: 0 };
  for (const point of TIME_ORDER) {
    if (story.stateByTime[point]) {
      lastState = { ...lastState, ...story.stateByTime[point] };
    }
    if (point === tp) break;
  }
  return lastState;
}

/**
 * Get all visible stories with their current state for the active time point.
 */
export function getStories(tp) {
  const currentTP = tp || getState().currentTimePoint;
  return stories
    .filter(s => isVisible(s, currentTP))
    .map(s => ({
      ...s,
      ...getStoryState(s, currentTP)
    }));
}

/**
 * Get stories filtered by status at the current time point.
 */
export function getStoriesByStatus(status, tp) {
  return getStories(tp).filter(s => s.status === status);
}

/**
 * Get stories for a specific epic.
 */
export function getStoriesForEpic(epicId, tp) {
  return getStories(tp).filter(s => s.epicId === epicId);
}

/**
 * Get epics with computed progress for the current time point.
 */
export function getEpics(tp) {
  const currentTP = tp || getState().currentTimePoint;
  return epics.map(epic => {
    const epicStories = getStoriesForEpic(epic.id, currentTP);
    const done = epicStories.filter(s => s.status === 'done').length;
    const total = epicStories.length;
    const progress = total > 0 ? Math.round((done / total) * 100) : 0;
    return {
      ...epic,
      storyCount: total,
      completedStories: done,
      progress,
      status: progress === 100 ? 'done' : progress > 0 ? 'in-progress' : 'planned'
    };
  });
}

/**
 * Get activity feed items visible at the current time point.
 */
export function getActivityFeed(tp) {
  const currentTP = tp || getState().currentTimePoint;
  return activityFeed
    .filter(a => isVisible(a, currentTP))
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Get engagement state at the current time point.
 */
export function getEngagement(tp) {
  const currentTP = tp || getState().currentTimePoint;
  const idx = timeIndex(currentTP);

  const sprintMap = { day1: 0, day3: 0, day5: 0, day7: 0, week2: 1, week4: 2, week6: 4, week12: 8 };
  const healthMap = { day1: 0, day3: 0, day5: 0, day7: 80, week2: 82, week4: 85, week6: 87, week12: 91 };
  const concurrencyMap = { day1: 0, day3: 0, day5: 0, day7: 1, week2: 3, week4: 4, week6: 3, week12: 4 };

  const allStories = getStories(currentTP);
  const doneCount = allStories.filter(s => s.status === 'done').length;

  return {
    ...engagement,
    currentSprint: sprintMap[currentTP] || 0,
    healthScore: healthMap[currentTP] || 0,
    activeConcurrency: concurrencyMap[currentTP] || 0,
    status: idx < 3 ? 'pre-engagement' : idx === 3 ? 'onboarding' : 'active',
    storiesCompleted: doneCount,
    storiesTotal: allStories.length,
    progress: allStories.length > 0 ? Math.round((doneCount / allStories.length) * 100) : 0
  };
}

/**
 * Get invoices visible at the current time point.
 */
export function getInvoices(tp) {
  const currentTP = tp || getState().currentTimePoint;
  const idx = timeIndex(currentTP);
  if (idx < 4) return []; // No invoices before week 2
  if (idx < 5) return invoices.slice(0, 1);
  if (idx < 7) return invoices.slice(0, 2);
  return invoices;
}

/**
 * Get pipeline stage for the Meridian submission at the current time point.
 */
export function getPipelineStage(tp) {
  const currentTP = tp || getState().currentTimePoint;
  const stageMap = {
    day1: 'new',
    day3: 'discovery-scheduled',
    day5: 'proposal-sent',
    day7: 'active',
    week2: 'active',
    week4: 'active',
    week6: 'active',
    week12: 'active'
  };
  return stageMap[currentTP] || 'new';
}

/**
 * Summary stats for the current time point.
 */
export function getStats(tp) {
  const currentTP = tp || getState().currentTimePoint;
  const allStories = getStories(currentTP);
  const eng = getEngagement(currentTP);

  return {
    totalStories: allStories.length,
    doneStories: allStories.filter(s => s.status === 'done').length,
    inProgressStories: allStories.filter(s => s.status.includes('in-progress')).length,
    reviewStories: allStories.filter(s => s.status.includes('review')).length,
    backlogStories: allStories.filter(s => s.status === 'backlog' || s.status === 'sprint-ready').length,
    sprintNumber: eng.currentSprint,
    healthScore: eng.healthScore,
    concurrency: eng.activeConcurrency,
    maxConcurrency: eng.concurrencySlots
  };
}

export { TIME_ORDER, timeIndex, isVisible };
