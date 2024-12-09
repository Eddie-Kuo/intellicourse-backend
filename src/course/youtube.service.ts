import { Injectable } from '@nestjs/common';
import axios from 'axios';
import Innertube from 'youtubei.js';

@Injectable()
export class YoutubeService {
  async getYoutubeVideoId(searchQuery: string): Promise<string> {
    // hello world => hello+world
    searchQuery = encodeURIComponent(searchQuery);

    const { data } = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API}&q=${searchQuery}&videoDuration=medium&videoEmbeddable=true&type=video&maxResults=5`,
    );

    if (!data) {
      console.log('Youtube Search Failed!');
      return;
    }

    return data;
  }

  async getYoutubeVideoTranscript(videoId: string): Promise<string> {
    //! Getting [YOUTUBEJS][Parser]: ParsingError: Type mismatch
    const youtube = await Innertube.create({
      retrieve_player: false,
    });

    try {
      const videoInfo = await youtube.getInfo(videoId); // get video info by video Id
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
      console.log('Error: Error when transcribing Youtube Video', error);
      return '';
    }
  }
}
