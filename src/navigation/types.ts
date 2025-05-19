export type RootTabParamList = {
  Home: undefined;
  Einstellungen: undefined;
  Profil: undefined;
};

export type RootStackParamList = {
  Tabs: undefined;
  ClassicSettings: undefined;
  ChallengeSettings: undefined;
  PartySettings: undefined;
  GameOverlay: {
    track: {
      uri: string;
      title: string;
      artist: string;
      year: string;
      genre: string;
      image: string;
    };
  };
};

