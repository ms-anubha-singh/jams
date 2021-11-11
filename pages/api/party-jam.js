import fire from '../../config/firebaseAdminConfig';
import ensureAdmin from 'utils/admin-auth-middleware.js';

export default async function handler(req, res) {
  const {
    query: { partyId },
    method,
  } = req;

  if (method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${method} Not Allowed`);
    return;
  }

  if (!partyId) {
    res.status(404).end();
    return;
  }

  // TODO get the jamId and vote from VOTES subcollection
  // based on participantId
  const db = fire.firestore();

  const votesRef = await db
    .collection('participants')
    .doc(partyId)
    .collection('votes');

  const allVotes = await votesRef.get().then((query) => {
    let votes = [];

    query.forEach((document) => {
      const getVotes = document.data();
      votes.push(getVotes);
    });

    return votes;
  });

  res.status(200).json(allVotes);
}
