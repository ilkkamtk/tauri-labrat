import Loki from 'lokijs';

type Thumb = 'Thumb_Up' | 'Thumb_Down';

type Vote = {
  faceName: string;
  vote: Thumb;
};

type DBState =
  | { status: 'initializing' }
  | {
      status: 'ready';
      db: Loki;
      faces: Loki.Collection<Float32Array>;
      votes: Loki.Collection<Vote>;
    }
  | { status: 'error'; error: Error };

export type { Thumb, Vote, DBState };
