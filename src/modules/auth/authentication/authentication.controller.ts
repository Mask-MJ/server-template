import { Controller, Post, Body, Headers } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { RefreshTokenDto, SignInDto, SignUpDto } from './authentication.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
import { SignInEntity } from './authentication.entity';

@ApiTags('登录认证')
@Auth(AuthType.None)
@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  /**
   * 注册
   */
  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authenticationService.signUp(signUpDto);
  }

  /**
   * 登录
   */
  @Post('sign-in')
  @ApiOkResponse({ type: SignInEntity })
  signIn(@Body() signInDto: SignInDto, @Headers('X-Real-IP') ip?: string) {
    return this.authenticationService.signIn(signInDto, ip);
  }

  /**
   * 刷新令牌
   */
  @Post('refresh-token')
  @ApiOkResponse({ type: SignInEntity })
  refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authenticationService.refreshTokens(refreshTokenDto);
  }
}
