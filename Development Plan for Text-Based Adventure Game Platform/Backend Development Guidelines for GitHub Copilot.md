# Backend Development Guidelines for GitHub Copilot

## NestJS Application Structure

This text-based adventure platform uses NestJS with a modular, domain-driven architecture. The backend handles user management, story creation and editing, flexible RPG mechanics, gameplay sessions, and community features.

### Core Module Organization

The application follows a clear modular structure with separation of concerns and provider-agnostic design:

**Root Level Structure:**
- Application bootstrap and configuration management
- Common utilities and shared functionality
- Provider abstractions for external services
- Feature modules organized by business domain
- Database configuration and migration management

**Module Organization Principles:**
- Each feature module encapsulates related functionality
- Clear interfaces between modules with dependency injection
- Shared utilities in common module for reusability
- Provider abstractions for external service integration
- Configuration management with environment-specific settings

### Provider-Agnostic Service Pattern

All external dependencies must be abstracted through interfaces and implemented using the provider pattern. This ensures the application can work with different service providers without changing business logic.

**Provider Categories:**
- Storage providers for file and asset management
- Email providers for user communication and notifications
- Logging providers for application monitoring and debugging
- Cache providers for performance optimization
- Authentication providers for user security and session management

**Implementation Requirements:**
- Abstract interfaces defining service contracts
- Multiple concrete implementations for different providers
- Factory patterns for provider selection and configuration
- Environment-based provider switching capabilities
- Default implementations for development and testing

## Authentication and Authorization

### JWT-Based Authentication

Implement secure JWT-based authentication with proper token management, refresh token rotation, and comprehensive security measures.

**Authentication Flow:**
- User registration with email verification and secure password hashing
- Login process with credential validation and token generation
- Token refresh mechanism with rotation and security validation
- Logout functionality with proper token invalidation
- Multi-factor authentication support for enhanced security

**Security Considerations:**
- Secure password hashing with appropriate salt rounds
- JWT token security with proper signing and validation
- Session management with secure token storage and transmission
- Rate limiting for authentication endpoints to prevent abuse
- Comprehensive audit logging for security monitoring

### Role-Based Access Control (RBAC)

Implement comprehensive authorization system with role-based permissions and resource-level access controls.

**Authorization Framework:**
- Role definition with hierarchical permission structures
- Resource-based permissions for fine-grained access control
- Dynamic permission evaluation based on user context
- Permission inheritance and delegation mechanisms
- Audit trails for authorization decisions and access patterns

**Implementation Patterns:**
- Guard-based authorization with decorator support
- Permission checking at service and controller levels
- Resource ownership validation for user-generated content
- Administrative permission management and delegation
- Integration with authentication system for seamless security

## Data Access and Database Management

### Prisma ORM Integration

Use Prisma as the primary ORM with type-safe database access, migration management, and performance optimization.

**Database Design Principles:**
- Normalized schema design with appropriate relationships
- JSONB fields for flexible data storage where appropriate
- Comprehensive indexing strategy for query performance
- Foreign key constraints for data integrity
- Soft delete implementation for audit trails

**Query Optimization:**
- Efficient query patterns with proper relation loading
- Connection pooling for optimal database resource usage
- Query performance monitoring and optimization
- Caching strategies for frequently accessed data
- Database migration management with version control

### Repository Pattern Implementation

Implement repository pattern for complex business logic and data access abstraction.

**Repository Design:**
- Abstract repository interfaces for business logic isolation
- Concrete implementations with Prisma integration
- Transaction management for data consistency
- Error handling with proper exception translation
- Performance optimization with query batching and caching

**Data Validation:**
- Input validation at multiple layers with comprehensive rules
- Business rule validation in service layer
- Database constraint validation for data integrity
- Custom validation decorators for reusable validation logic
- Error handling with user-friendly error messages

## RPG Template System

### Flexible Template Architecture

Design a completely flexible RPG template system that can accommodate any type of game mechanics without hardcoding specific implementations.

**Template Structure:**
- JSON-based template definitions with schema validation
- Flexible stat systems supporting various data types
- Custom calculation engines for template-defined mechanics
- Validation frameworks ensuring template completeness
- Version control for template evolution and backward compatibility

**Template Management:**
- Template creation and editing with comprehensive validation
- Template sharing and permission management
- Template versioning with migration support
- Template testing and validation tools
- Community template library with discovery features

### Mechanics Processing Engine

Implement a generic mechanics processing engine that can handle any type of RPG mechanics defined by templates.

**Engine Design:**
- Generic calculation framework supporting custom formulas
- Conditional logic processing for complex branching scenarios
- State management for character progression and game state
- Performance optimization for complex calculations
- Error handling with clear feedback for creators and players

**Integration Points:**
- Story flow integration with mechanics-based branching
- Character system integration with template-defined stats
- Save system integration with mechanics state preservation
- Analytics integration for mechanics usage and balance analysis
- Testing framework for mechanics validation and debugging

## Story Management System

### Node-Based Story Structure

Implement a flexible node-based story system that supports complex branching narratives with integrated RPG mechanics.

**Story Architecture:**
- Node-based story structure with flexible content types
- Connection system for story flow and branching logic
- Content management with rich text and media support
- Version control for collaborative story editing
- Performance optimization for large story structures

**Content Processing:**
- Rich text processing with sanitization and validation
- Media upload and optimization with CDN integration
- Asset management with organization and cleanup utilities
- Content validation with quality assurance checks
- Search and discovery optimization for story content

### Collaborative Editing System

Implement real-time collaborative editing capabilities for story creation with conflict resolution and version management.

**Collaboration Features:**
- Real-time editing with operational transformation
- Conflict resolution for simultaneous editing
- Permission management for collaborative access
- Change tracking with comprehensive audit trails
- Communication tools for creator coordination

**Performance Considerations:**
- Efficient synchronization algorithms for real-time updates
- Caching strategies for collaborative editing performance
- Resource management for concurrent editing sessions
- Scalability design for large collaborative projects
- Error handling for network interruptions and conflicts

## Gameplay Session Management

### Session State Management

Implement comprehensive session management for gameplay with character progression, save systems, and RPG mechanics integration.

**Session Architecture:**
- Session initialization with character creation based on templates
- State persistence with comprehensive game data preservation
- Progress tracking with milestone and achievement systems
- Save system with multiple save slots and cloud synchronization
- Session cleanup and resource management

**RPG Integration:**
- Character stat management based on template definitions
- Mechanics resolution with template-defined rules
- Inventory and item management with custom item systems
- Progression tracking with template-defined advancement
- Analytics integration for gameplay pattern analysis

### Real-Time Features

Implement real-time features for enhanced gameplay experience and community interaction.

**Real-Time Capabilities:**
- WebSocket integration for real-time communication
- Live updates for collaborative features and community interaction
- Real-time notifications for user engagement
- Performance optimization for real-time data transmission
- Error handling and reconnection logic for network issues

**Scalability Design:**
- Horizontal scaling for real-time features
- Load balancing for WebSocket connections
- Resource management for concurrent real-time sessions
- Performance monitoring for real-time feature optimization
- Caching strategies for real-time data delivery

## API Design and Documentation

### RESTful API Design

Design comprehensive RESTful APIs with consistent patterns, proper error handling, and comprehensive documentation.

**API Standards:**
- Consistent URL patterns and HTTP method usage
- Standardized response formats with error handling
- Comprehensive input validation with clear error messages
- Rate limiting and security measures for all endpoints
- Version management for API evolution and backward compatibility

**Documentation Requirements:**
- Comprehensive API documentation with OpenAPI/Swagger
- Request and response examples for all endpoints
- Error code documentation with troubleshooting guidance
- Authentication and authorization documentation
- Integration examples and SDK documentation

### Error Handling and Logging

Implement comprehensive error handling and logging for debugging, monitoring, and user experience optimization.

**Error Management:**
- Structured error handling with consistent error formats
- User-friendly error messages with actionable guidance
- Error classification and severity levels
- Error recovery mechanisms and fallback strategies
- Integration with monitoring and alerting systems

**Logging Strategy:**
- Structured logging with consistent formats and context
- Performance logging for optimization and monitoring
- Security logging for audit trails and threat detection
- Error logging with stack traces and debugging information
- Log aggregation and analysis for system insights

## Testing Strategy

### Comprehensive Testing Framework

Implement comprehensive testing strategy with unit tests, integration tests, and end-to-end testing coverage.

**Testing Requirements:**
- Unit tests for all service methods and business logic
- Integration tests for API endpoints and database operations
- End-to-end tests for complete user workflows
- Performance tests for scalability and optimization
- Security tests for vulnerability detection and prevention

**Test Organization:**
- Test structure mirroring application architecture
- Shared test utilities and fixtures for consistency
- Mock implementations for external dependencies
- Test data management with automated setup and cleanup
- Continuous integration with automated test execution

### Quality Assurance

Implement quality assurance measures including code coverage, performance monitoring, and security scanning.

**Quality Metrics:**
- Code coverage requirements with minimum thresholds
- Performance benchmarks with regression detection
- Security scanning with vulnerability assessment
- Code quality analysis with automated recommendations
- Documentation coverage with completeness validation

**Continuous Improvement:**
- Regular code reviews with architecture compliance checking
- Performance optimization based on monitoring data
- Security updates with vulnerability management
- Refactoring initiatives for technical debt reduction
- Knowledge sharing and best practice documentation

This backend development guide provides comprehensive guidance for building a scalable, maintainable, and secure backend system that supports completely flexible RPG mechanics while maintaining high performance and code quality standards.

