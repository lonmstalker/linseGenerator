import { EventEmitter } from 'events';

export enum EventType {
  TOOL_CALLED = 'tool.called',
  TOOL_COMPLETED = 'tool.completed',
  TOOL_FAILED = 'tool.failed',
  SESSION_CREATED = 'session.created',
  SESSION_UPDATED = 'session.updated',
  SESSION_DELETED = 'session.deleted',
  IDEA_GENERATED = 'idea.generated',
  IDEA_EVOLVED = 'idea.evolved',
  HYBRID_CREATED = 'hybrid.created',
  CREATIVITY_EVALUATED = 'creativity.evaluated',
  RESOURCE_ACCESSED = 'resource.accessed',
  ERROR_OCCURRED = 'error.occurred'
}

export interface BaseEvent {
  type: EventType;
  timestamp: string;
  sessionId?: string;
  userId?: string;
}

export interface ToolEvent extends BaseEvent {
  toolName: string;
  arguments?: Record<string, unknown>;
  result?: unknown;
  error?: Error;
  duration?: number;
}

export interface SessionEvent extends BaseEvent {
  action: 'created' | 'updated' | 'deleted';
  metadata?: Record<string, unknown>;
}

export interface IdeaEvent extends BaseEvent {
  ideaId: string;
  domain?: string;
  creativityScore?: number;
  metadata?: Record<string, unknown>;
}

export interface ResourceEvent extends BaseEvent {
  resourceUri: string;
  resourceType: string;
  action: 'read' | 'list';
}

export interface ErrorEvent extends BaseEvent {
  error: Error;
  context?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export type CreativeLensEvent = ToolEvent | SessionEvent | IdeaEvent | ResourceEvent | ErrorEvent;

export class EventBus extends EventEmitter {
  private static instance: EventBus;

  private constructor() {
    super();
    this.setMaxListeners(100);
  }

  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  emitEvent(event: CreativeLensEvent): void {
    this.emit(event.type, event);
    this.emit('*', event); // Wildcard for all events
  }

  onEvent(eventType: EventType | '*', handler: (event: CreativeLensEvent) => void): void {
    this.on(eventType, handler);
  }

  offEvent(eventType: EventType | '*', handler: (event: CreativeLensEvent) => void): void {
    this.off(eventType, handler);
  }
}

export function createToolEvent(
  type: EventType,
  toolName: string,
  sessionId?: string,
  args?: Record<string, unknown>,
  result?: unknown,
  error?: Error,
  duration?: number
): ToolEvent {
  return {
    type,
    timestamp: new Date().toISOString(),
    sessionId,
    toolName,
    arguments: args,
    result,
    error,
    duration
  };
}

export function createSessionEvent(
  action: 'created' | 'updated' | 'deleted',
  sessionId: string,
  userId?: string,
  metadata?: Record<string, unknown>
): SessionEvent {
  return {
    type: EventType.SESSION_CREATED,
    timestamp: new Date().toISOString(),
    sessionId,
    userId,
    action,
    metadata
  };
}

export function createIdeaEvent(
  type: EventType,
  ideaId: string,
  sessionId?: string,
  domain?: string,
  creativityScore?: number,
  metadata?: Record<string, unknown>
): IdeaEvent {
  return {
    type,
    timestamp: new Date().toISOString(),
    sessionId,
    ideaId,
    domain,
    creativityScore,
    metadata
  };
}

export function createResourceEvent(
  resourceUri: string,
  resourceType: string,
  action: 'read' | 'list',
  sessionId?: string
): ResourceEvent {
  return {
    type: EventType.RESOURCE_ACCESSED,
    timestamp: new Date().toISOString(),
    sessionId,
    resourceUri,
    resourceType,
    action
  };
}

export function createErrorEvent(
  error: Error,
  context?: string,
  severity: 'low' | 'medium' | 'high' | 'critical' = 'medium',
  sessionId?: string
): ErrorEvent {
  return {
    type: EventType.ERROR_OCCURRED,
    timestamp: new Date().toISOString(),
    sessionId,
    error,
    context,
    severity
  };
}