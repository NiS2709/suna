/**
 * Site metadata configuration - SIMPLE AND WORKING
 */

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const siteMetadata = {
  name: 'Nexus',
  title: 'Nexus: Your Autonomous AI Partner',
  description: 'Built for complex tasks, designed for everything. The ultimate AI assistant that handles it all—from simple requests to mega-complex projects.',
  url: baseUrl,
  keywords: 'Nexus, AI Partner, Autonomous AI Agent, AI Automation, AI Workflow Automation, AI Assistant, Task Automation',
};
