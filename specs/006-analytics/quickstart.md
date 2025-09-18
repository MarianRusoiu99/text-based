# Quickstart: Analytics

1) Ingest an event

curl -s -X POST http://localhost:3000/analytics/events \
 -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
 -d '{"sessionId":"<sid>","type":"visit","payload":{"nodeId":"n1"}}' | jq

2) Fetch metrics

curl -s http://localhost:3000/analytics/stories/<storyId>/metrics \
 -H "Authorization: Bearer $TOKEN" | jq
