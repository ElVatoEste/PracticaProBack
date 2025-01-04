import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class ValidationExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse() as { message: any; error: string } | any;

        let message: string;
        if (Array.isArray(exceptionResponse.message)) {
            message = exceptionResponse.message[0]; // Mostrar solo la posición 0
        } else {
            message = exceptionResponse.message;
        }

        response.status(status).json({
            statusCode: status,
            message,
            error: exceptionResponse.error || 'Bad Request',
        });
    }
}
