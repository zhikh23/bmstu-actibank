import { Module } from '@nestjs/common';
import { OidcAdapter } from './oidc.adapter';

@Module({
  providers: [OidcAdapter],
  exports: [OidcAdapter],
})
export class OidcModule {}
