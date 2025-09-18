# Frontend Development Guidelines for GitHub Copilot

## React Application Architecture

This text-based adventure platform frontend is built with React, TypeScript, and modern development practices. The application features a story editor with node-based interface, an immersive story player, and comprehensive flexible RPG mechanics integration.

### Project Structure

The frontend follows atomic design principles with clear separation of concerns and reusable component architecture:

**Component Organization:**
- Base UI components (atoms) for fundamental interface elements
- Form components (molecules) combining atoms for specific functionality
- RPG-specific components for flexible mechanics display and interaction
- Editor components for node-based story creation interface
- Player components for immersive story reading experience
- Layout components for consistent application structure

**Feature Organization:**
- Page components for complete application views
- Custom hooks for reusable logic and state management
- Services for API communication and external integrations
- Stores for state management with clear data flow
- Utilities for shared functionality and helper functions

### TypeScript Integration

All frontend code must use TypeScript with strict type checking and comprehensive type coverage for maintainability and developer experience.

**Type Safety Requirements:**
- Strict TypeScript configuration with no implicit any
- Comprehensive interface definitions for all data structures
- Generic types for reusable components and utilities
- Proper error handling with typed error objects
- API response typing with generated or maintained type definitions

**Component Typing:**
- Proper prop typing with interface definitions
- Event handler typing with appropriate event types
- State typing with clear type annotations
- Hook typing with proper return type definitions
- Context typing for shared state and functionality

## Component Development Standards

### Atomic Design Implementation

Follow atomic design methodology for consistent, reusable, and maintainable component architecture.

**Atom Components:**
- Basic UI elements like buttons, inputs, and icons
- Single responsibility with minimal props and logic
- Comprehensive accessibility implementation
- Consistent styling with design system integration
- Proper error states and loading indicators

**Molecule Components:**
- Combinations of atoms for specific functionality
- Form components with validation and error handling
- Search components with filtering and suggestions
- Navigation components with routing integration
- Card components with consistent content presentation

**Organism Components:**
- Complex UI sections combining molecules and atoms
- Feature-specific components with business logic integration
- Layout components with responsive design implementation
- Data display components with loading and error states
- Interactive components with comprehensive user feedback

### Accessibility Implementation

All components must implement WCAG 2.1 AA accessibility standards with comprehensive support for assistive technologies.

**Accessibility Requirements:**
- Proper ARIA labels and descriptions for all interactive elements
- Keyboard navigation support with focus management
- Screen reader compatibility with semantic HTML structure
- Color contrast compliance with high contrast mode support
- Touch-friendly sizing for mobile and tablet devices

**Implementation Standards:**
- Semantic HTML elements for proper document structure
- Focus management with visible focus indicators
- Error messaging with screen reader announcements
- Loading states with appropriate accessibility feedback
- Form validation with accessible error communication

### Performance Optimization

Implement comprehensive performance optimization strategies for smooth user experience across all devices.

**Optimization Techniques:**
- Component memoization with React.memo for expensive renders
- Hook optimization with useMemo and useCallback
- Code splitting with lazy loading for route-based optimization
- Virtual scrolling for large data sets and story content
- Image optimization with lazy loading and responsive images

**Bundle Optimization:**
- Tree shaking for unused code elimination
- Dynamic imports for feature-based code splitting
- Asset optimization with compression and caching
- Critical path optimization for fast initial page loads
- Performance monitoring with metrics collection and analysis

## RPG Mechanics Integration

### Flexible Component Design

Design RPG components that can adapt to any type of mechanics defined by story creators without hardcoding specific game systems.

**Component Flexibility:**
- Dynamic rendering based on RPG template configuration
- Support for various data types and display formats
- Customizable styling and theming based on story requirements
- Integration with template-defined validation and calculation rules
- Real-time updates with smooth animations and transitions

**Template Integration:**
- Template-driven component configuration and behavior
- Dynamic form generation for character creation and management
- Flexible stat display with customizable visualization options
- Check resolution interfaces adaptable to any mechanics system
- Progress tracking components supporting various advancement systems

### Character System Components

Implement flexible character system components that can represent any type of character defined by RPG templates.

**Character Management:**
- Character sheet components with dynamic layout and organization
- Stat display components supporting various data types and formats
- Inventory management with customizable item systems
- Progression tracking with template-defined advancement rules
- Character customization with flexible attribute systems

**Mechanics Resolution:**
- Check interface components for stat-based decision making
- Result display components with engaging visual feedback
- Probability calculation and display for informed decision making
- History tracking for previous checks and outcomes
- Integration with story flow for seamless narrative experience

## Story Editor Implementation

### Node-Based Editor Interface

Implement sophisticated node-based editor interface inspired by tools like N8N for intuitive story creation.

**Canvas Implementation:**
- Infinite scrolling canvas with smooth zoom and pan functionality
- Drag-and-drop node positioning with snap-to-grid support
- Multi-selection capabilities for bulk operations
- Auto-layout algorithms for story organization and readability
- Performance optimization for large story structures

**Node Management:**
- Node creation with various content types and templates
- Rich text editing with formatting and media integration
- Connection management for story flow and branching logic
- Validation feedback with error detection and suggestions
- Collaborative editing support with real-time synchronization

### Content Creation Tools

Provide comprehensive content creation tools for rich, engaging story experiences.

**Rich Content Editor:**
- WYSIWYG text editing with clean HTML output
- Media embedding with drag-and-drop support
- Asset management integration with organization and reuse
- Template-based content creation for consistency
- Preview functionality matching player experience

**RPG Integration Tools:**
- Mechanics integration with visual condition builders
- Variable and flag management with autocomplete support
- Template-based validation with real-time feedback
- Testing tools for mechanics validation and debugging
- Analytics integration for creator insights and optimization

## Story Player Implementation

### Immersive Reading Experience

Create engaging, distraction-free reading interface that adapts to various story types and RPG mechanics.

**Reading Interface:**
- Clean typography with customizable themes and preferences
- Smooth transitions between story segments and choices
- Character and background integration with story content
- Responsive design optimized for all device types
- Accessibility features for inclusive reading experiences

**Navigation and Progress:**
- Intuitive navigation with chapter and section organization
- Progress tracking with visual indicators and completion status
- Bookmark and save functionality with cloud synchronization
- Reading history with quick access to previous sections
- Search functionality for content discovery and reference

### Interactive Elements

Implement interactive elements that enhance the story experience while supporting flexible RPG mechanics.

**Choice System:**
- Clear choice presentation with requirement indicators
- Visual feedback for choice selection and outcomes
- Conditional choice display based on character stats and story state
- Choice history tracking for reference and analysis
- Integration with RPG mechanics for stat-based choices

**Mechanics Integration:**
- Character sheet access without interrupting story flow
- Stat check interfaces with engaging visual feedback
- Inventory management with story-relevant item interactions
- Progress tracking for character advancement and story completion
- Save system integration with comprehensive state preservation

## State Management

### Zustand Implementation

Use Zustand for lightweight, efficient state management with clear data flow and minimal boilerplate.

**Store Organization:**
- Feature-based store organization with clear boundaries
- Minimal global state with local state preference
- Async action handling with proper error management
- State persistence with selective data preservation
- DevTools integration for debugging and development

**State Design Patterns:**
- Immutable state updates with proper change detection
- Normalized state structure for complex data relationships
- Optimistic updates with rollback capabilities
- Caching strategies for API data and user preferences
- Real-time state synchronization for collaborative features

### Server State Management

Implement efficient server state management with caching, synchronization, and error handling.

**Data Fetching:**
- React Query integration for server state management
- Caching strategies with appropriate invalidation rules
- Background updates with stale-while-revalidate patterns
- Error handling with retry logic and user feedback
- Loading states with skeleton screens and progress indicators

**Real-Time Updates:**
- WebSocket integration for real-time features
- Optimistic updates with conflict resolution
- Connection management with automatic reconnection
- State synchronization across multiple browser tabs
- Performance optimization for real-time data handling

## Styling and Design System

### TailwindCSS Implementation

Use TailwindCSS for utility-first styling with consistent design system and responsive design.

**Design System:**
- Consistent color palette with theme support
- Typography scale with accessibility considerations
- Spacing system with consistent layout patterns
- Component variants with reusable style patterns
- Dark mode support with automatic theme switching

**Responsive Design:**
- Mobile-first design approach with progressive enhancement
- Breakpoint strategy for various screen sizes
- Touch-friendly interactions for mobile devices
- Performance optimization for mobile networks
- Cross-browser compatibility with fallback strategies

### Animation and Transitions

Implement smooth animations and transitions that enhance user experience without impacting performance.

**Animation Strategy:**
- Subtle animations for state changes and feedback
- Loading animations with appropriate timing and easing
- Transition animations for smooth navigation and content changes
- Performance optimization with hardware acceleration
- Accessibility considerations with reduced motion support

**User Feedback:**
- Visual feedback for user interactions and system responses
- Loading states with progress indicators and skeleton screens
- Error states with clear messaging and recovery options
- Success states with confirmation and next step guidance
- Hover and focus states for interactive elements

## Testing Strategy

### Component Testing

Implement comprehensive component testing with React Testing Library and Jest.

**Testing Requirements:**
- Unit tests for all components with various prop combinations
- Integration tests for component interactions and workflows
- Accessibility tests with screen reader simulation
- Visual regression tests for design consistency
- Performance tests for component rendering optimization

**Testing Patterns:**
- Test user interactions rather than implementation details
- Mock external dependencies and API calls
- Use test data factories for consistent test scenarios
- Implement custom render functions with provider setup
- Focus on behavior testing over implementation testing

### End-to-End Testing

Integrate with Playwright for comprehensive end-to-end testing coverage.

**E2E Testing Scope:**
- Complete user workflows from registration to story completion
- Cross-browser compatibility testing
- Mobile and responsive design validation
- Performance testing under various network conditions
- Accessibility testing with assistive technologies

**Test Maintenance:**
- Page object model for maintainable test organization
- Shared utilities and helpers for common operations
- Test data management with setup and cleanup procedures
- Continuous integration with automated test execution
- Test reporting with comprehensive failure analysis

This frontend development guide provides comprehensive guidance for building a modern, accessible, and performant React application that supports completely flexible RPG mechanics while maintaining excellent user experience and code quality standards.

