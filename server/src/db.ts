import mongoose from 'mongoose';

export async function connectDb(mongoUri: string) {
  await mongoose.connect(mongoUri);
}

export function dbHealth() {
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  const state = mongoose.connection.readyState;
  return {
    ok: state === 1,
    state,
  };
}
