# Quickstart: RPG Templates

Prereqs: Backend running at `http://localhost:3000`, obtain JWT and export `TOKEN`.

1) Create a template

curl -s -X POST http://localhost:3000/rpg/templates \
 -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
 -d '{
  "name":"Classic RPG",
  "isPublic": false,
  "config": {
    "schemaVersion": 1,
    "stats": [
      {"id":"hp","name":"HP","type":"number","min":0,"max":100,"default":100},
      {"id":"attack","name":"ATK","type":"number","min":0,"max":50,"default":10},
      {"id":"defense","name":"DEF","type":"number","min":0,"max":50,"default":5}
    ],
    "items": [{"id":"potion","name":"Potion","stackable":true,"maxStack":99}],
    "mechanics": {"damage": {"formula": "attack - defense"}}
  }
 }'

2) List templates

curl -s -H "Authorization: Bearer $TOKEN" http://localhost:3000/rpg/templates | jq

3) Attach to a story

STORY_ID="<your-story-id>"
TEMPLATE_ID="<template-id>"

curl -s -X PUT http://localhost:3000/stories/$STORY_ID/rpg-template \
 -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
 -d '{"templateId":"'$TEMPLATE_ID'"}' | jq

4) Detach from a story

curl -s -X DELETE http://localhost:3000/stories/$STORY_ID/rpg-template \
 -H "Authorization: Bearer $TOKEN" | jq
