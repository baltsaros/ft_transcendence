import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class FortyTwoAuthGuard extends AuthGuard('42') {
  async canActivate(context: ExecutionContext): Promise<any> {
    console.log('canActivate');
    const activate = ( await super.canActivate(context)) as boolean;
    console.log(activate);
    const request = context.switchToHttp().getRequest();
    console.log('super login');
    await super.logIn(request);
    console.log('exit');
    return activate;
  }
}

// @Injectable()
// export class AuthenticatedGuard implements CanActivate {
//   async canActivate(context: ExecutionContext): Promise<any> {
//     console.log('context' + context);
//     const request = context.switchToHttp().getRequest();
//     return request.isAuthenticated();
//   }
// }