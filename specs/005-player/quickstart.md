# Quickstart: Player Sessions

Prereqs: Backend at `http://localhost:3000`, export `TOKEN`.

1) Create/Resume a session

STORY_ID="<story-id>"

curl -s -X POST http://localhost:3000/stories/$STORY_ID/sessions \
 -H "Authorization: Bearer $TOKEN" \
 -H 'Content-Type: application/json' \
 -d '{"anonymous": false}' | jq

2) Get session state

SESSION_ID="<session-id>"

curl -s http://localhost:3000/sessions/$SESSION_ID \
 -H "Authorization: Bearer $TOKEN" | jq

3) Apply a choice

CHOICE_ID="<choice-id>"

curl -s -X POST http://localhost:3000/sessions/$SESSION_ID/apply \
 -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
 -d '{"choiceId":"'$CHOICE_ID'"}' | jq
