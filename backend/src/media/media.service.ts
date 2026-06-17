import { PutObjectCommand, S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import { fromLoginCredentials } from '@aws-sdk/credential-providers';
import { Injectable } from '@nestjs/common';
import path from 'path';
import { AppConfig } from 'src/common/config/AplicationConfig';
import { uuidv7 } from 'uuidv7';

@Injectable()
export class MediaService {
  private readonly cloudFrontDomain: string;
  private readonly fileBucketName: string;

  constructor(
    private readonly s3Client: S3Client,
    cloudFrontDomain: string,
    fileBucketName: string,
  ) {
    this.cloudFrontDomain = cloudFrontDomain;
    this.fileBucketName = fileBucketName;
  }

  static of(appConfig: AppConfig): MediaService {
    const s3ClientConfig: S3ClientConfig = {
      region: appConfig.aws.s3Region,
    };

    if (appConfig.hasAwsProfile) {
      s3ClientConfig.credentials = fromLoginCredentials({ profile: appConfig.aws.profile });
    }

    return new MediaService(
      new S3Client(s3ClientConfig),
      appConfig.aws.cloudFrontDomain,
      appConfig.aws.mediaFileBucketName,
    );
  }

  async uploadMediaFile(
    fileOriginalName: string,
    buffer: Buffer,
    userId: string,
    now: Date,
  ): Promise<string> {
    const key = this.generateKey(userId, fileOriginalName, now);

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.fileBucketName,
        Key: key,
        Body: buffer,
      }),
    );

    return `${this.cloudFrontDomain}/${key}`;
  }

  private generateKey(userId: string, fileOriginameName: string, now: Date): string {
    const fileExtension = path.extname(fileOriginameName).slice(1);

    return (
      path.join(
        'media',
        userId,
        `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`,
        uuidv7(),
      ) + `.${fileExtension}`
    );
  }
}
