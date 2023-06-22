import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { TaskModel } from './model/task.model';

@Module({
  controllers: [TaskController],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: TaskModel,
        schemaOptions: {
          collection: 'tasks',
        },
      },
    ]),
  ],
  providers: [TaskService]
})
export class TaskModule {}
