import React from 'react';
import { GameComponentProps, GameId } from '../types';
import {
  FindLetterGame,
  LetterToPictureGame,
  MatchLettersGame,
  TraceLetterGame,
  UppercaseLowercaseGame,
} from './AlphabetGames';
import {
  CountObjectsGame,
  LittleAdditionGame,
  MissingNumberGame,
  MoreOrLessGame,
  NumberMatchingGame,
} from './MathGames';
import {
  BigOrSmallGame,
  ColorMatchingGame,
  ColorPatternGame,
  FindShapeGame,
  ShapeSortingGame,
} from './ShapesColorsGames';
import {
  AnimalHabitatsGame,
  AnimalMatchingGame,
  AnimalSoundsGame,
  OceanAnimalsGame,
  ShadowMatchingGame,
} from './AnimalsNatureGames';
import {
  CompletePatternGame,
  FindDifferenceGame,
  MemoryCardsGame,
  OddOneOutGame,
  PicturePuzzleGame,
} from './LogicGames';
import {
  ColoringFunGame,
  CutAndPasteGame,
  EmotionMatchingGame,
  HealthyFoodGame,
  SimpleMazeGame,
} from './CreativityGames';

export function renderMiniGame(gameId: GameId, props: GameComponentProps): React.ReactNode {
  switch (gameId) {
    // A: Alphabet & Literacy
    case 'match-letters':
      return <MatchLettersGame {...props} />;
    case 'find-letter':
      return <FindLetterGame {...props} />;
    case 'letter-picture':
      return <LetterToPictureGame {...props} />;
    case 'trace-letter':
      return <TraceLetterGame {...props} />;
    case 'upper-lower':
      return <UppercaseLowercaseGame {...props} />;

    // B: Numbers & Math
    case 'count-objects':
      return <CountObjectsGame {...props} />;
    case 'number-matching':
      return <NumberMatchingGame {...props} />;
    case 'little-addition':
      return <LittleAdditionGame {...props} />;
    case 'missing-number':
      return <MissingNumberGame {...props} />;
    case 'more-less':
      return <MoreOrLessGame {...props} />;

    // C: Shapes & Colors
    case 'shape-sorting':
      return <ShapeSortingGame {...props} />;
    case 'color-matching':
      return <ColorMatchingGame {...props} />;
    case 'find-shape':
      return <FindShapeGame {...props} />;
    case 'big-small':
      return <BigOrSmallGame {...props} />;
    case 'color-pattern':
      return <ColorPatternGame {...props} />;

    // D: Animals & Nature
    case 'animal-sounds':
      return <AnimalSoundsGame {...props} />;
    case 'shadow-matching':
      return <ShadowMatchingGame {...props} />;
    case 'animal-matching':
      return <AnimalMatchingGame {...props} />;
    case 'animal-habitats':
      return <AnimalHabitatsGame {...props} />;
    case 'ocean-animals':
      return <OceanAnimalsGame {...props} />;

    // E: Logic & Thinking
    case 'memory-cards':
      return <MemoryCardsGame {...props} />;
    case 'odd-one-out':
      return <OddOneOutGame {...props} />;
    case 'picture-puzzle':
      return <PicturePuzzleGame {...props} />;
    case 'complete-pattern':
      return <CompletePatternGame {...props} />;
    case 'find-difference':
      return <FindDifferenceGame {...props} />;

    // F: Creativity & Daily Life
    case 'coloring-fun':
      return <ColoringFunGame {...props} />;
    case 'cut-and-paste':
      return <CutAndPasteGame {...props} />;
    case 'simple-maze':
      return <SimpleMazeGame {...props} />;
    case 'healthy-food':
      return <HealthyFoodGame {...props} />;
    case 'emotion-matching':
      return <EmotionMatchingGame {...props} />;
  }
}
