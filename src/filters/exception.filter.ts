import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger, HttpStatus } from '@nestjs/common'
import { QueryFailedError } from 'typeorm'
import { Request, Response } from 'express'

/**
 * Exception filter for intercepting error and handle request response.
 * Handling DB query and HTTP request errors.
 *
 * @export
 * @class HttpExceptionFilter
 * @typedef {HttpExceptionFilter}
 * @implements {ExceptionFilter}
 */
@Catch(HttpException, QueryFailedError)
export class HttpExceptionFilter implements ExceptionFilter {
    logger: Logger

    constructor() {
        this.logger = new Logger('RequestException')
    }

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse<Response>()
        const request = ctx.getRequest<Request>()

        let status = HttpStatus.INTERNAL_SERVER_ERROR
        let message = 'An unexpected error occurred'

        if (exception instanceof QueryFailedError) {
            status = HttpStatus.BAD_REQUEST
            message = `Query failed: ${exception.message}`

            if (exception.driverError.code === '23505') {
                status = HttpStatus.CONFLICT
                message = 'Duplicate key value violates unique constraint'
            }
        } else if (exception instanceof HttpException) {
            status = exception.getStatus()
            message = exception.message
        }

        this.logger.error({ exception })

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message,
            messages: exception.response?.message,
        })
    }
}
