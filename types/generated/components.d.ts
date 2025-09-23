import type { Schema, Struct } from '@strapi/strapi';

export interface MusicMusic extends Struct.ComponentSchema {
  collectionName: 'components_music_music';
  info: {
    displayName: 'music';
    icon: 'music';
  };
  attributes: {
    appleLink: Schema.Attribute.String;
    poster: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    spotifyLink: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface SharedcardSharedCard extends Struct.ComponentSchema {
  collectionName: 'components_sharedcard_shared_cards';
  info: {
    displayName: 'shared.card';
    icon: 'stack';
  };
  attributes: {
    buttonLabel: Schema.Attribute.String;
    buyLink: Schema.Attribute.String;
    description: Schema.Attribute.Blocks;
    poster: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    spoiler: Schema.Attribute.Blocks;
    title: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'music.music': MusicMusic;
      'sharedcard.shared-card': SharedcardSharedCard;
    }
  }
}
