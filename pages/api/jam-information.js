import fire from '../../config/firebaseAdminConfig';
import ensureAdmin from 'utils/admin-auth-middleware';
import ObjectsToCsv from 'objects-to-csv';

async function handler(req, res) {
  const {
    query: { jamId, contentType },
    method,
  } = req;

  if (method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${method} Not Allowed`);
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

    const jamsRef = db.collection('jams');
    const statementsRef = db
      .collection('jams')
      .doc(jamId)
      .collection('statements');

    const allStatements = await statementsRef.get().then((query) => {
      let statements = [];

      query.forEach((document) => {
        const getStatment = document.data();
        statements.push(getStatment);
      });
      return statements;
    });

    const jam = await jamsRef
      .doc(jamId)
      .get()
      .then((doc) => {
        const data = doc.data();
        if (data.adminId != token.sub) {
          throw new Error('Permission denied');
        }
        return data;
      });

    if (contentType === 'text/csv') {
      const csv = await new ObjectsToCsv(
        Object.values({
          jam: jam,
          statement: allStatements,
        }),
      );
      res.setHeader('Content-Type', contentType);
      res.status(200);
      res.send(await csv.toString());
    } else {
      return res
        .status(200)
        .json({ jam: jam, statement: allStatements });
    }

    return;
  } catch {
    return res
      .status(500)
      .json({ error: 'Sorry, something went wrong' });
  }
}

export default handler;
