What You Need To Do
Design a JSON structure that can represent the above decision flow (and any similar flow the Risk team might configure in the future).
Model the domain — define core classes/interfaces to represent the decision flow, conditions, operators, outcomes, and evaluation context.
Implement an evaluate function — given the decision flow configuration and a customer's feature data, return the matched outcome and approved loan amount.
Ensure exactly one outcome — your design should structurally guarantee that every customer lands on exactly one result with no conflicts.
Demonstrate — show your solution works for the sample customers above.

Constraints
One decision flow configuration is active at a time.
Features are provided as a key-value map at evaluation time.
A feature should ideally be evaluated at most once per customer's evaluation path. Avoid redundant checks.
No database or API design needed — focus on in-memory logic.
Prefer clean, extensible design over brute force.