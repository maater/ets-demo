/**
 * Agent Monitoring Dashboard — real-time agent status and performance.
 */

import { agents } from '../../data/mock-data.js';
import { renderBadge } from '../../components/status-badge.js';
import { renderBarChart, renderLineChart } from '../../components/chart.js';
import { renderMetricCard } from '../../components/metric-card.js';

export function render(container) {
  container.innerHTML = `
    <div class="page page-wide">
      <div class="page-header">
        <h1>Agent Monitoring</h1>
        <p>Real-time status and performance metrics for all AI agents.</p>
      </div>

      <!-- Summary Metrics -->
      <div class="grid grid-4 gap-4 mb-6">
        ${renderMetricCard({ label: 'Active Agents', value: agents.filter(a => a.status === 'working').length, icon: '🤖', color: 'var(--accent)' })}
        ${renderMetricCard({ label: 'Tasks Completed Today', value: '14', icon: '✅', trend: 'up', trendLabel: '+3 from yesterday' })}
        ${renderMetricCard({ label: 'Avg. Task Duration', value: '23m', icon: '⏱️', trendLabel: 'across all agents' })}
        ${renderMetricCard({ label: 'Review Pass Rate', value: '91%', icon: '🎯', trend: 'up', trendLabel: 'first-pass approval', color: 'var(--accent)' })}
      </div>

      <!-- Agent Cards -->
      <div class="grid grid-2 gap-4 mb-6">
        ${agents.map(agent => `
          <div class="card">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-3">
                <div class="avatar" style="background:${agent.color}20; color:${agent.color}; font-size:var(--text-lg);">${agent.icon}</div>
                <div>
                  <h4>${agent.name}</h4>
                  <div class="text-xs text-muted">${agent.type}</div>
                </div>
              </div>
              ${renderBadge(agent.status)}
            </div>

            ${agent.currentTask ? `
              <div class="callout mb-3" style="background:var(--bg-secondary); border-left-color:${agent.color};">
                <div class="text-xs text-muted">Current Task</div>
                <div class="text-sm" style="font-weight:500;">${agent.currentTask}</div>
                ${agent.progress ? `
                  <div class="progress-bar mt-2" style="height:4px;">
                    <div class="progress-bar-fill" style="width:${agent.progress}%; background:${agent.color};"></div>
                  </div>
                ` : ''}
              </div>
            ` : `
              <div class="text-sm text-muted mb-3">No active task</div>
            `}

            <div class="grid grid-3 gap-3 text-center">
              <div>
                <div style="font-weight:700; color:var(--accent);">${agent.tasksCompleted}</div>
                <div class="text-xs text-muted">Completed</div>
              </div>
              <div>
                <div style="font-weight:700;">${agent.avgDuration}</div>
                <div class="text-xs text-muted">Avg Duration</div>
              </div>
              <div>
                <div style="font-weight:700; color:${agent.passRate >= 90 ? 'var(--accent)' : 'var(--warning)'};">${agent.passRate}%</div>
                <div class="text-xs text-muted">Pass Rate</div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Agent Activity Over Time -->
      <div class="grid grid-2 gap-6">
        <div class="card">
          ${renderBarChart({
            data: agents.map(a => ({
              label: a.name.split(' ')[0],
              value: a.tasksCompleted,
              color: a.color
            })),
            label: 'Tasks Completed by Agent',
            height: 200
          })}
        </div>

        <div class="card">
          ${renderLineChart({
            data: [
              { label: 'Mon', value: 8 },
              { label: 'Tue', value: 12 },
              { label: 'Wed', value: 11 },
              { label: 'Thu', value: 15 },
              { label: 'Fri', value: 14 },
              { label: 'Sat', value: 6 },
              { label: 'Sun', value: 4 }
            ],
            label: 'Total Agent Tasks (This Week)',
            color: 'var(--primary)',
            fill: true,
            height: 200
          })}
        </div>
      </div>

      <!-- Recent Agent Activity Log -->
      <div class="card mt-6">
        <h3 class="mb-4">Agent Activity Log</h3>
        <div class="flex flex-col gap-2 text-sm">
          ${[
            { time: '10:42 AM', agent: 'Forge', action: 'Completed risk scoring implementation', status: 'done' },
            { time: '10:38 AM', agent: 'Atlas', action: 'Started demand pattern analysis for inventory module', status: 'working' },
            { time: '10:15 AM', agent: 'Pipeline', action: 'Daily SAP data aggregation — 98.2% quality score', status: 'done' },
            { time: '09:50 AM', agent: 'Scribe', action: 'Generated executive summary draft for sprint review', status: 'done' },
            { time: '09:30 AM', agent: 'Sentinel', action: 'Ran quality check on procurement dashboard — 2 issues flagged', status: 'waiting' },
            { time: '09:12 AM', agent: 'Forge', action: 'Started procurement dashboard chart components', status: 'working' },
            { time: '08:45 AM', agent: 'Atlas', action: 'Completed supplier risk factor research report', status: 'done' },
            { time: '08:00 AM', agent: 'Pipeline', action: 'Scheduled incremental SAP MM extraction', status: 'working' }
          ].map(log => `
            <div class="flex items-center gap-3 p-2" style="border-radius:var(--radius);" onmouseover="this.style.background='var(--bg-secondary)'" onmouseout="this.style.background=''">
              <span class="text-xs text-muted" style="width:70px;">${log.time}</span>
              <span class="badge" style="width:70px; text-align:center;">${log.agent}</span>
              <span style="flex:1;">${log.action}</span>
              ${renderBadge(log.status)}
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}
