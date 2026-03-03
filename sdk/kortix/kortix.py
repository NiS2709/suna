from .api import agents, threads
from .agent import NexusAgent
from .thread import NexusThread
from .tools import AgentPressTools, MCPTools


class Nexus:
    def __init__(self, api_key: str, api_url="https://api.nexus.com/v1"):
        self._agents_client = agents.create_agents_client(api_url, api_key)
        self._threads_client = threads.create_threads_client(api_url, api_key)

        self.Agent = NexusAgent(self._agents_client)
        self.Thread = NexusThread(self._threads_client)
