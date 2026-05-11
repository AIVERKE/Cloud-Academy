import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiChatService {
  private readonly logger = new Logger(AiChatService.name);
  private openai: OpenAI;
  
  private readonly SYSTEM_PROMPT = `Eres un asistente virtual amigable y experto para Cloud Academy, la plataforma en la nube de la aplicación UMSA (Universidad Mayor de San Andrés).
Tu objetivo principal es ayudar a los estudiantes, docentes y administradores respondiendo preguntas **exclusivamente** sobre el funcionamiento de Cloud Academy y UMSA.

Funciones clave de Cloud Academy:
- Acceso y gestión de Recursos de Google Drive sincronizados en tiempo real.
- Visualización de Bitácoras de progreso.
- Estructura de módulos de la aplicación.
- Aspectos académicos y generales de la Universidad Mayor de San Andrés.

REGLAS DE ORO:
1. Responde de forma concisa, educada y clara.
2. Si un usuario te pregunta algo completamente fuera del contexto de Cloud Academy o UMSA (ej. programación general, historia, curiosidades sin relación), debes rechazar cortésmente la pregunta diciendo que solo puedes ayudar con temas relacionados a Cloud Academy o UMSA.
3. Puedes dar consejos técnicos SIEMPRE que estén en el contexto del uso de la plataforma.
`;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: 'https://api.deepseek.com/v1',
    });
  }

  async getChatCompletion(messages: any[]) {
    try {
      const response = await this.openai.chat.completions.create({
        model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
        messages: [
          { role: 'system', content: this.SYSTEM_PROMPT },
          ...messages,
        ],
        temperature: 0.5,
        max_tokens: 1000,
      });

      return response.choices[0].message;
    } catch (error) {
      this.logger.error('Error connecting to DeepSeek API', error);
      throw new Error('No se pudo comunicar con el asistente de IA en este momento.');
    }
  }
}
