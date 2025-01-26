import Loki from 'lokijs';
import { Vote } from '@/types/localTypes';
import { create } from 'zustand';

type DBState = {
  db: Loki | null;
  facesCollection: Collection<Float32Array> | null;
  votesCollection: Collection<Vote> | null;
  isReady: boolean;
  faces: (Float32Array & LokiObj)[];
  votes: (Vote & LokiObj)[];
};

type DBStore = DBState & {
  init: () => Promise<void>;
  addFaces: (doc: Float32Array) => Float32Array | undefined;
  getAllFaces: () => (Float32Array & LokiObj)[];
  deleteAllFromDB: () => void;
  addVotes: (vote: Vote) => Vote | undefined;
  getAllVotes: () => (Vote & LokiObj)[];
};

export const useStore = create<DBStore>((set, get) => ({
  db: null,
  facesCollection: null,
  votesCollection: null,
  isReady: false,
  faces: [],
  votes: [],

  init: async () => {
    return new Promise((resolve) => {
      const db = new Loki('face.db', {
        autoload: true,
        autoloadCallback: () => {
          const facesCollection =
            db.getCollection('faces') || db.addCollection('faces');
          const votesCollection =
            db.getCollection('votes') || db.addCollection('votes');
          set({
            db,
            facesCollection,
            votesCollection,
            isReady: true,
            faces: facesCollection.find(),
            votes: votesCollection.find(),
          });
          resolve();
        },
        autosave: true,
      });
    });
  },

  addFaces: (doc) => {
    const result = get().facesCollection?.insert(doc);
    set({ faces: get().facesCollection?.find() || [] });
    return result;
  },

  getAllFaces: () => get().faces,

  deleteAllFromDB: () => {
    get().facesCollection?.clear();
    get().votesCollection?.clear();
    set({ faces: [] });
  },

  addVotes: (vote) => get().votesCollection?.insert(vote),

  getAllVotes: () => get().votesCollection?.find() || [],
}));
