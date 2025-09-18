# Data Model: Nodes & Choices

## StoryNode
- id: UUID PK
- storyId: UUID FK → Story(id)
- nodeType: enum('start','normal','choice','end','conditional')
- content: JSONB { text: string[], background?: string, music?: string, rpgData?: any }
- position: JSONB { x: number, y: number }
- createdAt, updatedAt: timestamp

Indexes:
- (storyId)
- GIN(content)

## Choice
- id: UUID PK
- storyId: UUID FK → Story(id)
- fromNodeId: UUID FK → StoryNode(id)
- toNodeId: UUID FK → StoryNode(id)
- choiceText: string
- conditions: JSONB []
- effects: JSONB []
- createdAt, updatedAt: timestamp

Indexes:
- (storyId, fromNodeId)
- (storyId, toNodeId)
