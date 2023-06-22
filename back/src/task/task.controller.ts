import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { TaskDto } from './dto/task.dto';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {

    constructor(private readonly taskService:TaskService){}

    @Post('create')
    async createTask(@Body() task:TaskDto) {
        return this.taskService.create(task)
    }

    // @Delete(':id')
    // async deleteTask(@Param('id') id:string){

    // }

    // @Patch(':id')
    // async updateTask(@Param('id') id:string, @Body() dto:TaskDto){

    // }
}
