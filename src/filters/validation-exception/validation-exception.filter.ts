import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class ValidationExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();

        // Asegurarse de que exceptionResponse sea un objeto antes de aplicar spread
        const responseBody = {
            statusCode: status,
            message: undefined,
            ...(typeof exceptionResponse === 'object' && exceptionResponse !== null ? exceptionResponse : { message: exceptionResponse }),
        };

        // Si el campo 'message' es un array, toma solo la primera posición
        if (Array.isArray(responseBody.message)) {
            responseBody.message = responseBody.message[0];
        }

        response.status(status).json(responseBody);
    }
}
