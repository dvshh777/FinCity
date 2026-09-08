import React from 'react';
import { CharacterAvatar } from './CharacterAvatar';

export interface NovaGuideProps {
  characterId?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  expression?: 'wave' | 'happy' | 'thinking' | 'celebrate' | 'point' | 'idle';
  showSpeech?: boolean;
  speechText?: string;
  className?: string;
}

export const NovaGuide: React.FC<NovaGuideProps> = ({
  characterId = 'nova',
  size = 'md',
  expression = 'wave',
  showSpeech = false,
  speechText,
  className = '',
}) => {
  const mappedExpression = expression === 'point' ? 'wave' : expression;
  return (
    <CharacterAvatar
      characterId={characterId}
      size={size}
      expression={mappedExpression}
      showSpeech={showSpeech}
      speechText={speechText}
      className={className}
    />
  );
};
