import fire from '../../config/firebaseAdminConfig';
import ensureAdmin from 'utils/admin-auth-middleware.js';

export default async function handler(req, res) {
  const {
    query: { jamId },
    method,
  } = req;

  if (method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${method} Not Allowed`);
    return;
  }

  if (!jamId) {
    res.status(404).end();
    return;
  }

  try {
    let token;
    try {
      token = await ensureAdmin(req, res);
    } catch (error) {
      return res
        .status(500)
        .json({ error: 'Sorry, permission denied' });
    }
    const db = fire.firestore();

    const jamsRef = await db
      .collection('jams')
      .doc(jamId)
      .get()
      .then((query) => {
        let jam = {};

        const queryData = query.data();
        jam.title = queryData.name;
        jam.description = queryData.description;

        return jam;
      });

    res.status(200).json(jamsRef);
  } catch {
    return res
      .status(500)
      .json({ error: 'Sorry, something went wrong' });
  }
}
