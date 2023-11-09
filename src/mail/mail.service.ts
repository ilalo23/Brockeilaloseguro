import { Injectable, MessageEvent } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createTransport } from "nodemailer";
/*import * as Mail from "nodemailer/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";*/
import { join } from "path";
import * as pug from 'pug';
/*import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";*/

@Injectable()
export default class EmailService {
  // private oAuth2Client: OAuth2Client;

  constructor(private readonly configService: ConfigService) {
    /*const OAuth2 = google.auth.OAuth2;
    this.oAuth2Client = new OAuth2({
      clientId: this.configService.get("OAUTH_CLIENT_ID"),
      clientSecret: this.configService.get("OAUTH_CLIENT_SECRET"),
      redirectUri: "https://developers.google.com/oauthplayground",
    });

    this.oAuth2Client.setCredentials({
      refresh_token: this.configService.get("OAUTH_REFRESH_TOKEN"),
    });*/
  }

  async sendMail(to: string, subject: string, template: string, data?: any) {
    /*// Access token
    const googleToken = await this.oAuth2Client.getAccessToken();
    // transport nodemailer
    const transport = createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: this.configService.get("GMAIL_USER"),
        clientId: this.configService.get("OAUTH_CLIENT_ID"),
        clientSecret: this.configService.get("OAUTH_CLIENT_SECRET"),
        refreshToken: this.configService.get("OAUTH_REFRESH_TOKEN"),
        accessToken: googleToken.token,
      },

      logger: true,
    });*/
    /*const transport = createTransport({

      port: 465,
      secure: true,
      auth: {
        user: 'noreply@ilaloseguros.com',
        pass: '?$t[&%-Ug3NEJdTmb-',
      },
      tls: {
        // If the server does not support secure connections
        rejectUnauthorized: false,
      },
      logging: true,

    });*/

    const transport = createTransport({
      name: "mail.ilaloseguros.com",
      host: "mail.ilaloseguros.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'noreply@ilaloseguros.com', // generated ethereal user
        pass: '?$t[&%-Ug3NEJdTmb-', // generated ethereal password
      },
      tls: {
        // If the server does not support secure connections
        rejectUnauthorized: false,
      },


    });

    transport.verify((err, success) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Server is ready to take our message");
      }
    });

    const html = pug.renderFile(join(__dirname, `/templates/${template}.pug`), {
      ...data,
    });
    return transport.sendMail({
      to,
      html,
      subject,
      headers: {
        priority: "high",
      },
      from: "Ilalo Seguros <noreply@prendarecuador.com>",
    });
  }
}
