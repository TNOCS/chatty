import { createApi, db } from 'rest-easy-loki';

export const collectionName = 'documents';

const port = process.env.LOKI_PORT || '4567';
const dbName = process.env.LOKI_DB || './db/chatty.db';
const cors = (process.env.LOKI_CORS || 'true') === 'true';
const sizeLimit = process.env.LOKI_SIZE_LIMIT || '250mb';

export const startService = () => {
  db.startDatabase(dbName, () => {
    const { api, server } = createApi({ cors, sizeLimit, upload: './upload', io: true });
    (server || api).listen(port);
    console.log(`Server running on port ${port}.`);
  });
};
startService();
