/**
 * All mock data for the Axon Labs demo.
 * Every entity references the Meridian Partners SAP Intelligence Project scenario.
 */

// ============================================================
// COMPANIES
// ============================================================
export const companies = {
  axon: {
    id: 'axon',
    name: 'Axon Labs',
    tagline: 'SAP Intelligence That Tells You What To Do',
    description: 'A Vixul portfolio company specializing in SAP intelligence solutions for mid-market manufacturers.',
    teamSize: 6,
    agentCount: 10,
    founded: '2024'
  },
  meridian: {
    id: 'meridian',
    name: 'Meridian Partners',
    industry: 'Manufacturing',
    size: 'Mid-market',
    employees: 850,
    revenue: '$120M',
    location: 'Chicago, IL',
    sapModules: ['MM (Materials Management)', 'PP (Production Planning)', 'FI (Financial Accounting)', 'SD (Sales & Distribution)'],
    description: 'Mid-size manufacturer looking for AI-driven insights from their SAP data — procurement patterns, inventory optimization, supplier risk signals.'
  }
};

// ============================================================
// USERS
// ============================================================
export const users = {
  sarah: {
    id: 'sarah',
    name: 'Sarah Chen',
    role: 'Operations Lead',
    company: 'meridian',
    email: 'sarah.chen@meridianpartners.com',
    avatar: 'SC',
    color: '#7c3aed'
  },
  james: {
    id: 'james',
    name: 'James Park',
    role: 'Account Manager',
    company: 'axon',
    email: 'james@axonlabs.ai',
    avatar: 'JP',
    color: '#2563eb'
  },
  maria: {
    id: 'maria',
    name: 'Maria Lopez',
    role: 'Delivery Lead',
    company: 'axon',
    email: 'maria@axonlabs.ai',
    avatar: 'ML',
    color: '#059669'
  },
  david: {
    id: 'david',
    name: 'David Kim',
    role: 'SAP Architect',
    company: 'axon',
    email: 'david@axonlabs.ai',
    avatar: 'DK',
    color: '#d97706'
  },
  rachel: {
    id: 'rachel',
    name: 'Rachel Torres',
    role: 'CFO',
    company: 'meridian',
    email: 'rachel.torres@meridianpartners.com',
    avatar: 'RT',
    color: '#dc2626'
  },
  alex: {
    id: 'alex',
    name: 'Alex Nguyen',
    role: 'Platform Lead',
    company: 'axon',
    email: 'alex@axonlabs.ai',
    avatar: 'AN',
    color: '#0891b2'
  }
};

// ============================================================
// ENGAGEMENT
// ============================================================
export const engagement = {
  id: 'eng-001',
  customer: 'meridian',
  name: 'SAP Intelligence Platform',
  tier: 'Professional',
  monthlyRate: 18500,
  startDate: '2026-01-12',
  currentSprint: 5,
  totalSprints: 12,
  concurrencySlots: 5,
  activeConcurrency: 3,
  status: 'active',
  healthScore: 87,
  nextMilestone: {
    name: 'Supplier Risk Engine MVP',
    date: '2026-04-01',
    progress: 65
  }
};

// ============================================================
// EPICS
// ============================================================
export const epics = [
  {
    id: 'epic-1',
    title: 'Procurement Analytics',
    description: 'AI-powered analysis of procurement patterns, spend optimization, and vendor performance across SAP MM data.',
    status: 'in-progress',
    progress: 75,
    storyCount: 6,
    completedStories: 4,
    priority: 'high',
    color: '#2563eb'
  },
  {
    id: 'epic-2',
    title: 'Supplier Risk Engine',
    description: 'Real-time supplier risk scoring using delivery performance, financial indicators, and market signals.',
    status: 'in-progress',
    progress: 40,
    storyCount: 5,
    completedStories: 2,
    priority: 'high',
    color: '#dc2626'
  },
  {
    id: 'epic-3',
    title: 'Inventory Optimization',
    description: 'ML-driven inventory forecasting and reorder point optimization based on SAP PP and MM data.',
    status: 'planned',
    progress: 10,
    storyCount: 5,
    completedStories: 0,
    priority: 'medium',
    color: '#059669'
  },
  {
    id: 'epic-4',
    title: 'Executive Dashboard',
    description: 'C-suite dashboard with KPIs, trend analysis, and AI-generated executive briefings.',
    status: 'planned',
    progress: 5,
    storyCount: 4,
    completedStories: 0,
    priority: 'medium',
    color: '#d97706'
  },
  {
    id: 'epic-5',
    title: 'API & Integrations',
    description: 'SAP data connectors, webhook system, and third-party integration framework.',
    status: 'planned',
    progress: 0,
    storyCount: 3,
    completedStories: 0,
    priority: 'low',
    color: '#6b7280'
  }
];

// ============================================================
// STORIES
// ============================================================
export const stories = [
  // Epic 1: Procurement Analytics
  {
    id: 'story-1',
    epicId: 'epic-1',
    title: 'Spend Category Classifier',
    description: 'ML model that auto-classifies procurement spend into strategic categories using SAP MM transaction data.',
    acceptanceCriteria: [
      'Classifies 95%+ of transactions into predefined categories',
      'Handles edge cases with confidence scoring',
      'Provides explainability for each classification'
    ],
    status: 'done',
    assignedTo: ['maria', 'research-agent'],
    effort: 5,
    priority: 'high',
    visibleFrom: 'day7',
    stateByTime: {
      day7: { status: 'backlog' },
      week2: { status: 'in-progress-agent', progress: 40 },
      week4: { status: 'done', progress: 100 },
      week6: { status: 'done', progress: 100 },
      week12: { status: 'done', progress: 100 }
    }
  },
  {
    id: 'story-2',
    epicId: 'epic-1',
    title: 'Vendor Performance Scorecard',
    description: 'Automated vendor scoring based on delivery timeliness, quality metrics, and price competitiveness from SAP data.',
    acceptanceCriteria: [
      'Score computed from 5+ weighted factors',
      'Historical trend visualization',
      'Configurable weighting by user'
    ],
    status: 'done',
    assignedTo: ['david', 'coding-agent'],
    effort: 8,
    priority: 'high',
    visibleFrom: 'day7',
    stateByTime: {
      day7: { status: 'backlog' },
      week2: { status: 'in-progress-human', progress: 20 },
      week4: { status: 'human-review', progress: 85 },
      week6: { status: 'done', progress: 100 },
      week12: { status: 'done', progress: 100 }
    }
  },
  {
    id: 'story-3',
    epicId: 'epic-1',
    title: 'Procurement Anomaly Detector',
    description: 'Statistical anomaly detection for unusual procurement patterns — price spikes, volume changes, new vendor flags.',
    acceptanceCriteria: [
      'Detects price anomalies >2 std deviations',
      'Alerts with severity and recommended action',
      'Configurable sensitivity thresholds'
    ],
    status: 'in-progress',
    assignedTo: ['research-agent', 'maria'],
    effort: 8,
    priority: 'medium',
    visibleFrom: 'week2',
    stateByTime: {
      week2: { status: 'backlog' },
      week4: { status: 'sprint-ready' },
      week6: { status: 'in-progress-agent', progress: 60 },
      week12: { status: 'done', progress: 100 }
    }
  },
  {
    id: 'story-4',
    epicId: 'epic-1',
    title: 'Spend Forecast Model',
    description: 'Predictive model for procurement spend by category and vendor, using historical SAP FI and MM data.',
    acceptanceCriteria: [
      'Monthly forecast with 85%+ accuracy',
      'Confidence intervals displayed',
      'Drill-down by category, vendor, plant'
    ],
    status: 'done',
    assignedTo: ['coding-agent', 'david'],
    effort: 5,
    priority: 'medium',
    visibleFrom: 'day7',
    stateByTime: {
      day7: { status: 'backlog' },
      week2: { status: 'sprint-ready' },
      week4: { status: 'in-progress-agent', progress: 50 },
      week6: { status: 'agent-review', progress: 90 },
      week12: { status: 'done', progress: 100 }
    }
  },
  {
    id: 'story-5',
    epicId: 'epic-1',
    title: 'Procurement Dashboard UI',
    description: 'Interactive dashboard consolidating all procurement analytics — spend, vendors, anomalies, forecasts.',
    acceptanceCriteria: [
      'Responsive grid layout with chart widgets',
      'Drill-down from summary to detail',
      'Export to PDF and CSV'
    ],
    status: 'in-progress',
    assignedTo: ['coding-agent', 'maria'],
    effort: 8,
    priority: 'high',
    visibleFrom: 'week2',
    stateByTime: {
      week2: { status: 'backlog' },
      week4: { status: 'in-progress-agent', progress: 30 },
      week6: { status: 'in-progress-human', progress: 55 },
      week12: { status: 'done', progress: 100 }
    }
  },
  {
    id: 'story-6',
    epicId: 'epic-1',
    title: 'Natural Language Query Interface',
    description: 'Chat-based interface for procurement queries — "What did we spend on raw materials last quarter?"',
    acceptanceCriteria: [
      'Handles 20+ common procurement query patterns',
      'Returns structured data + natural language summary',
      'Suggests follow-up questions'
    ],
    status: 'backlog',
    assignedTo: ['research-agent'],
    effort: 13,
    priority: 'medium',
    visibleFrom: 'week4',
    stateByTime: {
      week4: { status: 'backlog' },
      week6: { status: 'backlog' },
      week12: { status: 'in-progress-agent', progress: 35 }
    }
  },

  // Epic 2: Supplier Risk Engine
  {
    id: 'story-7',
    epicId: 'epic-2',
    title: 'Supplier Data Aggregator',
    description: 'ETL pipeline to aggregate supplier data from SAP MM, external APIs (D&B, news feeds), and internal records.',
    acceptanceCriteria: [
      'Consolidates data from 3+ sources',
      'Daily refresh cycle',
      'Data quality scoring'
    ],
    status: 'done',
    assignedTo: ['data-agent', 'david'],
    effort: 8,
    priority: 'high',
    visibleFrom: 'day7',
    stateByTime: {
      day7: { status: 'backlog' },
      week2: { status: 'in-progress-agent', progress: 60 },
      week4: { status: 'done', progress: 100 },
      week6: { status: 'done', progress: 100 },
      week12: { status: 'done', progress: 100 }
    }
  },
  {
    id: 'story-8',
    epicId: 'epic-2',
    title: 'Risk Scoring Algorithm',
    description: 'Multi-factor risk scoring model combining delivery reliability, financial health, geographic risk, and concentration risk.',
    acceptanceCriteria: [
      'Composite score from 6+ weighted risk factors',
      'Risk level thresholds (Low/Medium/High/Critical)',
      'Factor contribution breakdown'
    ],
    status: 'in-progress',
    assignedTo: ['research-agent', 'maria'],
    effort: 13,
    priority: 'high',
    visibleFrom: 'week2',
    stateByTime: {
      week2: { status: 'sprint-ready' },
      week4: { status: 'in-progress-agent', progress: 45 },
      week6: { status: 'human-review', progress: 85 },
      week12: { status: 'done', progress: 100 }
    }
  },
  {
    id: 'story-9',
    epicId: 'epic-2',
    title: 'Supplier Risk Dashboard',
    description: 'Visual risk dashboard with heatmap, top-risk suppliers, trend charts, and drill-down capability.',
    acceptanceCriteria: [
      'Risk heatmap by supplier and category',
      'Alert feed for risk changes',
      'One-click supplier profile'
    ],
    status: 'backlog',
    assignedTo: ['coding-agent'],
    effort: 8,
    priority: 'medium',
    visibleFrom: 'week4',
    stateByTime: {
      week4: { status: 'backlog' },
      week6: { status: 'sprint-ready' },
      week12: { status: 'done', progress: 100 }
    }
  },
  {
    id: 'story-10',
    epicId: 'epic-2',
    title: 'Risk Alert System',
    description: 'Automated alerts when supplier risk scores cross thresholds — email, in-app, and Slack notifications.',
    acceptanceCriteria: [
      'Configurable alert thresholds per supplier',
      'Multi-channel delivery',
      'Alert acknowledge and snooze'
    ],
    status: 'backlog',
    assignedTo: ['coding-agent', 'alex'],
    effort: 5,
    priority: 'low',
    visibleFrom: 'week6',
    stateByTime: {
      week6: { status: 'backlog' },
      week12: { status: 'in-progress-human', progress: 40 }
    }
  },
  {
    id: 'story-11',
    epicId: 'epic-2',
    title: 'Supplier Comparison Tool',
    description: 'Side-by-side supplier comparison with scoring, pricing history, and performance benchmarks.',
    acceptanceCriteria: [
      'Compare up to 4 suppliers simultaneously',
      'Radar chart visualization',
      'Export comparison report'
    ],
    status: 'backlog',
    assignedTo: ['coding-agent'],
    effort: 5,
    priority: 'low',
    visibleFrom: 'week6',
    stateByTime: {
      week6: { status: 'backlog' },
      week12: { status: 'backlog' }
    }
  },

  // Epic 3: Inventory Optimization
  {
    id: 'story-12',
    epicId: 'epic-3',
    title: 'Demand Forecasting Model',
    description: 'ML model predicting material demand using historical SAP PP data, seasonality, and market indicators.',
    acceptanceCriteria: [
      'Forecasts at SKU level with weekly granularity',
      'Accuracy >80% MAPE',
      'Handles seasonal patterns'
    ],
    status: 'backlog',
    assignedTo: ['research-agent'],
    effort: 13,
    priority: 'high',
    visibleFrom: 'week4',
    stateByTime: {
      week4: { status: 'backlog' },
      week6: { status: 'backlog' },
      week12: { status: 'in-progress-agent', progress: 55 }
    }
  },
  {
    id: 'story-13',
    epicId: 'epic-3',
    title: 'Reorder Point Optimizer',
    description: 'Dynamic reorder point calculation using demand forecast, lead times, and service level targets.',
    acceptanceCriteria: [
      'Optimized reorder points per SKU',
      'Safety stock recommendations',
      'What-if scenario simulator'
    ],
    status: 'backlog',
    assignedTo: [],
    effort: 8,
    priority: 'medium',
    visibleFrom: 'week6',
    stateByTime: {
      week6: { status: 'backlog' },
      week12: { status: 'backlog' }
    }
  },
  {
    id: 'story-14',
    epicId: 'epic-3',
    title: 'Inventory Health Dashboard',
    description: 'Dashboard showing stock levels, turnover rates, dead stock alerts, and optimization recommendations.',
    acceptanceCriteria: [
      'ABC/XYZ classification view',
      'Days of supply metric',
      'Dead stock identification and alerts'
    ],
    status: 'backlog',
    assignedTo: [],
    effort: 8,
    priority: 'medium',
    visibleFrom: 'week6',
    stateByTime: {
      week6: { status: 'backlog' },
      week12: { status: 'sprint-ready' }
    }
  },

  // Epic 4: Executive Dashboard
  {
    id: 'story-15',
    epicId: 'epic-4',
    title: 'KPI Engine',
    description: 'Configurable KPI calculation engine pulling from procurement, supply risk, and inventory data.',
    acceptanceCriteria: [
      '15+ pre-built KPIs',
      'Custom KPI builder',
      'Trend and YoY comparison'
    ],
    status: 'backlog',
    assignedTo: [],
    effort: 8,
    priority: 'medium',
    visibleFrom: 'week6',
    stateByTime: {
      week6: { status: 'backlog' },
      week12: { status: 'backlog' }
    }
  },
  {
    id: 'story-16',
    epicId: 'epic-4',
    title: 'AI Executive Briefing',
    description: 'Weekly AI-generated executive summary with key insights, risks, and recommended actions.',
    acceptanceCriteria: [
      'Auto-generated weekly briefing',
      'Editable before distribution',
      'Historical briefing archive'
    ],
    status: 'backlog',
    assignedTo: [],
    effort: 5,
    priority: 'low',
    visibleFrom: 'week12',
    stateByTime: {
      week12: { status: 'backlog' }
    }
  },

  // Epic 5: API & Integrations
  {
    id: 'story-17',
    epicId: 'epic-5',
    title: 'SAP Data Connector',
    description: 'Real-time and batch data connector to SAP ECC/S4HANA using RFC and OData protocols.',
    acceptanceCriteria: [
      'Supports RFC and OData extraction',
      'Incremental delta loading',
      'Error handling and retry logic'
    ],
    status: 'done',
    assignedTo: ['data-agent', 'david'],
    effort: 13,
    priority: 'high',
    visibleFrom: 'day7',
    stateByTime: {
      day7: { status: 'sprint-ready' },
      week2: { status: 'in-progress-human', progress: 50 },
      week4: { status: 'done', progress: 100 },
      week6: { status: 'done', progress: 100 },
      week12: { status: 'done', progress: 100 }
    }
  }
];

// ============================================================
// AGENTS
// ============================================================
export const agents = [
  {
    id: 'research-agent',
    name: 'Atlas',
    type: 'Research Agent',
    description: 'Deep analysis and pattern discovery across SAP data and external sources.',
    status: 'working',
    currentTask: 'Analyzing procurement anomaly patterns for Q4',
    queueDepth: 3,
    successRate: 92,
    avgTaskTime: '2.4 hrs',
    tasksCompleted: 47,
    revisionRate: 12,
    avatar: '🔍'
  },
  {
    id: 'coding-agent',
    name: 'Forge',
    type: 'Coding Agent',
    description: 'Generates, tests, and documents code artifacts based on story requirements.',
    status: 'working',
    currentTask: 'Building procurement dashboard chart components',
    queueDepth: 2,
    successRate: 88,
    avgTaskTime: '3.1 hrs',
    tasksCompleted: 38,
    revisionRate: 18,
    avatar: '⚡'
  },
  {
    id: 'testing-agent',
    name: 'Sentinel',
    type: 'Testing Agent',
    description: 'Automated test generation, execution, and coverage analysis.',
    status: 'idle',
    currentTask: null,
    queueDepth: 0,
    successRate: 95,
    avgTaskTime: '1.2 hrs',
    tasksCompleted: 62,
    revisionRate: 5,
    avatar: '🛡️'
  },
  {
    id: 'data-agent',
    name: 'Pipeline',
    type: 'Data Agent',
    description: 'ETL pipeline management, data quality validation, and SAP data extraction.',
    status: 'working',
    currentTask: 'Running daily supplier data aggregation',
    queueDepth: 1,
    successRate: 96,
    avgTaskTime: '1.8 hrs',
    tasksCompleted: 84,
    revisionRate: 4,
    avatar: '🔄'
  },
  {
    id: 'docs-agent',
    name: 'Scribe',
    type: 'Documentation Agent',
    description: 'Generates and maintains technical documentation, user guides, and API docs.',
    status: 'idle',
    currentTask: null,
    queueDepth: 1,
    successRate: 90,
    avgTaskTime: '1.5 hrs',
    tasksCompleted: 29,
    revisionRate: 15,
    avatar: '📝'
  },
  {
    id: 'design-agent',
    name: 'Canvas',
    type: 'Design Agent',
    description: 'UI/UX wireframes, mockups, and design system maintenance.',
    status: 'idle',
    currentTask: null,
    queueDepth: 0,
    successRate: 82,
    avgTaskTime: '2.8 hrs',
    tasksCompleted: 18,
    revisionRate: 22,
    avatar: '🎨'
  },
  {
    id: 'insights-agent',
    name: 'Oracle',
    type: 'Usage Insights Agent',
    description: 'Monitors deployed tool usage and generates optimization suggestions.',
    status: 'working',
    currentTask: 'Analyzing user interaction patterns on procurement dashboard',
    queueDepth: 2,
    successRate: 89,
    avgTaskTime: '2.0 hrs',
    tasksCompleted: 31,
    revisionRate: 10,
    avatar: '🔮'
  },
  {
    id: 'security-agent',
    name: 'Vault',
    type: 'Security Agent',
    description: 'Security scanning, vulnerability assessment, and compliance validation.',
    status: 'idle',
    currentTask: null,
    queueDepth: 0,
    successRate: 97,
    avgTaskTime: '0.8 hrs',
    tasksCompleted: 43,
    revisionRate: 3,
    avatar: '🔒'
  },
  {
    id: 'qa-agent',
    name: 'Inspector',
    type: 'QA Agent',
    description: 'End-to-end testing, regression testing, and acceptance criteria validation.',
    status: 'waiting',
    currentTask: 'Waiting for vendor scorecard review approval',
    queueDepth: 1,
    successRate: 93,
    avgTaskTime: '1.6 hrs',
    tasksCompleted: 55,
    revisionRate: 7,
    avatar: '🔎'
  },
  {
    id: 'deploy-agent',
    name: 'Shuttle',
    type: 'Deployment Agent',
    description: 'CI/CD pipeline management, staging deployments, and production releases.',
    status: 'idle',
    currentTask: null,
    queueDepth: 0,
    successRate: 99,
    avgTaskTime: '0.3 hrs',
    tasksCompleted: 27,
    revisionRate: 1,
    avatar: '🚀'
  }
];

// ============================================================
// KNOWLEDGE BASE
// ============================================================
export const knowledgeBase = [
  {
    id: 'kb-1',
    title: 'SAP MM Transaction Code Reference',
    topic: 'SAP',
    contributor: 'david',
    date: '2026-01-20',
    usageCount: 34,
    summary: 'Comprehensive reference for commonly used SAP MM transaction codes with context on when each is relevant for data extraction.'
  },
  {
    id: 'kb-2',
    title: 'Procurement Spend Classification Taxonomy',
    topic: 'Procurement',
    contributor: 'maria',
    date: '2026-02-05',
    usageCount: 28,
    summary: 'Standard taxonomy for classifying procurement spend into strategic, leverage, bottleneck, and non-critical categories.'
  },
  {
    id: 'kb-3',
    title: 'SAP RFC vs OData: When to Use Each',
    topic: 'Integration',
    contributor: 'david',
    date: '2026-01-25',
    usageCount: 22,
    summary: 'Decision framework for choosing between RFC and OData when connecting to SAP systems, with performance benchmarks.'
  },
  {
    id: 'kb-4',
    title: 'Supplier Risk Factor Weighting Guide',
    topic: 'Risk',
    contributor: 'maria',
    date: '2026-02-15',
    usageCount: 19,
    summary: 'Best practices for weighting supplier risk factors based on industry type, supplier criticality, and spend volume.'
  },
  {
    id: 'kb-5',
    title: 'Data Quality Patterns in SAP Extractions',
    topic: 'Data Quality',
    contributor: 'david',
    date: '2026-02-01',
    usageCount: 31,
    summary: 'Common data quality issues found in SAP extractions and automated remediation patterns.'
  },
  {
    id: 'kb-6',
    title: 'Mid-Market Manufacturer Engagement Playbook',
    topic: 'Delivery',
    contributor: 'james',
    date: '2026-01-15',
    usageCount: 15,
    summary: 'Step-by-step playbook for running engagements with mid-market manufacturing companies, including typical timelines and pitfalls.'
  },
  {
    id: 'kb-7',
    title: 'Anomaly Detection Tuning for Procurement',
    topic: 'Analytics',
    contributor: 'maria',
    date: '2026-03-01',
    usageCount: 12,
    summary: 'Guide to tuning sensitivity thresholds for procurement anomaly detection to minimize false positives while catching real issues.'
  },
  {
    id: 'kb-8',
    title: 'SAP BW Integration Patterns',
    topic: 'Integration',
    contributor: 'david',
    date: '2026-02-10',
    usageCount: 17,
    summary: 'Patterns for integrating with SAP BW/4HANA for historical data access alongside real-time SAP ECC connections.'
  },
  {
    id: 'kb-9',
    title: 'Customer Onboarding Checklist',
    topic: 'Delivery',
    contributor: 'james',
    date: '2026-01-12',
    usageCount: 8,
    summary: 'Standard checklist for onboarding new customers: access provisioning, SAP connection setup, initial data validation.'
  },
  {
    id: 'kb-10',
    title: 'Inventory Optimization Model Selection',
    topic: 'Analytics',
    contributor: 'maria',
    date: '2026-03-10',
    usageCount: 6,
    summary: 'Comparison of inventory optimization models (EOQ, Wagner-Whitin, ML-based) with guidance on when to apply each.'
  }
];

// ============================================================
// INVOICES
// ============================================================
export const invoices = [
  {
    id: 'inv-001',
    customer: 'meridian',
    period: 'January 2026',
    issueDate: '2026-02-01',
    dueDate: '2026-02-15',
    amount: 18500,
    status: 'paid',
    tier: 'Professional',
    itemsDelivered: 4,
    milestones: ['SAP Data Connector', 'Spend Category Classifier']
  },
  {
    id: 'inv-002',
    customer: 'meridian',
    period: 'February 2026',
    issueDate: '2026-03-01',
    dueDate: '2026-03-15',
    amount: 18500,
    status: 'paid',
    tier: 'Professional',
    itemsDelivered: 6,
    milestones: ['Vendor Performance Scorecard', 'Supplier Data Aggregator']
  },
  {
    id: 'inv-003',
    customer: 'meridian',
    period: 'March 2026',
    issueDate: '2026-04-01',
    dueDate: '2026-04-15',
    amount: 18500,
    status: 'pending',
    tier: 'Professional',
    itemsDelivered: 5,
    milestones: ['Procurement Dashboard UI (partial)']
  }
];

// ============================================================
// SELF-ASSESSMENT
// ============================================================
export const selfAssessment = {
  id: 'sa-001',
  company: 'meridian',
  submittedBy: 'sarah',
  submittedDate: '2026-01-05',
  conversation: [
    {
      type: 'ai',
      text: "Welcome to Axon Labs! I'll help you explore what we can build together. Tell me — what's the main challenge you're facing with your SAP data?"
    },
    {
      type: 'user',
      text: "We have SAP running across our manufacturing operations but we're drowning in data. Our procurement team spends hours pulling reports manually, and we have no way to spot trends or risks in our supplier relationships."
    },
    {
      type: 'ai',
      text: "That's a common pain point — and exactly the kind of thing we solve. Let me ask a few questions to understand your setup better. What SAP modules are you currently running?"
    },
    {
      type: 'user',
      text: 'We have MM for materials management, PP for production planning, FI for financials, and SD for sales and distribution.'
    },
    {
      type: 'ai',
      text: "Great setup — MM and PP together give us a rich dataset for procurement and inventory optimization. What does your current reporting look like? Are you using SAP's built-in reporting or something external?"
    },
    {
      type: 'user',
      text: "Mostly manual Excel exports from SAP. A few Crystal Reports that nobody trusts anymore. Our ops team pulls data every Monday morning and spends half the day building a procurement summary."
    },
    {
      type: 'ai',
      text: "Half a day every week on manual reporting — that's exactly the kind of waste we eliminate. What decisions do you wish you had better data for?"
    },
    {
      type: 'user',
      text: 'Which suppliers are actually reliable vs. just cheap. Where we\'re overspending. When to reorder materials before we run out. Basically, we want the data to tell us what to do instead of just showing us what happened.'
    },
    {
      type: 'ai',
      text: "\"Tell us what to do, not what happened\" — that's our philosophy exactly. How many people touch this procurement data today?"
    },
    {
      type: 'user',
      text: "About 12 people across procurement, operations, and finance. Plus our CFO Rachel wants a high-level view she can check weekly."
    },
    {
      type: 'ai',
      text: "Good to know — that's a manageable user base and actually ideal for a focused rollout. Last question: what's your timeline pressure? Is this a 'nice to have eventually' or a 'we need this yesterday'?"
    },
    {
      type: 'user',
      text: "We're heading into Q2 planning and our board wants to see data-driven procurement decisions. So ideally we'd have something meaningful within 2-3 months."
    }
  ],
  feasibility: {
    score: 87,
    complexity: 'Medium',
    timeline: '10-14 weeks',
    risks: [
      'SAP data quality may require cleanup phase',
      'Legacy Crystal Reports migration adds scope',
      'Multi-module integration increases complexity'
    ],
    recommendation: 'Strong fit for Axon Labs. This is a classic SAP procurement intelligence engagement with well-defined data sources and clear user needs. Recommended approach: phased delivery starting with procurement analytics, then adding supplier risk and inventory optimization.'
  }
};

// ============================================================
// DISCOVERY CALL
// ============================================================
export const discovery = {
  id: 'disc-001',
  date: '2026-01-08',
  duration: '45 min',
  participants: ['sarah', 'rachel', 'james', 'david'],
  agenda: {
    questionsToAnswer: [
      'What is the SAP version and hosting model (on-prem vs cloud)?',
      'Are there existing API connections or is all access via GUI?',
      'What is the data volume — transactions per day/month?',
      'Who are the key stakeholders beyond Sarah and Rachel?',
      'Are there compliance or security constraints for data access?'
    ],
    decisionsToMake: [
      'Real-time vs. batch data extraction approach',
      'Start with procurement analytics or supplier risk first?',
      'Dashboard delivery: embedded in SAP or standalone web app?',
      'User authentication: SSO integration or standalone?'
    ],
    mustHaveSuggestions: [
      'Automated daily data sync from SAP MM',
      'Role-based access control for different user groups',
      'Procurement spend categorization and trend analysis',
      'Supplier performance scoring with risk indicators'
    ],
    niceToHaveSuggestions: [
      'Natural language query interface ("What did we spend on steel last quarter?")',
      'Slack/Teams integration for alerts',
      'Mobile-friendly dashboard for CFO',
      'Custom KPI builder'
    ]
  },
  transcript: [
    { speaker: 'james', text: "Thanks for joining, Sarah and Rachel. We've reviewed your self-assessment and have a solid picture of what you need. Today we want to fill in a few gaps and align on approach." },
    { speaker: 'sarah', text: "Sounds good. We're excited to get started." },
    { speaker: 'david', text: "First question — what version of SAP are you running, and is it on-premises or cloud?" },
    { speaker: 'sarah', text: "ECC 6.0, on-premises. We've been talking about S/4HANA migration but that's at least 18 months out." },
    { speaker: 'david', text: "Perfect — ECC 6.0 is very well supported. We'll use RFC connections for real-time data and batch extraction for historical analysis. No dependency on S/4HANA." },
    { speaker: 'james', text: "Rachel, from a business perspective, which would be more valuable first — seeing procurement spend patterns or supplier risk analysis?" },
    { speaker: 'rachel', text: "Procurement spend, definitely. We're renegotiating three major supplier contracts in Q2 and I need data to back our position." },
    { speaker: 'james', text: "That gives us a clear priority. We'll start with procurement analytics as Sprint 1-3, then layer in supplier risk scoring." },
    { speaker: 'david', text: "One more thing — are there any data access restrictions we should know about? InfoSec approvals needed?" },
    { speaker: 'sarah', text: "Yes, our IT security team will need to approve the RFC connection. I'll introduce you to Tom in IT. Usually takes about a week for approval." }
  ],
  contextReport: {
    summary: 'Meridian Partners runs SAP ECC 6.0 on-premises with MM, PP, FI, and SD modules. Primary need is procurement intelligence — spend analytics and supplier risk scoring — driven by Q2 contract renegotiations. 12 end users across procurement, operations, and finance, plus executive dashboard for CFO. Standalone web application preferred over SAP-embedded. RFC-based data connection recommended.',
    decisions: [
      'Start with procurement analytics (Sprint 1-3), then supplier risk (Sprint 4-6)',
      'Standalone web app, not embedded in SAP',
      'RFC connection for data extraction',
      'Daily batch sync for historical, near-real-time for active queries'
    ],
    openQuestions: [
      'IT security approval timeline for RFC access',
      'Exact data volume and historical depth needed',
      'SSO requirements and identity provider'
    ],
    risks: [
      'IT security approval could delay data access by 1-2 weeks',
      'ECC 6.0 to S/4HANA migration in 18 months — design for portability',
      'Crystal Reports migration expectations should be managed separately'
    ]
  },
  completeness: 78
};

// ============================================================
// PROPOSAL
// ============================================================
export const proposal = {
  id: 'prop-001',
  title: 'SAP Intelligence Platform for Meridian Partners',
  status: 'approved',
  sentDate: '2026-01-10',
  approvedDate: '2026-01-12',
  sections: {
    executiveSummary: 'Axon Labs will build a custom SAP Intelligence Platform for Meridian Partners, transforming raw SAP data into actionable procurement insights and supplier risk intelligence. The platform will serve 12+ users across procurement, operations, and finance, with an executive dashboard for C-suite visibility. Delivered in phased sprints over 12 weeks, starting with procurement analytics and expanding to supplier risk, inventory optimization, and executive reporting.',
    approach: 'Phased delivery using Axon\'s AI-native methodology. Each sprint delivers working, testable features. AI agents handle data extraction, analysis model training, and documentation while human experts oversee architecture, review outputs, and manage client relationships. All deliverables go through human review before client delivery.',
    timeline: [
      { phase: 'Foundation', weeks: '1-2', description: 'SAP connection, data pipeline, initial data validation' },
      { phase: 'Procurement Analytics', weeks: '3-5', description: 'Spend classification, vendor scoring, anomaly detection' },
      { phase: 'Supplier Risk', weeks: '6-8', description: 'Risk scoring algorithm, supplier dashboard, alert system' },
      { phase: 'Inventory & Executive', weeks: '9-11', description: 'Demand forecasting, inventory optimization, executive dashboard' },
      { phase: 'Polish & Handoff', weeks: '12', description: 'Performance tuning, documentation, training, go-live support' }
    ],
    pricing: {
      tier: 'Professional',
      monthlyRate: 18500,
      concurrency: 5,
      estimatedDuration: '12 weeks',
      totalEstimate: 55500,
      includes: [
        'Up to 5 concurrent workstreams',
        'Dedicated delivery lead',
        'Weekly progress reviews',
        'AI agent fleet (Research, Coding, Testing, Data, Docs)',
        'Human review on all deliverables',
        'Knowledge base access'
      ]
    },
    team: [
      { user: 'james', role: 'Account Manager', responsibility: 'Client relationship, commercial, escalations' },
      { user: 'maria', role: 'Delivery Lead', responsibility: 'Sprint planning, quality assurance, agent oversight' },
      { user: 'david', role: 'SAP Architect', responsibility: 'Technical architecture, SAP integration, data modeling' },
      { user: 'alex', role: 'Platform Lead', responsibility: 'Infrastructure, deployment, monitoring' }
    ],
    risks: [
      { risk: 'SAP RFC access delay', likelihood: 'Medium', impact: 'Could delay Sprint 1 by 1-2 weeks', mitigation: 'Early engagement with IT security; parallel work on non-SAP components' },
      { risk: 'Data quality issues', likelihood: 'High', impact: 'May require additional cleanup sprint', mitigation: 'Data quality assessment in Week 1; automated validation rules' },
      { risk: 'Scope expansion from Crystal Reports migration', likelihood: 'Medium', impact: 'Could add 2-3 weeks', mitigation: 'Explicitly out of scope; can be addressed as Phase 2 add-on' },
      { risk: 'S/4HANA migration overlap', likelihood: 'Low', impact: 'Architecture rework needed', mitigation: 'Design platform with abstraction layer for SAP version portability' }
    ]
  }
};

// ============================================================
// BLOG ARTICLES
// ============================================================
export const articles = [
  {
    id: 'blog-1',
    title: 'Why Your SAP Data Is a Gold Mine You\'re Not Mining',
    excerpt: 'Most manufacturers are sitting on years of SAP transaction data that could drive better procurement, inventory, and supplier decisions — if they had the right tools to analyze it.',
    topic: 'SAP Strategy',
    persona: 'CFO',
    complexity: 'Beginner',
    readTime: '5 min',
    date: '2025-12-15'
  },
  {
    id: 'blog-2',
    title: 'The AI-Native Consultancy: Why 6 People Beat 40',
    excerpt: 'Traditional consultancies throw bodies at problems. AI-native consultancies throw intelligence. Here\'s how a small team with AI agents delivers better outcomes at better economics.',
    topic: 'AI Operations',
    persona: 'Executive',
    complexity: 'Intermediate',
    readTime: '8 min',
    date: '2026-01-10'
  },
  {
    id: 'blog-3',
    title: 'Procurement Analytics: From "What Happened" to "What Should We Do"',
    excerpt: 'The shift from descriptive to prescriptive analytics in procurement. Real patterns from our engagements that turned reactive buying into strategic sourcing.',
    topic: 'Procurement',
    persona: 'Ops Manager',
    complexity: 'Intermediate',
    readTime: '7 min',
    date: '2026-02-01'
  },
  {
    id: 'blog-4',
    title: 'Supplier Risk in 2026: What Your Scorecards Are Missing',
    excerpt: 'Traditional supplier scorecards measure lagging indicators. Modern risk engines combine real-time delivery data with financial signals and market intelligence.',
    topic: 'Risk Management',
    persona: 'Ops Manager',
    complexity: 'Advanced',
    readTime: '10 min',
    date: '2026-02-20'
  },
  {
    id: 'blog-5',
    title: 'How to Evaluate an AI Partner (Without Getting Burned)',
    excerpt: 'A practical framework for manufacturers evaluating AI consultancies. What questions to ask, what red flags to watch for, and how to tell real AI from AI-washed services.',
    topic: 'Buyer Guide',
    persona: 'IT Lead',
    complexity: 'Beginner',
    readTime: '6 min',
    date: '2026-03-05'
  }
];

// ============================================================
// CASE STUDIES
// ============================================================
export const caseStudies = [
  {
    id: 'cs-1',
    title: 'Apex Manufacturing: 37% Reduction in Procurement Waste',
    company: 'Apex Manufacturing',
    industry: 'Industrial Equipment',
    challenge: 'Apex was spending $2.3M annually on off-contract purchases and had no visibility into procurement patterns across their 4 SAP instances.',
    solution: 'Deployed AI-driven spend analytics across all SAP instances, unified vendor management dashboard, and automated anomaly detection for off-contract purchases.',
    outcomes: [
      { metric: '37%', label: 'Reduction in procurement waste' },
      { metric: '$850K', label: 'Annual savings identified' },
      { metric: '4 hrs', label: 'Saved per week in manual reporting' },
      { metric: '12 weeks', label: 'From kickoff to full deployment' }
    ],
    timeline: '12 weeks',
    tier: 'Professional'
  },
  {
    id: 'cs-2',
    title: 'Sterling Corp: Supplier Risk Prevented $1.2M Loss',
    company: 'Sterling Corp',
    industry: 'Automotive Parts',
    challenge: 'Sterling had a key supplier go bankrupt with no warning, causing a 3-week production halt. They needed early warning for supplier risks.',
    solution: 'Built a multi-factor supplier risk engine combining SAP delivery data, Dun & Bradstreet financial health scores, news sentiment analysis, and concentration risk metrics.',
    outcomes: [
      { metric: '3', label: 'At-risk suppliers identified early' },
      { metric: '$1.2M', label: 'Potential loss prevented' },
      { metric: '94%', label: 'Risk prediction accuracy' },
      { metric: '8 weeks', label: 'Time to live risk scoring' }
    ],
    timeline: '10 weeks',
    tier: 'Enterprise'
  },
  {
    id: 'cs-3',
    title: 'Bayview Foods: Inventory Turns Improved 28%',
    company: 'Bayview Foods',
    industry: 'Food Manufacturing',
    challenge: 'Bayview had $4.5M in dead stock and chronic stockouts on key ingredients, driven by inaccurate demand forecasting in their SAP PP module.',
    solution: 'ML-based demand forecasting integrated with SAP PP, dynamic reorder point optimization, and an inventory health dashboard with automated alerts.',
    outcomes: [
      { metric: '28%', label: 'Improvement in inventory turns' },
      { metric: '62%', label: 'Reduction in stockout incidents' },
      { metric: '$1.8M', label: 'Dead stock reduction' },
      { metric: '14 weeks', label: 'Full implementation' }
    ],
    timeline: '14 weeks',
    tier: 'Professional'
  }
];

// ============================================================
// ACTIVITY FEED (timeline-aware events)
// ============================================================
export const activityFeed = [
  { id: 'act-1', date: '2026-01-05', type: 'submission', text: 'Meridian Partners submitted self-assessment', user: 'sarah', visibleFrom: 'day1' },
  { id: 'act-2', date: '2026-01-06', type: 'qualification', text: 'AI pre-qualification completed — Fit Score: 87', user: null, visibleFrom: 'day1' },
  { id: 'act-3', date: '2026-01-07', type: 'review', text: 'James reviewed and approved pre-qualification', user: 'james', visibleFrom: 'day3' },
  { id: 'act-4', date: '2026-01-08', type: 'call', text: 'Discovery call completed with Sarah and Rachel', user: 'james', visibleFrom: 'day3' },
  { id: 'act-5', date: '2026-01-10', type: 'proposal', text: 'Proposal sent to Meridian Partners', user: 'james', visibleFrom: 'day5' },
  { id: 'act-6', date: '2026-01-11', type: 'question', text: 'Sarah asked about data security measures', user: 'sarah', visibleFrom: 'day5' },
  { id: 'act-7', date: '2026-01-12', type: 'approval', text: 'Proposal approved by Meridian Partners', user: 'sarah', visibleFrom: 'day7' },
  { id: 'act-8', date: '2026-01-14', type: 'sprint', text: 'Sprint 1 kicked off — SAP Data Connection', user: 'maria', visibleFrom: 'week2' },
  { id: 'act-9', date: '2026-01-20', type: 'delivery', text: 'SAP RFC connection established and validated', user: 'david', visibleFrom: 'week2' },
  { id: 'act-10', date: '2026-01-28', type: 'delivery', text: 'Spend Category Classifier deployed to staging', user: 'maria', visibleFrom: 'week4' },
  { id: 'act-11', date: '2026-02-03', type: 'milestone', text: 'Milestone 1 completed: SAP Data Pipeline + Spend Analytics', user: 'maria', visibleFrom: 'week4' },
  { id: 'act-12', date: '2026-02-10', type: 'delivery', text: 'Vendor Performance Scorecard in human review', user: 'david', visibleFrom: 'week4' },
  { id: 'act-13', date: '2026-02-18', type: 'approval', text: 'Sarah approved Vendor Scorecard deliverable', user: 'sarah', visibleFrom: 'week6' },
  { id: 'act-14', date: '2026-02-25', type: 'insight', text: 'AI insight: Users spending 3x more time on supplier risk view', user: null, visibleFrom: 'week6' },
  { id: 'act-15', date: '2026-03-15', type: 'milestone', text: 'Milestone 2 completed: Supplier Risk Engine MVP', user: 'maria', visibleFrom: 'week12' },
  { id: 'act-16', date: '2026-03-20', type: 'suggestion', text: 'Usage-driven suggestion: Add CSV export to procurement dashboard', user: null, visibleFrom: 'week12' }
];
