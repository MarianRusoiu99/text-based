# Quickstart: Visual Editor API

1) Batch update positions

STORY_ID="<story-id>"

curl -s -X PATCH http://localhost:3000/nodes/positions \
 -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
 -d '{
  "storyId": "'$STORY_ID'",
  "positions": [
    {"nodeId":"n1","x":100,"y":200},
    {"nodeId":"n2","x":300,"y":400}
  ]
 }' | jq
