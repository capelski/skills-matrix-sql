import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

export class SqlException extends Error {}

@Catch()
export default class SqlExceptionFilter implements ExceptionFilter {
  catch(error: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    if (!(error instanceof SqlException)) {
      const next = ctx.getNext();
      return next();
    }

    const response = ctx.getResponse();
    response.status(500).json({ message: error.message });
  }
}
