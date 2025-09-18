# Frontend Design and Architecture

## Overview

The frontend architecture is designed to support a dual-purpose platform combining a sophisticated story editor with an immersive story player. The application uses React with TypeScript for type safety and maintainability, implementing a modular component-based architecture that ensures reusability and scalability.

## Technology Stack

### Core Framework
- **React 18+** with TypeScript for type-safe development
- **React Router v6** for client-side routing and navigation
- **Vite** as the build tool for fast development and optimized production builds

### State Management
- **Zustand** for lightweight, flexible state management
- **React Query (TanStack Query)** for server state management and caching
- **React Hook Form** for form state management and validation

### UI Components and Styling
- **TailwindCSS** for utility-first styling and rapid development
- **Headless UI** for accessible, unstyled UI components
- **Framer Motion** for smooth animations and transitions
- **React Flow** for the node-based story editor interface
- **Lucide React** for consistent iconography

### Development Tools
- **ESLint** and **Prettier** for code quality and formatting
- **Husky** for Git hooks and pre-commit validation
- **TypeScript** for static type checking
- **Storybook** for component development and documentation

## Application Architecture

### Directory Structure

The application follows a feature-based directory structure that promotes modularity and maintainability:

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Basic UI components (buttons, inputs, etc.)
│   ├── layout/          # Layout components (header, sidebar, etc.)
│   └── common/          # Common components used across features
├── features/            # Feature-based modules
│   ├── auth/           # Authentication and user management
│   ├── editor/         # Story editor functionality
│   ├── player/         # Story player functionality
│   ├── library/        # Story browsing and library
│   ├── profile/        # User profiles and settings
│   └── analytics/      # Analytics and statistics
├── hooks/              # Custom React hooks
├── services/           # API services and external integrations
├── stores/             # Zustand stores for state management
├── types/              # TypeScript type definitions
├── utils/              # Utility functions and helpers
├── assets/             # Static assets (images, fonts, etc.)
└── styles/             # Global styles and Tailwind configuration
```

### Component Architecture

The component architecture follows atomic design principles, organizing components into atoms, molecules, organisms, and templates. This approach ensures consistent design patterns and promotes reusability across the application.

**Atomic Components (atoms/)**
These are the smallest building blocks of the interface, including basic elements like buttons, inputs, labels, and icons. Each atomic component is designed to be highly reusable and follows consistent design tokens.

```typescript
// Example: Button component
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  variant,
  size,
  disabled,
  loading,
  children,
  onClick
}) => {
  const baseClasses = 'font-medium rounded-lg transition-all duration-200';
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
    ghost: 'text-gray-600 hover:bg-gray-100'
  };
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
};
```

**Molecular Components (molecules/)**
These components combine atoms to create more complex UI elements like form fields, cards, navigation items, and modal dialogs. They handle specific pieces of functionality while remaining reusable.

**Organism Components (organisms/)**
These are complex components that combine molecules and atoms to create distinct sections of the interface, such as headers, sidebars, story cards, and editor panels.

**Template Components (templates/)**
These components define the overall page layout and structure, providing consistent positioning and spacing for different sections of the application.

## Feature-Specific Architecture

### Story Editor Architecture

The story editor is the most complex part of the frontend, requiring a sophisticated node-based interface for creating interactive narratives. The architecture is designed to handle complex story structures while providing an intuitive user experience.

**Editor State Management**
The editor uses a dedicated Zustand store to manage the complex state of stories, nodes, and connections. The state is structured to support undo/redo functionality, real-time collaboration, and efficient rendering of large story graphs.

```typescript
interface EditorState {
  // Current story being edited
  currentStory: Story | null;
  
  // Node and connection data
  nodes: Node[];
  connections: Connection[];
  
  // Editor UI state
  selectedNodes: string[];
  selectedConnections: string[];
  viewportPosition: { x: number; y: number };
  zoomLevel: number;
  
  // Editor modes and tools
  currentTool: 'select' | 'add-node' | 'add-connection' | 'delete';
  isPreviewMode: boolean;
  
  // History for undo/redo
  history: EditorSnapshot[];
  historyIndex: number;
  
  // Actions
  addNode: (node: Partial<Node>) => void;
  updateNode: (id: string, updates: Partial<Node>) => void;
  deleteNode: (id: string) => void;
  addConnection: (connection: Partial<Connection>) => void;
  updateConnection: (id: string, updates: Partial<Connection>) => void;
  deleteConnection: (id: string) => void;
  selectNodes: (nodeIds: string[]) => void;
  setTool: (tool: EditorTool) => void;
  undo: () => void;
  redo: () => void;
  saveSnapshot: () => void;
}
```

**Node Editor Components**
The node editor uses React Flow as the foundation, with custom node types for different story elements. Each node type has its own component and configuration:

```typescript
// Story Node Component
export const StoryNode: React.FC<NodeProps<StoryNodeData>> = ({ data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const updateNode = useEditorStore(state => state.updateNode);

  const handleContentUpdate = (content: StoryContent) => {
    updateNode(data.id, { content });
  };

  return (
    <div className={`story-node ${selected ? 'selected' : ''}`}>
      <div className="node-header">
        <h3>{data.title}</h3>
        <NodeActions nodeId={data.id} />
      </div>
      
      <div className="node-content">
        {isEditing ? (
          <StoryContentEditor
            content={data.content}
            onSave={handleContentUpdate}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <StoryContentPreview
            content={data.content}
            onClick={() => setIsEditing(true)}
          />
        )}
      </div>
      
      <div className="node-connections">
        <Handle type="target" position={Position.Top} />
        <Handle type="source" position={Position.Bottom} />
      </div>
    </div>
  );
};
```

**Content Editing Interface**
The content editing interface provides rich text editing capabilities with support for character management, background selection, and choice creation. The interface is designed to be intuitive while providing access to advanced features.

```typescript
interface StoryContentEditorProps {
  content: StoryContent;
  onSave: (content: StoryContent) => void;
  onCancel: () => void;
}

export const StoryContentEditor: React.FC<StoryContentEditorProps> = ({
  content,
  onSave,
  onCancel
}) => {
  const [paragraphs, setParagraphs] = useState(content.paragraphs || []);
  const [characters, setCharacters] = useState(content.characters || []);
  const [background, setBackground] = useState(content.background || '');

  return (
    <div className="content-editor">
      <TabGroup>
        <TabList>
          <Tab>Text</Tab>
          <Tab>Characters</Tab>
          <Tab>Background</Tab>
          <Tab>Audio</Tab>
        </TabList>
        
        <TabPanels>
          <TabPanel>
            <ParagraphEditor
              paragraphs={paragraphs}
              onChange={setParagraphs}
            />
          </TabPanel>
          
          <TabPanel>
            <CharacterManager
              characters={characters}
              onChange={setCharacters}
            />
          </TabPanel>
          
          <TabPanel>
            <BackgroundSelector
              selected={background}
              onChange={setBackground}
            />
          </TabPanel>
          
          <TabPanel>
            <AudioManager
              audio={content.audio}
              onChange={(audio) => setContent({...content, audio})}
            />
          </TabPanel>
        </TabPanels>
      </TabGroup>
      
      <div className="editor-actions">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={() => onSave({
          paragraphs,
          characters,
          background,
          audio: content.audio
        })}>
          Save
        </Button>
      </div>
    </div>
  );
};
```

### Story Player Architecture

The story player provides an immersive reading experience that brings stories to life through visual and interactive elements. The architecture focuses on smooth transitions, responsive design, and engaging user interactions.

**Player State Management**
The player uses a dedicated state management system to track game progress, inventory, flags, and user choices. The state is designed to support save/load functionality and analytics tracking.

```typescript
interface PlayerState {
  // Current game session
  sessionId: string | null;
  currentStory: Story | null;
  currentNode: Node | null;
  
  // Game state
  gameState: {
    flags: Record<string, boolean>;
    inventory: string[];
    variables: Record<string, any>;
  };
  
  // Player progress
  progress: {
    nodesVisited: string[];
    totalNodes: number;
    completionPercentage: number;
    playTime: number;
  };
  
  // UI state
  isLoading: boolean;
  showInventory: boolean;
  showSettings: boolean;
  textSpeed: number;
  autoAdvance: boolean;
  
  // Actions
  startStory: (storyId: string) => Promise<void>;
  makeChoice: (choiceId: string) => Promise<void>;
  saveProgress: () => Promise<void>;
  loadProgress: () => Promise<void>;
  toggleInventory: () => void;
  updateSettings: (settings: Partial<PlayerSettings>) => void;
}
```

**Player Interface Components**
The player interface is designed to be immersive and distraction-free, with careful attention to typography, spacing, and visual hierarchy.

```typescript
export const StoryPlayer: React.FC = () => {
  const {
    currentNode,
    gameState,
    progress,
    isLoading,
    makeChoice,
    toggleInventory
  } = usePlayerStore();

  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);
  const [showChoices, setShowChoices] = useState(false);

  if (isLoading || !currentNode) {
    return <PlayerLoadingScreen />;
  }

  return (
    <div className="story-player">
      <PlayerHeader
        storyTitle={currentNode.story.title}
        progress={progress}
        onMenuClick={() => setShowMenu(true)}
      />
      
      <div className="player-content">
        <BackgroundLayer background={currentNode.content.background} />
        
        <CharacterLayer characters={currentNode.content.characters} />
        
        <TextLayer
          paragraphs={currentNode.content.paragraphs}
          currentIndex={currentParagraphIndex}
          onAdvance={() => {
            if (currentParagraphIndex < currentNode.content.paragraphs.length - 1) {
              setCurrentParagraphIndex(prev => prev + 1);
            } else {
              setShowChoices(true);
            }
          }}
        />
        
        {showChoices && (
          <ChoiceLayer
            choices={currentNode.availableChoices}
            onSelect={makeChoice}
          />
        )}
      </div>
      
      <PlayerControls
        onInventoryClick={toggleInventory}
        onSettingsClick={() => setShowSettings(true)}
        onSaveClick={saveProgress}
      />
    </div>
  );
};
```

**Visual Effects and Animations**
The player uses Framer Motion for smooth transitions and engaging visual effects. Character animations, background transitions, and text reveals are carefully orchestrated to create an immersive experience.

```typescript
export const CharacterLayer: React.FC<{ characters: Character[] }> = ({ characters }) => {
  return (
    <div className="character-layer">
      <AnimatePresence>
        {characters.map((character) => (
          <motion.div
            key={character.name}
            className={`character character-${character.position}`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <motion.img
              src={character.spriteUrl}
              alt={character.name}
              animate={{ scale: character.expression === 'excited' ? 1.05 : 1 }}
              transition={{ duration: 0.3 }}
            />
            
            {character.dialogue && (
              <motion.div
                className="character-dialogue"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                {character.dialogue}
              </motion.div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
```

### Library and Discovery Architecture

The library interface provides users with powerful tools to discover, organize, and manage stories. The architecture emphasizes performance, search functionality, and social features.

**Library State Management**
The library uses React Query for efficient data fetching and caching, with Zustand handling UI state and user preferences.

```typescript
interface LibraryState {
  // Filters and search
  searchQuery: string;
  selectedCategory: string | null;
  selectedTags: string[];
  sortBy: 'created_at' | 'updated_at' | 'rating' | 'reads';
  sortOrder: 'asc' | 'desc';
  contentRating: string[];
  
  // View preferences
  viewMode: 'grid' | 'list';
  itemsPerPage: number;
  
  // User collections
  bookmarks: string[];
  readingHistory: string[];
  
  // Actions
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<LibraryFilters>) => void;
  toggleBookmark: (storyId: string) => void;
  addToHistory: (storyId: string) => void;
}
```

**Story Discovery Components**
The discovery interface includes sophisticated filtering, search, and recommendation features to help users find stories they'll enjoy.

```typescript
export const StoryLibrary: React.FC = () => {
  const {
    searchQuery,
    selectedCategory,
    selectedTags,
    sortBy,
    sortOrder,
    viewMode,
    setSearchQuery,
    setFilters
  } = useLibraryStore();

  const { data: stories, isLoading } = useQuery({
    queryKey: ['stories', { searchQuery, selectedCategory, selectedTags, sortBy, sortOrder }],
    queryFn: () => fetchStories({
      search: searchQuery,
      category: selectedCategory,
      tags: selectedTags,
      sortBy,
      sortOrder
    })
  });

  return (
    <div className="story-library">
      <LibraryHeader>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search stories..."
        />
        
        <ViewToggle
          mode={viewMode}
          onChange={(mode) => setFilters({ viewMode: mode })}
        />
      </LibraryHeader>
      
      <div className="library-content">
        <LibrarySidebar>
          <CategoryFilter
            selected={selectedCategory}
            onChange={(category) => setFilters({ selectedCategory: category })}
          />
          
          <TagFilter
            selected={selectedTags}
            onChange={(tags) => setFilters({ selectedTags: tags })}
          />
          
          <SortOptions
            sortBy={sortBy}
            sortOrder={sortOrder}
            onChange={(sort) => setFilters(sort)}
          />
        </LibrarySidebar>
        
        <div className="library-main">
          {isLoading ? (
            <StoryGridSkeleton />
          ) : (
            <StoryGrid
              stories={stories}
              viewMode={viewMode}
              onStoryClick={(story) => navigate(`/play/${story.id}`)}
            />
          )}
        </div>
      </div>
    </div>
  );
};
```

## Responsive Design and Mobile Support

The application is designed with a mobile-first approach, ensuring optimal experiences across all device sizes. The responsive design uses Tailwind's responsive utilities and custom breakpoints to adapt layouts and interactions for different screen sizes.

**Breakpoint Strategy**
- **Mobile (sm)**: 640px and below - Single column layouts, touch-optimized controls
- **Tablet (md)**: 768px to 1024px - Adaptive layouts with collapsible sidebars
- **Desktop (lg)**: 1024px and above - Full feature layouts with multiple panels

**Mobile-Specific Optimizations**
The mobile experience includes touch-optimized controls, gesture support, and adaptive layouts that make the most of limited screen space.

```typescript
export const MobileStoryPlayer: React.FC = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { currentNode, makeChoice } = usePlayerStore();

  return (
    <div className="mobile-player">
      <div className="mobile-header">
        <button
          className="menu-toggle"
          onClick={() => setShowMobileMenu(true)}
        >
          <MenuIcon />
        </button>
        
        <h1 className="story-title">{currentNode.story.title}</h1>
        
        <ProgressIndicator progress={progress} />
      </div>
      
      <SwipeableViews
        onSwipeLeft={() => advanceText()}
        onSwipeRight={() => showPreviousText()}
      >
        <div className="text-content">
          {currentNode.content.paragraphs.map((paragraph, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {paragraph}
            </motion.p>
          ))}
        </div>
      </SwipeableViews>
      
      <div className="mobile-choices">
        {currentNode.availableChoices.map((choice) => (
          <TouchableChoice
            key={choice.id}
            choice={choice}
            onSelect={() => makeChoice(choice.id)}
          />
        ))}
      </div>
    </div>
  );
};
```

## Performance Optimization

The frontend architecture includes several performance optimization strategies to ensure smooth user experiences, especially when handling large stories or complex editor operations.

**Code Splitting and Lazy Loading**
The application uses React's lazy loading and Suspense to split code by features and routes, reducing initial bundle size and improving load times.

```typescript
// Route-based code splitting
const StoryEditor = lazy(() => import('../features/editor/StoryEditor'));
const StoryPlayer = lazy(() => import('../features/player/StoryPlayer'));
const StoryLibrary = lazy(() => import('../features/library/StoryLibrary'));

export const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <StoryLibrary />
          </Suspense>
        } />
        
        <Route path="/editor/:storyId?" element={
          <Suspense fallback={<EditorLoadingScreen />}>
            <StoryEditor />
          </Suspense>
        } />
        
        <Route path="/play/:storyId" element={
          <Suspense fallback={<PlayerLoadingScreen />}>
            <StoryPlayer />
          </Suspense>
        } />
      </Routes>
    </Router>
  );
};
```

**Virtual Scrolling and Pagination**
For large lists of stories or nodes, the application implements virtual scrolling and intelligent pagination to maintain performance.

**Memoization and Optimization**
Critical components use React.memo, useMemo, and useCallback to prevent unnecessary re-renders and optimize performance.

```typescript
export const StoryCard = React.memo<StoryCardProps>(({ story, onSelect }) => {
  const handleClick = useCallback(() => {
    onSelect(story.id);
  }, [story.id, onSelect]);

  const formattedStats = useMemo(() => ({
    rating: story.rating.toFixed(1),
    reads: formatNumber(story.reads),
    duration: formatDuration(story.estimatedDuration)
  }), [story.rating, story.reads, story.estimatedDuration]);

  return (
    <motion.div
      className="story-card"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
    >
      <div className="card-image">
        <img src={story.coverImageUrl} alt={story.title} loading="lazy" />
      </div>
      
      <div className="card-content">
        <h3>{story.title}</h3>
        <p>{story.description}</p>
        
        <div className="card-stats">
          <span>⭐ {formattedStats.rating}</span>
          <span>👁 {formattedStats.reads}</span>
          <span>⏱ {formattedStats.duration}</span>
        </div>
      </div>
    </motion.div>
  );
});
```

## Accessibility and Internationalization

The frontend architecture prioritizes accessibility and internationalization to ensure the platform is usable by diverse audiences worldwide.

**Accessibility Features**
- Semantic HTML structure with proper ARIA labels
- Keyboard navigation support throughout the application
- Screen reader compatibility with descriptive text
- High contrast mode support
- Focus management for modal dialogs and complex interactions

**Internationalization Support**
The application uses react-i18next for comprehensive internationalization support, with dynamic language switching and RTL layout support.

```typescript
// i18n configuration
export const i18nConfig = {
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  },
  resources: {
    en: {
      translation: {
        'story.title': 'Story Title',
        'story.description': 'Story Description',
        'editor.addNode': 'Add Node',
        'player.nextChoice': 'Next Choice'
      }
    },
    es: {
      translation: {
        'story.title': 'Título de la Historia',
        'story.description': 'Descripción de la Historia',
        'editor.addNode': 'Agregar Nodo',
        'player.nextChoice': 'Siguiente Opción'
      }
    }
  }
};
```

This comprehensive frontend architecture provides a solid foundation for building a sophisticated text-based adventure platform that delivers exceptional user experiences across all devices and use cases. The modular design ensures maintainability and scalability as the platform grows and evolves.

