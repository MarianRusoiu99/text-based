# Data Model: Editor Layer

This layer relies on backend `Nodes` and `Choices` models; no new DB entities.

## React Flow Node Shape

interface RFNode {
  id: string;
  type?: 'default';
  data: { label: string; content?: any };
  position: { x: number; y: number };
}

## Local Stores
- `useEditorStore`: selection, panel state, unsaved changes flag
- `useStoryStore`: current story metadata (ownerId, published)
