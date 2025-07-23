# Testing Documentation

## Overview

This project uses Jest as the testing framework with comprehensive test coverage across unit, integration, performance, and end-to-end tests.

## Test Structure

```
tests/
├── setup.ts              # Global test configuration
├── helpers/              # Test utilities and helpers
│   ├── assertions.ts     # Custom assertions
│   ├── generators.ts     # Test data generators
│   ├── testServer.ts     # Mock server implementation
│   └── database.ts       # Test database utilities
├── mocks/                # Mock implementations
│   └── stateManager.ts   # Mock state manager
├── unit/                 # Unit tests for individual modules
│   ├── lensGenerator.test.ts
│   ├── ideaProcessor.test.ts
│   ├── crossPollinator.test.ts
│   ├── stateManager.test.ts
│   └── prompts.test.ts
├── integration/          # Integration tests
│   ├── fullFlow.test.ts
│   └── tools.integration.test.ts
├── e2e/                  # End-to-end user scenarios
│   └── userScenarios.test.ts
├── performance/          # Performance and load tests
│   └── load.test.ts
├── benchmarks/           # Creativity benchmarks
│   └── creativity.test.ts
└── metrics/              # Quality metrics
    └── quality.ts

```

## Running Tests

### All Tests
```bash
npm test                  # Run all tests
npm run test:coverage     # Run with coverage report
npm run test:watch        # Run in watch mode
```

### Specific Test Suites
```bash
npm run test:unit         # Unit tests only
npm run test:integration  # Integration tests
npm run test:e2e          # End-to-end tests
npm run test:performance  # Performance tests
npm run test:benchmarks   # Creativity benchmarks
```

### Running Individual Tests
```bash
npm test -- tests/unit/lensGenerator.test.ts
npm test -- --testNamePattern="Domain Diversity"
```

## Test Categories

### Unit Tests
Test individual components in isolation:
- Module functionality
- Edge cases
- Error handling
- Input validation

### Integration Tests
Test component interactions:
- Full workflow testing
- State persistence
- Tool coordination
- Resource access

### Performance Tests
Measure system performance:
- Response times
- Concurrent request handling
- Memory usage
- Scalability

### E2E Tests
Simulate real user scenarios:
- Startup founder use case
- Product manager workflow
- Researcher exploration
- Enterprise innovation

### Creativity Benchmarks
Evaluate creative output quality:
- Domain diversity
- Metaphor originality
- Idea uniqueness
- Temporal consistency

## Quality Metrics

The test suite includes comprehensive quality metrics:

1. **Uniqueness Score**: Measures variety in generated content
2. **Semantic Diversity**: Evaluates conceptual spread
3. **Temporal Consistency**: Tracks quality stability over time
4. **Creativity Index**: Combined metric of multiple factors

## Interpreting Results

### Coverage Report
After running tests with coverage:
```bash
npm run test:coverage
```

View the report at `coverage/lcov-report/index.html`

Target coverage goals:
- Statements: > 80%
- Branches: > 75%
- Functions: > 80%
- Lines: > 80%

### Performance Baselines
Expected performance metrics:
- Lens generation: < 50ms average
- Idea evolution: < 100ms average
- Cross-pollination: < 150ms average
- Concurrent requests: < 100ms per request

### Creativity Benchmarks
Minimum acceptable scores:
- Domain diversity: > 0.8
- Metaphor originality: > 0.7
- Overall creativity: > 0.7
- Quality consistency: > 0.7

## CI/CD Integration

Tests run automatically on:
- Push to main/develop branches
- Pull requests
- Scheduled daily runs

GitHub Actions workflow includes:
1. Linting and type checking
2. Unit and integration tests
3. Performance testing
4. Security scanning
5. Quality metrics collection

## Writing New Tests

### Test Structure
```typescript
describe('Component Name', () => {
  let component: Component;
  
  beforeEach(() => {
    component = new Component();
  });
  
  describe('method name', () => {
    test('should do something specific', () => {
      // Arrange
      const input = 'test';
      
      // Act
      const result = component.method(input);
      
      // Assert
      expect(result).toBe('expected');
    });
  });
});
```

### Using Test Helpers
```typescript
import { 
  generateTestProblem,
  expectValidPromptStructure,
  createTestContext 
} from '../helpers';

test('example test', async () => {
  const context = createTestContext();
  const problem = generateTestProblem('business');
  
  const result = await context.server.callTool('generate_creative_lens_prompt', {
    problem
  });
  
  expectValidPromptStructure(result);
});
```

### Custom Matchers
```typescript
// Available custom matchers
expect(prompt).toBeValidPrompt();
expect(score).toHaveMinimumCreativityScore(0.7);
expect(domains).toContainUniqueDomains(5);
```

## Troubleshooting

### Common Issues

1. **Timeout errors**: Increase timeout in jest.config.js
2. **Memory issues**: Run tests in smaller batches
3. **Flaky tests**: Check for race conditions or external dependencies
4. **Coverage gaps**: Use coverage report to identify untested code

### Debug Mode
```bash
# Run tests with debug output
DEBUG=* npm test

# Run specific test in debug mode
node --inspect-brk node_modules/.bin/jest tests/unit/lensGenerator.test.ts
```

## Best Practices

1. **Isolation**: Each test should be independent
2. **Descriptive names**: Test names should explain what they verify
3. **Arrange-Act-Assert**: Follow AAA pattern for clarity
4. **Mock external dependencies**: Use mocks for external services
5. **Test edge cases**: Include boundary conditions and error scenarios
6. **Performance awareness**: Keep tests fast and efficient