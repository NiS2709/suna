"""
Step 9: Nexus Admin API Key
"""

from setup.steps.base import BaseStep, StepResult
from setup.utils.secrets import generate_admin_api_key


class NexusStep(BaseStep):
    """Auto-generate Nexus admin API key."""

    name = "nexus"
    display_name = "Nexus Admin API Key"
    order = 9
    required = True
    depends_on = ["requirements"]

    def run(self) -> StepResult:
        # Always generate a new key (overwrite existing if any)
        self.info("Generating a secure admin API key for Nexus administrative functions...")

        self.config.nexus.NEXUS_ADMIN_API_KEY = generate_admin_api_key()

        self.success("Nexus admin API key generated.")
        self.success("Nexus admin configuration saved.")

        return StepResult.ok(
            "Nexus admin key generated",
            {"nexus": self.config.nexus.model_dump()},
        )

    def get_config_keys(self):
        return ["NEXUS_ADMIN_API_KEY"]

    def is_complete(self) -> bool:
        return bool(self.config.nexus.NEXUS_ADMIN_API_KEY)
