/// @module agent-orchestrator
/// Phase 2: Agentic Infrastructure (Track 1)
/// Orchestrates dynamic tasks between agents autonomously.

export interface SubTask {
  id: string;
  assignedAgentId: string;
  objective: string;
  status: 'PENDING' | 'EXECUTING' | 'COMPLETED' | 'FAILED';
  result?: string;
}

export class AgentOrchestrator {
  private activeSubTasks: Map<string, SubTask> = new Map();

  /**
   * Spawns a multi-agent delegation sequence without Human-in-the-loop blocking.
   */
  public delegateTask(objective: string, subordinateAgentId: string): string {
    const taskId = `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    this.activeSubTasks.set(taskId, {
      id: taskId,
      assignedAgentId: subordinateAgentId,
      objective,
      status: 'PENDING'
    });

    return taskId;
  }

  public completeTask(taskId: string, resultData: string): void {
    const task = this.activeSubTasks.get(taskId);
    if (!task) throw new Error(`Subtask ${taskId} not found.`);
    
    task.status = 'COMPLETED';
    task.result = resultData;
  }

  public getTaskStatus(taskId: string): SubTask | undefined {
    return this.activeSubTasks.get(taskId);
  }
}
