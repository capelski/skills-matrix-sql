import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';

export class SqlException extends Error {}

const logger = new Logger('SqlExceptionFilter');

@Catch()
export default class SqlExceptionFilter implements ExceptionFilter {
  catch(error: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    if (!(error instanceof SqlException)) {
      const next = ctx.getNext();
      return next();
    }

    const response = ctx.getResponse();
    logger.error(error.message);
    response.status(500).json({ message: error.message });
  }
}
