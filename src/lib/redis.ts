import Redis from 'ioredis';

export const redis = new Redis({
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
  host: process.env.REDIS_HOST ?? '127.0.0.1',
  username: process.env.REDIS_USERNAME ?? undefined,
  password: process.env.REDIS_PASSWORD ?? undefined,
  db: process.env.REDIS_DB ? parseInt(process.env.REDIS_DB) : 0,
  maxRetriesPerRequest: null,
});

export const getRedisJson = async <T = any>(key: string) => {
  const data = await redis.get(key);
  return data ? (JSON.parse(data) as T) : null;
};

export const setRedisJson = async (key: string, value: any, expireTime?: number) => {
  return expireTime
    ? await redis.set(key, JSON.stringify(value), 'EX', expireTime)
    : await redis.set(key, JSON.stringify(value));
};

export const delRedis = async (key: string) => {
  return await redis.del(key);
};
