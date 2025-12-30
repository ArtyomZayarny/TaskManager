import { Body, Controller, Delete, Get, NotFoundException, Param,  Patch,  Post, UseGuards, } from '@nestjs/common';
import { TaskDto } from './dto/task.dto';
import { TaskService } from './task.service';
import { TASK_NOT_FOUND } from './constants';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';

@Controller('task')
export class TaskController {

    constructor(private readonly taskService:TaskService){}

   @UseGuards(JwtAuthGuard)
    @Post('create')
    async createTasktask(@Body() task:TaskDto) {
       return this.taskService.create(task)
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async fetchTaskListByUserId(@Param('id') id:string) {
        return this.taskService.getTasksByUserId(id)
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteTask(@Param('id') id:string){
        const deletedProduct = this.taskService.deleteTask(id)
        if(!deletedProduct) {
            throw new NotFoundException(TASK_NOT_FOUND);
        }
    }

    @Patch(':id')
    async updateTask(@Param('id') id:string, @Body() task:TaskDto){
        const updatedProduct = await this.taskService.updateById(id, task);

        if (!updatedProduct) {
          throw new NotFoundException(TASK_NOT_FOUND);
        }
    
        return updatedProduct;
    }
}
