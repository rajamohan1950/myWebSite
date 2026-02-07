---
title: "Designing a High-Throughput Kafka Pipeline"
slug: "streaming-tech"
excerpt: "Kafka doesn't magically scale. Math + measurements + clear SLOs make it scale. If you want a concrete plan for your workload, share your throughput, message size, measured consumer capacity, retention, and hardware profile."
category: ""
publishedAt: "2026-02-07T10:26:23.000Z"
createdAt: "2026-02-07T04:50:16.000Z"
updatedAt: "2026-02-07T10:26:25.000Z"
---
Designing a High-Throughput Kafka Pipeline (Without Guesswork)

When teams say “Kafka will scale”, what they usually mean is “we’ll figure it out later.”
That works — until traffic spikes, lag explodes, and everyone starts tuning configs blindly.

This post lays out a practical, capacity-driven approach to designing a Kafka-based ingestion and processing pipeline that scales predictably.

1. Objectives and Success Criteria

A well-designed Kafka pipeline should:

Ingest up to N messages/sec per topic with low end-to-end latency
Scale linearly by adding partitions, consumers, or brokers
Guarantee at-least-once (or exactly-once, where required) processing
Enable fan-out using consumer groups without interference
Operate within clear SLOs for lag, throughput, and durability
Primary SLOs

Produce latency p99 ≤ X ms
Consumer lag ≤ Y seconds at steady state
Recovery ≤ Z minutes after a 2× traffic spike
Availability ≥ 99.9% (higher with multi-AZ)
2. Kafka Core Concepts (Quick Reality Check)

Topics are sharded by partitions. Each partition has one leader and multiple replicas on different brokers.
Parallelism comes from partitions. One consumer per partition per consumer group.
Consumer groups are isolated. Multiple groups can independently read the same topic (fan-out).
Rule of thumb:

Max useful consumers in one group = number of partitions.

3. Target Architecture (Logical View)

Producers publish events (ideally keyed for even distribution) to a topic, e.g. orders, with P partitions and replication factor = 3.

The Kafka cluster spreads partition leaders and replicas across B brokers.

Downstream, multiple consumer groups independently process the same topic:

Group A → Fraud detection
Group B → Analytics
Group C → ML feature extraction
Each group maintains its own offsets and scales independently.

4. Capacity Planning (This Is Where Most Designs Fail)

Inputs you must know

T = target throughput (msgs/sec)
S = avg message size (bytes, post-compression)
R = replication factor (typically 3)
C = sustained msgs/sec per consumer (measured, not guessed)
H = headroom factor (1.3–2.0)
RetentionDays = topic retention
Key formulas

Partitions (per pipeline):

P = ceil((T / C) × H)

Ingress (cluster-wide):

Ingress = T × S × R

Egress (per consumer group):

Egress = T × S

Storage (leaders only, per day):

LeaderBytes/day = T × S × 86,400

Multiply by R and RetentionDays, then add 20–30% free space.

5. Example Sizing

Become a member
Assume:

T = 1,000,000 msgs/sec
S = 200 bytes
R = 3
C = 25,000 msgs/sec/consumer
H = 1.5
Retention = 3 days
Partitions:

P = ceil((1e6 / 25k) × 1.5) = 60

Ingress: ~572 MB/sec
Egress per group: ~191 MB/sec

With a broker budget of ~200 MB/sec sustained, you’ll need 4–6 brokers with headroom.

Storage: ~155 TB total for 3 days with RF=3.

6. Partitioning Strategy

Use high-cardinality, stable keys (e.g., order_id, not country)
Monitor skew; hot partitions kill throughput
Slightly over-provision partitions (≈1.5×) to avoid painful re-partitioning later
7. Consumer Group Strategy

Scale throughput by adding consumers up to P
Create separate groups for distinct use cases
Auto-scale consumers based on lag growth and CPU
8. Reliability and Consistency

Producers: acks=all, enable.idempotence=true
Topics: replication.factor=3, min.insync.replicas=2
Disable unclean leader election in production
Use EOS (transactions) only where business semantics demand it
Spread replicas across racks/AZs
9. Operational Guardrails

Avoid extreme partition counts per broker (keep it in the low thousands)
Cap sustained broker utilization at 60–70%
Quotas protect you from noisy neighbors
10. Observability and Autoscaling

Watch:

Lag per partition (growth rate matters more than absolute value)
Produce/consume latency p95/p99
ISR shrinkage and under-replicated partitions
Disk, NIC, GC, and controller health
Scale:

Consumers when lag grows
Partitions when consumers saturate
Brokers when disk or network approaches limits
Final Thought

Kafka doesn’t magically scale.
Math + measurements + clear SLOs make it scale.

If you want a concrete plan for your workload, share:

Throughput (T), message size (S)
Measured consumer capacity ©
Retention
Hardware profile
From that, you can derive exact partition counts, consumer counts, broker sizing, and a runbook — before production teaches you the hard way.