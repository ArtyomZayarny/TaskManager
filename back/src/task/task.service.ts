import { Injectable } from '@nestjs/common';
import { TaskDto } from './dto/task.dto';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { TaskModel } from './model/task.model';

@Injectable()
export class TaskService {
    constructor(
        @InjectModel(TaskModel)
        private readonly taskModel: ModelType<TaskModel>
    ){}

    async create(task:TaskDto) {
        return this.taskModel.create(task);
    }
}
