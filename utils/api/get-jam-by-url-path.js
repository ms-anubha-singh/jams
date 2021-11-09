import fire from '../../config/firebaseAdminConfig';
import ensureAdmin from 'utils/admin-auth-middleware';

export async function getJamByUrlPath(
  jamUrlPath,
  includeStatements,
  req,
  res,
) {
  const db = fire.firestore();
  const jamsRef = db.collection('jams');

  var queryPath = jamsRef.where('urlPath', '==', jamUrlPath);

  var token;
  try {
    if (includeStatements) {
      token = await ensureAdmin(req, res);
      queryPath = queryPath.where('adminId', '==', token.sub);
    }
  } catch (e) {
    // No session here so no change to queryPath needed
  }

  const finalJam = await queryPath.get().then((querySnapshot) => {
    let jams = [];
    querySnapshot.forEach((doc) => {
      const jam = doc.data();
      jam.key = doc.id;
      jams.push(jam);
    });
    return jams[0];
  });

  if (!includeStatements || !finalJam) {
    return finalJam;
  }

  finalJam.statements = await jamsRef
    .doc(finalJam.key)
    .collection('statements')
    .get()
    .then((query) => {
      const statements = [];
      query.forEach((doc) => {
        const statement = doc.data();
        statement.key = doc.id;
        statements.push(statement);
      });
      return statements;
    });

  return finalJam;
}
