import {  Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(config : ConfigService) {
        super({
            clientID: config.get<string>('GOOGLE_CLIENT_ID'),
            clientSecret: config.get<string>('GOOGLE_CLIENT_SECRET'),
            callbackURL: config.get<string>('GOOGLE_CALLBACK_URL'),
            scope: ['email', 'profile'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
        const { id , name, emails, photos, provider } = profile;
        const user = {
            providerId: id,
            provider,
            email: emails[0].value,
            name : name.givenName + " " + name.familyName,
            picture: photos[0].value,
            accessToken,
        }
        done(null, user);
    }

}