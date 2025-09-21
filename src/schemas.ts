import { z } from 'zod';

export const processVideoSchema = z.object({
  videoId: z.string(),
  filePath: z.string(),
});
