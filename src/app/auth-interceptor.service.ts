import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';

export class AuthInterceptorService implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        console.log('request is on its way');
        console.log(req.url);
        // modifying a request...
        const modifiedRequest = req.clone({ headers: req.headers.append('Auth', 'xyz') });
        return next.handle(modifiedRequest);
    }
}
