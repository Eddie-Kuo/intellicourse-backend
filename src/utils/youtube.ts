import axios from 'axios';

import { Innertube } from 'youtubei.js';

export async function getYoutubeVideoId(searchQuery: string): Promise<string> {
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

export async function getYoutubeVideoTranscript(
  videoId: string,
): Promise<string> {
  const youtube = await Innertube.create();

  try {
    const videoInfo = await youtube.getInfo(videoId); // get video info by video Id
    const transcriptData = await videoInfo.getTranscript();
    console.log(
      '🚀 ~ getYoutubeVideoTranscript ~ transcriptData:',
      transcriptData.transcript.content?.body?.initial_segments
        .map((segment) => segment.snippet.text)
        .join(' '),
    );

    return (
      transcriptData.transcript.content?.body?.initial_segments
        .map((segment) => segment.snippet.text)
        .join(' ')
        .replaceAll('\n', '') || ''
    );
  } catch (error) {
    console.log('Error: Error when transcribing Youtube Video', error);
    return '';
  }
}
