# Quickstart: Community

1) Publish a story

curl -s -X PATCH http://localhost:3000/stories/<storyId>/publish \
 -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
 -d '{"isPublic": true}' | jq

2) List public stories

curl -s 'http://localhost:3000/stories/public?q=dragon&tags=fantasy&sort=popular' | jq

3) Like/unlike

curl -s -X POST http://localhost:3000/stories/<storyId>/likes -H "Authorization: Bearer $TOKEN" | jq
curl -s -X DELETE http://localhost:3000/stories/<storyId>/likes -H "Authorization: Bearer $TOKEN" | jq

4) Comments

curl -s -X POST http://localhost:3000/stories/<storyId>/comments \
 -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
 -d '{"content":"Great story!"}' | jq
curl -s http://localhost:3000/stories/<storyId>/comments | jq
