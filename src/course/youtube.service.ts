import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import Innertube from 'youtubei.js';

@Injectable()
export class YoutubeService {
  private youtube: Innertube;

  constructor(private readonly configService: ConfigService) {
    this.initYoutube().then((youtube) => {
      this.youtube = youtube;
    });
  }

  private async initYoutube() {
    return await Innertube.create({
      retrieve_player: false,
    });
  }

  async getYoutubeVideoId(searchQuery: string): Promise<string> {
    const youtubeApiKey = this.configService.get<string>('YOUTUBE_API');

    // hello world => hello+world
    searchQuery = encodeURIComponent(searchQuery);

    const { data } = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?key=${youtubeApiKey}&q=${searchQuery}&videoDuration=medium&videoEmbeddable=true&type=video&maxResults=5`,
    );

    if (!data.items?.length) {
      console.log('No Youtube Videos returned from that search query');
      return '';
    }

    // return the first video
    return data.items[0].id.videoId;
  }

  async getYoutubeVideoTranscript(videoId: string): Promise<string> {
    try {
      const videoInfo = await this.youtube.getInfo(videoId); // get video info by video Id
      const transcriptData = await videoInfo.getTranscript();

      if (!transcriptData?.transcript?.content?.body?.initial_segments) {
        throw new Error('No transcript data available');
      }

      const formattedTranscript =
        transcriptData.transcript.content?.body?.initial_segments
          .map((segment) => segment.snippet.text)
          .join(' ')
          .replaceAll('\n', '');

      return formattedTranscript;
    } catch (error) {
      console.error('Error: Error when transcribing Youtube Video', error);
      return '';
    }
  }
}
