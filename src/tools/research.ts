export interface ResearchRecord {
  id: string;
  title: string;
  topics: string[];
  factualSummary: string;
  technicalSpecs: Record<string, string>;
}

export interface ResearchToolResult {
  query: string;
  matchedRecords: ResearchRecord[];
  extractedContext: string;
}

const KNOWLEDGE_BASE: ResearchRecord[] = [
  {
    id: 'kb-kafka',
    title: 'Apache Kafka Architecture & Log Storage Semantics',
    topics: ['kafka', 'event-driven', 'order', 'streaming', 'partition', 'broker'],
    factualSummary:
      'Distributed append-only commit log. Partitions guarantee strict ordering per key. Zero-copy page cache reads yield high throughput (>100k msg/sec/core). Replayable message retention decoupled from consumption state.',
    technicalSpecs: {
      'Storage Model': 'Sequential partitioned disk log',
      'Throughput Profile': 'High (>1M/sec cluster)',
      'Ordering Guarantee': 'Strict per partition key',
      'Delivery Semantics': 'At-least-once (default) / Idempotent producer',
    },
  },
  {
    id: 'kb-rabbitmq',
    title: 'RabbitMQ AMQP Protocol & Queue Mechanics',
    topics: ['rabbitmq', 'amqp', 'order', 'queue', 'routing', 'broker'],
    factualSummary:
      'In-memory Erlang-actor message broker. Flexible routing via topic, direct, fanout, and headers exchanges. Messages deleted after consumer acknowledgment. Supports dead-letter exchanges and priority queues.',
    technicalSpecs: {
      'Storage Model': 'In-memory index with disk paging',
      'Throughput Profile': 'Medium (20k-50k msg/sec)',
      'Ordering Guarantee': 'Strict FIFO on single consumer; loose with competing consumers',
      'Delivery Semantics': 'At-least-once via manual/automatic ACK',
    },
  },
  {
    id: 'kb-cf-agents',
    title: 'Cloudflare Agents & Durable Object Primitives',
    topics: ['cloudflare', 'agents', 'durable objects', 'workflows', 'orchestration', 'edge'],
    factualSummary:
      'Single-tenant stateful coordination actors backed by embedded SQLite in V8 isolates. Low-latency WebSocket hibernation. Max CPU execution time is 30s per invocation; suitable for real-time collaboration and session workflows.',
    technicalSpecs: {
      'Persistence': 'Collocated SQLite per DO',
      'Execution Model': 'Single-threaded event loop actor',
      'Max CPU Time': '30s/request',
      'Networking': 'WebSocket hibernation + HTTP RPC',
    },
  },
  {
    id: 'kb-batch-api',
    title: 'Batch Processing & High-Volume Ingestion Engineering',
    topics: ['api', '500,000', 'records', 'batch', 'degrades', 'slow', 'bottleneck'],
    factualSummary:
      'Ingesting 500k records synchronously triggers event loop starvation, V8 heap bloat, and database connection pool exhaustion. Standard mitigation decouples ingestion via object storage staging, followed by chunked worker queues (1k items/batch).',
    technicalSpecs: {
      'Bottleneck 1': 'Unpaginated JSON deserialization memory spikes',
      'Bottleneck 2': 'DB connection pool exhaustion during long-lived transactions',
      'Mitigation': 'Staging + decoupled asynchronous worker queue with backpressure',
    },
  },
];

export async function executeResearchTool(query: string): Promise<ResearchToolResult> {
  const normalized = query.toLowerCase();
  const tokens = normalized.split(/\W+/).filter((t) => t.length > 2);

  const matched = KNOWLEDGE_BASE.filter((record) => {
    const topicMatch = record.topics.some((t) => normalized.includes(t));
    const tokenMatch = tokens.some((t) => record.title.toLowerCase().includes(t) || record.factualSummary.toLowerCase().includes(t));
    return topicMatch || tokenMatch;
  });

  const recordsToUse = matched.length > 0 ? matched : [
    {
      id: 'kb-synthesized',
      title: `Technical Evidence Profile: ${query.slice(0, 35)}`,
      topics: ['general'],
      factualSummary: `Architectural constraints, failure scenarios, and latency/throughput characteristics for: "${query}".`,
      technicalSpecs: {
        'Domain': 'Distributed Systems / Application Architecture',
        'Scope': 'Performance and reliability boundaries',
      },
    },
  ];

  const extractedContext = recordsToUse
    .map(
      (r) =>
        `### ${r.title}\nSummary: ${r.factualSummary}\nSpecs: ${JSON.stringify(r.technicalSpecs)}`
    )
    .join('\n\n');

  return {
    query,
    matchedRecords: recordsToUse,
    extractedContext,
  };
}