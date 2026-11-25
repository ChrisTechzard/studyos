# StudyOS Domain Modules

This directory defines **domain boundaries** for the modular monolith.

During the ground stage, modules are placeholders only. As features are implemented:

- Keep domain logic inside the owning module
- Expose clear interfaces/types for cross-module use
- Avoid circular dependencies
- Add tests close to module behavior
- Extract to separate services/workers only when real scale/reliability needs justify it
