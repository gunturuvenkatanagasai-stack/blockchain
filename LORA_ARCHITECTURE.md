# LoRA / PEFT (PARAMETER-EFFICIENT FINE-TUNING) ARCHITECTURE

## Separation of Concerns

```text
┌─────────────────────────────────────────────────────────┐
│ RAG = WHAT THE EXPERT KNOWS (Factual Knowledge Base)    │
├─────────────────────────────────────────────────────────┤
│ LoRA = HOW THE EXPERT RESPONDS (Tone, Style, Persona)   │
└─────────────────────────────────────────────────────────┘
```

The system never fine-tunes a full multi-billion parameter base model per expert. Instead, it maintains a single frozen Base Model and loads lightweight LoRA adapter weights dynamically per request.

---

## Dataset Generation Pipeline

1. Expert uploads approved Q&A examples or domain playbooks.
2. `dataset_builder.py` parses examples into structured OpenAI/HuggingFace format:
```json
{
  "messages": [
    {"role": "user", "content": "Explain recursion simply."},
    {"role": "assistant", "content": "Recursion is like opening a Russian nesting doll..."}
  ]
}
```
3. Expert reviews and approves dataset before queuing training job.

---

## LoRA Hyperparameters & Config

```python
peft_config = LoraConfig(
    task_type=TaskType.CAUSAL_LM,
    r=16,                         # LoRA Rank
    lora_alpha=32,                # Scaling factor
    lora_dropout=0.05,            # Dropout probability
    bias="none",
    target_modules=["q_proj", "v_proj"]  # Target attention matrices
)
```

---

## Dynamic Adapter Switching in PyTorch/PEFT

```python
class AdapterManager:
    def __init__(self, base_model):
        self.base_model = base_model
        self.active_adapter = None

    def switch_adapter(self, adapter_path: str, adapter_name: str):
        if self.active_adapter == adapter_name:
            return
        self.base_model.load_adapter(adapter_path, adapter_name=adapter_name)
        self.base_model.set_adapter(adapter_name)
        self.active_adapter = adapter_name
```
