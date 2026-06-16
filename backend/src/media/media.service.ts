import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
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
    return new MediaService(
      new S3Client({
        region: appConfig.aws.s3Region,
      }),
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
