import { Controller, Post, Get, Body, Headers, UnauthorizedException } from '@nestjs/common';
import { ClassroomsService } from './classrooms.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { JoinClassroomDto } from './dto/join-classroom.dto';

@Controller('aulas')
export class ClassroomsController {
  constructor(private readonly classroomsService: ClassroomsService) {}

  @Post()
  async create(
    @Body() createClassroomDto: CreateClassroomDto,
    @Headers('user-id') userId: string,
  ) {
    if (!userId) {
      throw new UnauthorizedException('User ID is required in headers (temporary)');
    }
    return await this.classroomsService.create(createClassroomDto, userId);
  }

  @Get()
  async findAll(@Headers('user-id') userId: string) {
    if (!userId) {
      throw new UnauthorizedException('User ID is required in headers (temporary)');
    }
    return await this.classroomsService.findAll(userId);
  }

  @Post('unirse')
  async join(
    @Body() joinClassroomDto: JoinClassroomDto,
    @Headers('user-id') userId: string,
  ) {
    if (!userId) {
      throw new UnauthorizedException('User ID is required in headers (temporary)');
    }
    return await this.classroomsService.join(joinClassroomDto, userId);
  }
}
