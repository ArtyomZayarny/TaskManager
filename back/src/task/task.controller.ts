import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { TaskDto } from './dto/task.dto';
import { TaskService } from './task.service';
import { Types } from 'mongoose';
import { TASK_NOT_FOUND } from './constants';

@Controller('task')
export class TaskController {

    constructor(private readonly taskService:TaskService){}

    @Post('create')
    async createTask(@Body() task:TaskDto) {
        return this.taskService.create(task)
    }

    @Get(':id')
    async fetchTaskListByUserId(@Param('id') id:string) {
        return this.taskService.getTasksByUserId(id)
    }

    @Delete(':id')
    async deleteTask(@Param('id') id:string){
        const deletedProduct = this.taskService.deleteTask(id)
        if(!deletedProduct) {
            throw new NotFoundException(TASK_NOT_FOUND);
        }
    }

    // @Patch(':id')
    // async updateTask(@Param('id') id:string, @Body() dto:TaskDto){

    // }
}
