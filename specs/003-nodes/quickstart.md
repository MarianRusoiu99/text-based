# Quickstart: Nodes & Choices

1. Create node A
```
POST /v1/stories/{storyId}/nodes
{"content":{"text":["Hello"]},"position":{"x":100,"y":200},"nodeType":"normal"}
```
2. Create node B
3. Connect A → B
```
POST /v1/stories/{storyId}/choices
{"fromNodeId":"<nodeA>","toNodeId":"<nodeB>","choiceText":"Continue"}
```
4. Batch move nodes
```
PUT /v1/stories/{storyId}/nodes/positions
{"positions":[{"nodeId":"<nodeA>","position":{"x":150,"y":240}}]}
```
