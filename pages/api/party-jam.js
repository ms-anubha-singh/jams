import fire from '../../config/firebaseAdminConfig';
import ensureAdmin from 'utils/admin-auth-middleware.js';

export default async function handler(req, res) {
  const {
    query: { participantId },
    method,
  } = req;

  if (method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${method} Not Allowed`);
    return;
  }

  if (!participantId) {
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

    const votesRef = await db
      .collection('participants')
      .doc(participantId)
      .collection('votes');

    const allVotes = await votesRef.get().then((query) => {
      let votes = [];

      query.forEach((document) => {
        const getVotes = document.data();
        votes.push(getVotes);
      });

      console.log(votes);
      return votes;
    });

    res.status(200).json(allVotes);
  } catch {
    return res.status(500).json({
      error:
        'Sorry, something went wrong. Check if you have exceed you daily usage.',
    });
  }
}
