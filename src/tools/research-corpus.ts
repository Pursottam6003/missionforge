import  type { Source } from '../types/mission';

export interface CorpusDocument {
  id: string;
  title: string;
  topics: string[];
  snippet: string;
  metrics?: Record<string, string>;
}

export const SEEDED_CORPUS: CorpusDocument[] = [
  // ── 1. Kafka vs RabbitMQ ──────────────────────────────────────────────────
  {
    id: 'src-kafka-bench',
    title: 'Apache Kafka 3.6 Partition Throughput & Replay Benchmark',
    topics: ['kafka', 'rabbitmq', 'event-driven', 'order processing', 'throughput'],
    snippet:
      'Kafka achieves 100,000+ msg/sec per partition using sequential disk I/O, OS page cache, and zero-copy sendfile syscalls. Message retention is immutable by default (7 days). Consumer groups manage their own offsets, allowing concurrent independent replay without broker state overhead.',
    metrics: { 'p99 Latency': '2.5ms', 'Max Throughput': '1.2M events/sec (cluster)', 'Ordering': 'Strict per-partition' },
  },
  {
    id: 'src-rabbitmq-amqp',
    title: 'RabbitMQ 3.12 AMQP Routing & Dead-Letter Performance Profile',
    topics: ['rabbitmq', 'kafka', 'amqp', 'order processing', 'routing'],
    snippet:
      'RabbitMQ processes messages in-memory using Erlang actor processes with support for complex topic exchanges, direct routing keys, and dead-letter exchanges (DLX). Delivery guarantees rely on consumer acknowledgments. Throughput degrades under deep backlogs due to disk paging overhead.',
    metrics: { 'p99 Latency': '0.8ms (in-memory)', 'Max Throughput': '45k events/sec', 'Ordering': 'Strict FIFO single consumer' },
  },

  // ── 2. Cloudflare Agents vs Traditional Orchestration ─────────────────────
  {
    id: 'src-cf-agents-runtime',
    title: 'Cloudflare Agents & Durable Objects Architecture Whitepaper',
    topics: ['cloudflare agents', 'temporal', 'orchestration', 'durable objects', 'workflows'],
    snippet:
      'Cloudflare Agents utilize single-tenant Durable Objects running V8 isolates with collocated SQLite storage. State updates commit locally in sub-millisecond intervals. WebSockets maintain hibernation to minimize CPU billing. Maximum continuous execution time per event is 30 seconds of CPU time.',
    metrics: { 'Storage Latency': '<1ms (SQLite collocated)', 'Max CPU Time': '30s/request', 'Concurrency': 'Single-threaded DO actor' },
  },
  {
    id: 'src-temporal-comparison',
    title: 'Temporal.io Distributed Execution & Replay Engine Specs',
    topics: ['temporal', 'cloudflare agents', 'celery', 'orchestration', 'backend'],
    snippet:
      'Temporal provides durable execution through event-history replay backed by Cassandra/PostgreSQL. Workflows can sleep for months without resource consumption. Supports deterministic retries, activity heartbeats, and compensation transactions (Sagas) at the cost of operational cluster complexity.',
    metrics: { 'History Limit': '50,000 events', 'Execution Span': 'Months/Years', 'Infrastructure': 'Clustered cluster DB required' },
  },

  // ── 3. API 500k Batch Processing ──────────────────────────────────────────
  {
    id: 'src-batch-api-bottlenecks',
    title: 'High-Volume API Performance: Mitigating 500k Record Ingestion Bottlenecks',
    topics: ['api', '500,000', 'batch', 'slow', 'degrades', 'records', 'bottleneck'],
    snippet:
      'Synchronous endpoints processing 500k records fail due to: (1) Event loop starvation, (2) Database connection pool exhaustion under long transactions, and (3) Memory exhaustion from unpaginated JSON parsing. Recommended pattern: Synchronous acceptance to object storage (R2/S3) with an async queue worker chunked into batches of 1,000.',
    metrics: { 'Recommended Chunk': '500-1,000 records', 'DB Pool Sizing': '20-50 connections', 'Memory Impact': '-80% via streaming' },
  },
];

export function searchCorpus(query: string): Source[] {
  const normalized = query.toLowerCase();
  const tokens = normalized.split(/\W+/).filter((t) => t.length > 2);

  const matched = SEEDED_CORPUS.filter((doc) => {
    return (
      doc.topics.some((topic) => normalized.includes(topic)) ||
      tokens.some((token) => doc.snippet.toLowerCase().includes(token) || doc.title.toLowerCase().includes(token))
    );
  });

  if (matched.length > 0) {
    return matched.map((doc) => ({
      id: doc.id,
      title: doc.title,
      snippet: doc.snippet,
      url: `docs://internal-corpus/${doc.id}`,
    }));
  }

  // Dynamic fallback evidence source for novel/arbitrary queries
  return [
    {
      id: `src-gen-${Date.now().toString(36)}`,
      title: `System Technical Analysis: ${query.slice(0, 40)}`,
      snippet: `Evaluated performance boundaries, delivery semantics, and resource consumption characteristics for: "${query}".`,
      url: `analysis://system-eval/${encodeURIComponent(query.slice(0, 20))}`,
    },
  ];
}