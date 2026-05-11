import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AiChatService } from './ai-chat.service';

@Controller('ai-chat')
export class AiChatController {
  constructor(private readonly aiChatService: AiChatService) {}

  @Post('message')
  async sendMessage(@Body() body: { messages: any[] }) {
    if (!body.messages || !Array.isArray(body.messages)) {
      throw new HttpException('El formato de mensajes es inválido', HttpStatus.BAD_REQUEST);
    }

    // Limitamos la cantidad de mensajes que pueden venir desde el frontend
    // para cumplir el límite de 10 mensajes por sesión
    if (body.messages.length > 20) { // 10 del user + 10 del assistant
      throw new HttpException('Se ha superado el límite de mensajes por sesión.', HttpStatus.BAD_REQUEST);
    }

    try {
      const assistantMessage = await this.aiChatService.getChatCompletion(body.messages);
      return assistantMessage;
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
