import ensureAdmin from 'utils/admin-auth-middleware';
import fire from '../../config/firebaseAdminConfig';

async function handler(req, res) {
  const {
    query: { searchTerm },
    method,
  } = req;

  try {
    // const token = await ensureAdmin(req, res);
    const db = fire.firestore();
    const searchRef = db.collection('jams');
    const titles = await searchRef.get().then((queryDocSnapshot) => {
      let titles = [];

      queryDocSnapshot.forEach((document) => {
        const jamData = document.data();
        titles.push(jamData.name);
      });

      return titles;
    });

    const foundTitle = titles.filter((qText) =>
      qText.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return res.status(200).json({ titles: foundTitle });
  } catch (error) {
    res.status(500).json({ error: error });
  }
}

export default handler;
