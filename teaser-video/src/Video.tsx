import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import { scenes } from './lib/timing';
import { Scene1Pain } from './scenes/Scene1_Pain';
import { Scene2Click } from './scenes/Scene2_Click';
import { Scene3Montage } from './scenes/Scene3_Montage';
import { Scene4Wow } from './scenes/Scene4_Wow';
import { Scene5Showcases } from './scenes/Scene5_Showcases';
import { Scene5ZoomOut } from './scenes/Scene5_ZoomOut';
import { Scene6Loop } from './scenes/Scene6_Loop';
import { Scene7CTA } from './scenes/Scene7_CTA';
import { SoundLayer } from './audio/SoundLayer';

export const Video: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* Audio layer — SFX placed at precise frame offsets */}
      <SoundLayer />
      <Series>
        <Series.Sequence durationInFrames={scenes.pain.duration}>
          <Scene1Pain />
        </Series.Sequence>
        <Series.Sequence durationInFrames={scenes.click.duration}>
          <Scene2Click />
        </Series.Sequence>
        <Series.Sequence durationInFrames={scenes.conversation.duration}>
          <Scene3Montage />
        </Series.Sequence>
        <Series.Sequence durationInFrames={scenes.wow.duration}>
          <Scene4Wow />
        </Series.Sequence>
        <Series.Sequence durationInFrames={scenes.showcases.duration}>
          <Scene5Showcases />
        </Series.Sequence>
        <Series.Sequence durationInFrames={scenes.zoomOut.duration}>
          <Scene5ZoomOut />
        </Series.Sequence>
        <Series.Sequence durationInFrames={scenes.loop.duration}>
          <Scene6Loop />
        </Series.Sequence>
        <Series.Sequence durationInFrames={scenes.cta.duration}>
          <Scene7CTA />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
