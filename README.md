<div align="center">

# Nexus

**Your Autonomous AI Partner**

Build, manage, and deploy sophisticated AI agents that work for you. Create powerful agents that act autonomously on your behalf.

[![GitHub Repo stars](https://img.shields.io/github/stars/NiS2709/suna)](https://github.com/NiS2709/suna)
[![Issues](https://img.shields.io/github/issues/NiS2709/suna)](https://github.com/NiS2709/suna/labels/bug)

![Nexus Banner](apps/frontend/public/banner.png)
</div>




## 🌟 What Makes Nexus Special

### 🤖 Includes Nexus Agent – Flagship Generalist AI Worker
Meet Nexus Agent, our showcase agent that demonstrates the full power of the Nexus platform. Through natural conversation, Nexus Agent handles research, data analysis, browser automation, file management, and complex workflows – showing you what's possible when you build with Nexus.

### 🔧 Build Custom Nexus Agent-Type Agents
Create your own specialized agents tailored to specific domains, workflows, or business needs. Whether you need agents for customer service, data processing, content creation, or industry-specific tasks, Nexus provides the infrastructure and tools to build, deploy, and scale them.

### 🚀 Complete Platform Capabilities
- **Browser Automation**: Navigate websites, extract data, fill forms, automate web workflows
- **File Management**: Create, edit, and organize documents, spreadsheets, presentations, code
- **Web Intelligence**: Crawling, search capabilities, data extraction and synthesis
- **System Operations**: Command-line execution, system administration, DevOps tasks
- **API Integrations**: Connect with external services and automate cross-platform workflows
- **Agent Builder**: Visual tools to configure, customize, and deploy agents

## 📋 Table of Contents

- [🌟 What Makes Nexus Special](#-what-makes-nexus-special)
- [🎯 Agent Examples & Use Cases](#-agent-examples--use-cases)
- [🏗️ Platform Architecture](#️-platform-architecture)
- [🚀 Quick Start](#-quick-start)
- [🏠 Self-Hosting](#-self-hosting)
- [🤝 Contributing](#-contributing)
- [📄 License](LICENSE)

## 🎯 Agent Examples & Use Cases

### Nexus Agent - Your Generalist AI Worker

Nexus Agent demonstrates the full capabilities of the Nexus platform as a versatile AI worker that can:

**🔍 Research & Analysis**
- Conduct comprehensive web research across multiple sources
- Analyze documents, reports, and datasets
- Synthesize information and create detailed summaries
- Market research and competitive intelligence

**🌐 Browser Automation**
- Navigate complex websites and web applications
- Extract data from multiple pages automatically
- Fill forms and submit information
- Automate repetitive web-based workflows

**📁 File & Document Management**
- Create and edit documents, spreadsheets, presentations
- Organize and structure file systems
- Convert between different file formats
- Generate reports and documentation

**📊 Data Processing & Analysis**
- Clean and transform datasets from various sources
- Perform statistical analysis and create visualizations
- Monitor KPIs and generate insights
- Integrate data from multiple APIs and databases

**⚙️ System Administration**
- Execute command-line operations safely
- Manage system configurations and deployments
- Automate DevOps workflows
- Monitor system health and performance

### Build Your Own Specialized Agents

The Nexus platform enables you to create agents tailored to specific needs:

**🎧 Customer Service Agents**
- Handle support tickets and FAQ responses
- Manage user onboarding and training
- Escalate complex issues to human agents
- Track customer satisfaction and feedback

**✍️ Content Creation Agents**
- Generate marketing copy and social media posts
- Create technical documentation and tutorials
- Develop educational content and training materials
- Maintain content calendars and publishing schedules

**📈 Sales & Marketing Agents**
- Qualify leads and manage CRM systems
- Schedule meetings and follow up with prospects
- Create personalized outreach campaigns
- Generate sales reports and forecasts

**🔬 Research & Development Agents**
- Conduct academic and scientific research
- Monitor industry trends and innovations
- Analyze patents and competitive landscapes
- Generate research reports and recommendations

**🏭 Industry-Specific Agents**
- Healthcare: Patient data analysis, appointment scheduling
- Finance: Risk assessment, compliance monitoring
- Legal: Document review, case research
- Education: Curriculum development, student assessment

Each agent can be configured with custom tools, workflows, knowledge bases, and integrations specific to your requirements.

## 🏗️ Platform Architecture

![Architecture Diagram](docs/images/diagram.png)

Nexus consists of four main components that work together to provide a complete AI agent development platform:

### 🔧 Backend API
Python/FastAPI service that powers the agent platform with REST endpoints, thread management, agent orchestration, and LLM integration with Anthropic, OpenAI, and others via LiteLLM. Includes agent builder tools, workflow management, and extensible tool system.

### 🖥️ Frontend Dashboard
Next.js/React application providing a comprehensive agent management interface with chat interfaces, agent configuration dashboards, workflow builders, monitoring tools, and deployment controls.

### 🐳 Agent Runtime
Isolated Docker execution environments for each agent instance featuring browser automation, code interpreter, file system access, tool integration, security sandboxing, and scalable agent deployment.

### 🗄️ Database & Storage
Supabase-powered data layer handling authentication, user management, agent configurations, conversation history, file storage, workflow state, analytics, and real-time subscriptions for live agent monitoring.

## 🚀 Quick Start

Get your Nexus platform running in minutes with our automated setup wizard:

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/NiS2709/suna.git
cd suna
```

### 2️⃣ Run the Setup Wizard
```bash
python setup.py
```
The wizard will guide you through configuring all required services with progress saving, so you can resume if interrupted.

### 3️⃣ Manage the Platform
```bash
python start.py          # Interactive start/stop
python start.py start    # Start all services
python start.py stop     # Stop all services
python start.py status   # Show service status
python start.py restart  # Restart all services
```

The service manager automatically detects your setup method (Docker or Manual) and manages services accordingly.

### 📋 Viewing Realtime Logs

**Manual Setup (native processes):**
```bash
# View both backend and frontend logs
tail -f backend.log frontend.log

# View backend only
tail -f backend.log

# View frontend only
tail -f frontend.log
```

**Docker Setup:**
```bash
# View all service logs
docker compose logs -f

# View specific service
docker compose logs -f backend
docker compose logs -f frontend
```

### 4️⃣ Add More API Keys (Optional)
After initial setup, you can run `python setup.py` again to:
- **Add/Update API Keys** - Configure additional LLM providers (Anthropic, OpenAI, Groq, etc.), search APIs (Tavily, Firecrawl, etc.), and other integrations
- **Clear setup and start fresh** - Remove all configuration and start over

That's it! Your Nexus platform will be running with Nexus Agent ready to assist you.

---

<div align="center">

**Ready to build your first AI agent?**

[Get Started](#-quick-start)

</div>
