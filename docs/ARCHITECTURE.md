# MissionForge — Architecture Specification

MissionForge is a Cloudflare-native autonomous AI engineering workbench designed to turn ambiguous systems engineering objectives into evidence-backed architectural recommendations.

## System Architecture Diagram

```mermaid
flowchart TD
    subgraph Client ["Web Client (React / Vite / Tailwind)"]
        UI[Engineering Workbench UI]
        TB[Task Board]
        TL[Execution Timeline]
        RV[Report View]
    end

    subgraph Edge ["Cloudflare Global Network"]
        Router[Worker Entrypoint: routeAgentRequest]
        DO[MissionAgent: Durable Object SQLite]
        KB[Internal Research Corpus Tool]
        AI[Workers AI: Llama 3.3 70B]
        WF[Cloudflare Workflows: Step.do Checkpoints]
    end

    UI <-->|WebSocket State Sync| Router
    Router --> DO

    DO -->|1. Plan Mission| AI
    DO -->|2. Query Evidence| KB
    DO -->|3. Extract Findings| AI
    DO -->|4. Analyze Trade-offs| AI
    DO -->|5. Synthesize Report| AI

    DO -.->|Durable Execution Fallback| WF
    DO -->|Persistent SQLite Commit| DO

    DO -->|Real-Time Event Stream| TL
    DO -->|State Synchronization| TB
    DO -->|Final Artifacts| RV

Core Primitives
1. Cloudflare Agents SDK (@cloudflare/agents)
Bridges stateful Durable Objects directly to the React frontend via bidirectional WebSockets.

Client automatically reflects server state mutations (this.setState) without manual polling.

2. Durable Objects with SQLite (new_sqlite_classes)
Single-tenant actor instances provisioned per mission (mission-[id]).

Backed by embedded SQLite (cf_agents_state) ensuring instant durability, session isolation, and recovery across browser refreshes.

3. Workers AI (@cf/meta/llama-3.3-70b-instruct-fp8-fast)
Runs 70-billion-parameter Llama 3.3 models on Cloudflare's serverless GPU infrastructure.

Features automatic fallback to @cf/meta/llama-3.1-8b-instruct under high network congestion.

4. Technical Research Tool (src/tools/research.ts)
Decouples factual data extraction from LLM reasoning.

Queries structured technical benchmarks, storage semantics, and architectural limits.


---

##### 3. `docs/DECISIONS.md`
Create `docs/DECISIONS.md` explaining the key engineering trade-offs:

```markdown
# Architectural Decision Records (ADR)

## ADR 1: Durable Objects with SQLite over External Databases
- **Context**: The challenge requires state persistence between interactions.
- **Decision**: Used Cloudflare Agents backed by Durable Object SQLite (`new_sqlite_classes`).
- **Rationale**: Eliminates external database dependencies (e.g. Supabase, Neon), eliminates connection pool exhaustion, and colocates compute with storage in sub-millisecond proximity.

## ADR 2: Sequential Multi-Agent Specialization
- **Context**: Single LLM prompts often hallucinate conversational pleasantries and collapse trade-offs.
- **Decision**: Separated the pipeline into four dedicated logical roles:
  1. **Manager**: Mission scope and task decomposition.
  2. **Researcher**: Factual evidence extraction and confidence scoring.
  3. **Analyst**: Multi-dimensional systems trade-off analysis.
  4. **Reporter**: Executive synthesis and actionable decision matrices.
- **Rationale**: Strict task boundaries produce higher-signal outputs while preventing context dilution.

## ADR 3: Deterministic Seeded Research Tool over Live Browser Scraping
- **Context**: The application must run deterministically during hiring evaluations without external API keys or flaky web scraping.
- **Decision**: Created `src/tools/research.ts` containing concrete architectural benchmarks (Kafka, RabbitMQ, Cloudflare Agents, Batch APIs) alongside dynamic query fallback.
- **Rationale**: Guarantees evaluation reliability with zero external service setup.