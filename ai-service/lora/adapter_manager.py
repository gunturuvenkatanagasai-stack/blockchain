from typing import Optional, Dict

class LoRAAdapterManager:
    def __init__(self):
        self.active_adapters: Dict[str, str] = {
            "dt_marcus_algo": "adapters/marcus_vance_v2",
            "twin_1": "adapters/evelyn_vance_v1",
            "twin_2": "adapters/marcus_sterling_v1",
            "twin_3": "adapters/sarah_chen_v1"
        }

    def get_adapter_path(self, digital_human_id: str) -> Optional[str]:
        return self.active_adapters.get(digital_human_id, "adapters/default_expert")

    def load_and_switch(self, digital_human_id: str) -> str:
        path = self.get_adapter_path(digital_human_id)
        # Returns current active loaded adapter tag
        return f"Loaded LoRA PEFT adapter for {digital_human_id} from {path}"

adapter_manager = LoRAAdapterManager()
