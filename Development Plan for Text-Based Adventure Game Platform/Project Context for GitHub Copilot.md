# Project Context for GitHub Copilot

## Project Vision and Mission

This text-based adventure platform represents a revolutionary approach to interactive storytelling, combining the narrative depth of traditional literature with the engagement of role-playing games. The platform empowers authors to create immersive, branching narratives enhanced with completely flexible RPG mechanics, while providing readers with personalized, interactive experiences that adapt to their choices and character development.

### Core Value Proposition

**For Story Authors**: A powerful, intuitive story creation platform that enables authors to craft complex, interactive narratives without requiring programming knowledge. The node-based editor provides visual story mapping capabilities similar to professional workflow tools, while integrated flexible RPG mechanics add depth and replayability to stories.

**For Story Readers**: An immersive reading experience that goes beyond traditional books, offering meaningful choices, character progression, and personalized storylines that respond to individual decisions and play styles.

**For the Community**: A thriving ecosystem where creators can share templates, collaborate on stories, and build upon each other's work, fostering innovation and creativity in interactive storytelling.

## Technical Architecture Overview

### System Architecture Philosophy

The platform follows a modern, scalable architecture built on proven technologies and design patterns:

**Backend**: NestJS framework with TypeScript provides a robust, enterprise-grade foundation with excellent developer experience, comprehensive testing capabilities, and strong typing throughout the application.

**Database**: PostgreSQL with Prisma ORM ensures data integrity, type safety, and excellent performance for complex relational data structures required by flexible RPG mechanics and story branching.

**Frontend**: React with TypeScript delivers a responsive, accessible user interface with component-based architecture that scales from simple reading interfaces to complex story editors.

**Provider-Agnostic Design**: All external dependencies (storage, email, logging, caching) are abstracted through interfaces, enabling easy switching between providers and deployment flexibility.

### Key Technical Decisions

**Node-Based Story Editor**: Inspired by N8N and similar workflow tools, the visual editor allows authors to create complex story structures through an intuitive drag-and-drop interface, making advanced storytelling techniques accessible to non-technical users.

**Flexible RPG Mechanics Integration**: Completely customizable RPG mechanics system allows story creators to define their own game rules, statistics, and mechanics without being constrained by any specific game system.

**Real-Time Collaboration**: WebSocket integration enables multiple authors to collaborate on stories simultaneously, with conflict resolution and change tracking.

**Progressive Web App**: The platform works seamlessly across devices with offline reading capabilities and native app-like experiences.

## Domain Model and Core Concepts

### Story Creation Domain

**Stories**: The central content unit, containing metadata, structure, and all associated content. Stories can be public, unlisted, or private, with comprehensive versioning and collaboration features.

**Nodes**: Individual story segments that can contain text, media, character interactions, and RPG mechanics. Node types include story segments, choice points, stat checks, conditional logic, and custom mechanics defined by creators.

**Connections**: Links between nodes that define story flow, including choice text, conditions, and branching logic. Connections can have complex conditional requirements based on character stats, inventory, or story flags as defined by the RPG template.

**RPG Templates**: Completely flexible RPG mechanics configurations that define character stats, proficiencies, item types, and progression rules. Templates can be shared across stories and customized for specific narratives without any hardcoded game system constraints.

### Character and Progression Domain

**Characters**: Player avatars with stats, inventory, and progression defined by the story's RPG template. Character data is completely flexible and can accommodate any type of game mechanics defined by story creators.

**Character Progression**: Advancement systems based on template-defined rules, including experience points, skill development, and story-driven character growth. Progression systems are completely customizable by story creators.

**Inventory System**: Flexible item management with template-defined item types, properties, and interactions. Items can have any properties and behaviors defined by the story creator's RPG template.

**Save System**: Comprehensive game state preservation including character data, story progress, inventory, and all custom mechanics state as defined by the RPG template.

### Community and Social Domain

**User Profiles**: Creator and reader profiles with portfolios, preferences, and social features. Profiles showcase created content and reading achievements.

**Ratings and Reviews**: Community feedback system for stories with moderation and quality control features.

**Following and Notifications**: Social features enabling users to follow creators and receive updates about new content and community activity.

**Content Discovery**: Advanced search and recommendation systems helping readers find stories that match their interests and preferences.

## Development Principles and Standards

### Code Quality Standards

**TypeScript First**: All code must use TypeScript with strict type checking and comprehensive type coverage for maintainability and developer experience.

**SOLID Principles**: All code must adhere to SOLID principles for maintainable, testable, and extensible architecture.

**DRY Principle**: Eliminate code duplication through shared utilities, reusable components, and configuration-driven behavior.

**Provider-Agnostic Design**: All external service integrations must be abstracted through interfaces that allow easy swapping of providers.

**Comprehensive Testing**: Maintain high test coverage with unit tests, integration tests, and end-to-end tests for all critical functionality.

### Security and Privacy

**Data Protection**: Implement comprehensive data protection measures including encryption, access controls, and privacy compliance.

**Input Validation**: Validate and sanitize all user input to prevent security vulnerabilities and ensure data integrity.

**Authentication and Authorization**: Implement secure authentication with proper session management and role-based access controls.

**Audit Logging**: Maintain comprehensive audit trails for security monitoring and compliance requirements.

### Performance and Scalability

**Horizontal Scaling**: Design all components to support horizontal scaling with stateless architecture and proper load balancing.

**Caching Strategy**: Implement comprehensive caching at multiple levels for optimal performance and user experience.

**Database Optimization**: Use appropriate indexing, query optimization, and connection pooling for database performance.

**Frontend Performance**: Implement code splitting, lazy loading, and efficient re-rendering strategies for optimal user experience.

## RPG Mechanics Philosophy

### Complete Flexibility

The RPG mechanics system is designed to be completely flexible and not tied to any specific game system or mechanics. Story creators have complete freedom to define their own game rules, statistics, and mechanics.

**Template-Driven Design**: All RPG mechanics are defined through templates created by story authors, allowing for unlimited customization and creativity.

**No Hardcoded Systems**: The platform does not impose any specific game system or mechanics, allowing creators complete freedom in their design choices.

**Data Type Flexibility**: Support for various data types including numbers, strings, booleans, arrays, and complex objects to accommodate any type of game mechanic.

**Custom Calculations**: Flexible formula system that allows creators to define their own calculations, checks, and conditional logic.

### Creator Empowerment

The system empowers story creators to build exactly the type of game mechanics they envision without technical constraints.

**Visual Template Builder**: Intuitive interface for creating and configuring RPG templates without requiring programming knowledge.

**Testing Framework**: Comprehensive testing tools for validating template mechanics and ensuring proper functionality.

**Community Sharing**: Template sharing and collaboration features enable community knowledge sharing and template evolution.

**Documentation Tools**: Built-in documentation and help systems guide creators through template creation and mechanics design.

## User Experience Priorities

### Accessibility First

All features must be designed with accessibility as a primary consideration, ensuring inclusive experiences for users with diverse abilities.

**WCAG Compliance**: Meet WCAG 2.1 AA standards for all user interface elements and interactions.

**Screen Reader Support**: Comprehensive screen reader compatibility with proper semantic markup and ARIA labels.

**Keyboard Navigation**: Full keyboard navigation support for all interactive elements and workflows.

**Mobile Accessibility**: Touch-friendly interfaces with appropriate sizing and gesture support.

### Performance and Responsiveness

Deliver fast, responsive experiences across all devices and network conditions.

**Mobile-First Design**: Responsive design that works seamlessly across desktop, tablet, and mobile devices.

**Progressive Loading**: Efficient loading strategies that prioritize critical content and functionality.

**Offline Capabilities**: Progressive web app features including offline reading and content caching.

**Performance Monitoring**: Comprehensive performance monitoring and optimization based on real user metrics.

### Intuitive Design

Create intuitive interfaces that make complex functionality accessible to users of all technical skill levels.

**Visual Feedback**: Clear visual feedback for all user actions and system states.

**Error Prevention**: Design patterns that prevent errors and guide users toward successful outcomes.

**Progressive Disclosure**: Reveal complexity gradually as users become more comfortable with the platform.

**Contextual Help**: Integrated help and guidance systems that provide assistance when and where needed.

## Community and Ecosystem

### Creator Community

Foster a thriving community of story creators with tools for collaboration, learning, and growth.

**Knowledge Sharing**: Documentation, tutorials, and community resources for learning story creation and RPG mechanics design.

**Collaboration Tools**: Features that enable creators to work together on stories and share expertise.

**Creator Analytics**: Comprehensive analytics and insights to help creators understand their audience and improve their content.

**Recognition Systems**: Achievement and recognition systems that celebrate creator contributions and milestones.

### Reader Community

Build an engaged reader community with social features and personalized experiences.

**Social Features**: Following, commenting, and community interaction features that connect readers with creators and each other.

**Personalization**: Recommendation systems and personalized content discovery based on reading preferences and history.

**Achievement Systems**: Reading achievements and progress tracking that gamify the reading experience.

**Community Events**: Platform events and challenges that bring the community together around shared interests.

This project context provides comprehensive guidance for understanding the platform's vision, technical architecture, and development principles while emphasizing the completely flexible RPG mechanics system that empowers story creators with unlimited creative freedom.

