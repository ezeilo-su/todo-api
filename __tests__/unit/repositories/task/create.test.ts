import { DateTime } from 'luxon';

import { taskSchema } from '../../../../src/models/task.model';
import {
  CreateTaskDto,
  TaskPriority,
  TaskRepository
} from '../../../../src/repositories/mongoose/task';

describe('create task => TaskRepository.create', () => {
  it('should save a new task with and return the correct fields', async () => {
    const taskRepo = new TaskRepository(taskSchema);
    const taskDto: CreateTaskDto = {
      title: 'Learn Go',
      description: 'Learn web development with Golang',
      startTime: DateTime.utc().plus({ days: 2 }).toJSDate(),
      priorityLevel: TaskPriority.medium,
      notificationSubscription: {
        reminder: true,
        taskStarted: true
      },
      completionTime: DateTime.utc().plus({ days: 5 }).toJSDate()
    };

    const newTask = await taskRepo.createTask(taskDto);
    expect(newTask.kind).toEqual('ok');
    if (newTask.kind === 'ok') {
      expect(newTask).not.toBe(null);
    }

    const expectedObject = {
      id: expect.any(String),
      title: taskDto.title,
      description: taskDto.description,
      dateCreated: expect.any(Date),
      dateUpdated: expect.any(Date),
      startTime: expect.any(Date),
      completionTime: expect.any(Date),
      priorityLevel: TaskPriority.medium,
      notificationSubscription: expect.objectContaining({
        reminder: true,
        taskStarted: true
      })
    };

    if (newTask.kind === 'ok') {
      expect(newTask.data).toStrictEqual(expect.objectContaining(expectedObject));
    }
  });
});
